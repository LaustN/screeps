module.exports = function (room) {
  var creepsByType = {
    "work": [],
    "move": [],
    "mix": []
  };

  var creepsByRole = {
    "harvester": [],
    "builder": [],
    "controlUpgrader": [],
    "fortifier": [],
    "repairer": [],
    
    "harvestTruck": [],
    "resupplyBuildings":[],
    "stockpile":[],
    "resupplyWorkers":[],
    "looter" :[],
    "scavenger" :[],
  
    "remoteHarvester":[],
    "remoteCollector":[]
    };

  var assignRole = function (creep, role) {
    if (creep.memory.role != role) {
      creep.say(role);
    }
    creep.memory.role = role;
  };
  
  var creeps = _.filter(Game.creeps,function(creep){
    return creep.name.startsWith(room.name);
  });

  var sortByRole = function(){

  };

  for (var creepIndex in creeps) {
    var creep = creeps[creepIndex];
    if (!creepsByType[creep.memory.type])
      creepsByType[creep.memory.type] = [];
    creepsByType[creep.memory.type].push(creep);
  }


  var workAssignmentCount = 0;
  var moveAssignmentCount = 0;
  var mixAssignmentCount = 0;
  //does every source have a work and a move?

  var sources = room.find(FIND_SOURCES);

  var remainingMixers = creepsByType["mix"];

  for (var sourceIndex in sources) {
    var existingHarvester = _.find(creepsByType["work"], function (worker) {
      var isMyHarvester = ((worker.memory.focus == sources[sourceIndex].id) && (worker.memory.role == "harvester"));
      return isMyHarvester;
    });
    if (!existingHarvester) {

      var existingNonHarvester = _.find(creepsByType["work"], function (worker) {
        var isAHarvester = (worker.memory.role == "harvester")
        return !isAHarvester;
      });

      if (existingNonHarvester) {
        assignRole(existingNonHarvester, "harvester");
        existingNonHarvester.memory.focus = sources[sourceIndex].id;
      } else {
        if (remainingMixers.length) {
          var mixToAssign = remainingMixers[0];
          remainingMixers = _.drop(remainingMixers, 1);
          assignRole(mixToAssign, "harvester");
          mixToAssign.memory.focus = sources[sourceIndex].id;
        }
      }
    }

    var existingHarvestTruck = _.find(creepsByType["move"], function (mover) {
      return (mover.memory.focus == sources[sourceIndex].id) && (mover.memory.role == "harvestTruck");
    });
    if (!existingHarvestTruck) {
      var existingNonHarvestTruck = _.find(creepsByType["move"], function (mover) {
        var isATruck = (mover.memory.role == "harvestTruck")
        return !isATruck;
      });
      if (existingNonHarvestTruck) {
        assignRole(existingNonHarvestTruck, "harvestTruck");
        existingNonHarvestTruck.memory.focus = sources[sourceIndex].id;
      } else {
        if (remainingMixers.length) {
          var mixToAssign = remainingMixers[0];
          remainingMixers = _.drop(remainingMixers, 1);
          assignRole(mixToAssign, "harvestTruck");
          mixToAssign.memory.focus = sources[sourceIndex].id;
        }
      }
    }
  }

  var fullHarvesters = room.find(FIND_MY_CREEPS, {
    filter: function (harvester) {
      if ((harvester.memory.role == "harvester") && (_.sum(harvester.carry) == harvester.carryCapacity))
        return true;
      return false;
    }
  });

  for (var harvesterIndex in fullHarvesters) {
    var harvester = fullHarvesters[harvesterIndex];


    var matchingHarvetTrucks = room.find(FIND_MY_CREEPS, {
      filter: function (matchingTruck) {
        if ((matchingTruck.memory.focus == harvester.memory.focus) && (matchingTruck.memory.role == "harvestTruck"))
          return true;
        return false;
      }
    });

    if (matchingHarvetTrucks.length == 0) {
      harvester.role = "harvestTruck";
    }
  }

  var remainingWorkers = [];
  for (var workerIndex in creepsByType["work"]) {
    var worker = creepsByType["work"][workerIndex];
    if (worker.memory.role != "harvester")
      remainingWorkers.push(worker);

  }

  var remainingMovers = [];
  for (var moverIndex in creepsByType["move"]) {
    var mover = creepsByType["move"][moverIndex];
    if (mover.memory.role != "harvestTruck")
      remainingMovers.push(mover);

  }

  while (remainingMixers.length) {
    remainingWorkers = remainingWorkers.concat([remainingMixers[0]]);
    remainingMixers = _.drop(remainingMixers, 1);
    if (remainingMixers.length) {
      remainingMovers = remainingMovers.concat([remainingMixers[0]]);
      remainingMixers = _.drop(remainingMixers, 1);
    }
  }


  var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: function (structure) {
      if (structure.structureType == STRUCTURE_WALL)
        return false;
      if (structure.structureType == STRUCTURE_RAMPART)
        return false;
      return true;
    }
  });
  var buildingsThatNeedsRepairs = room.find(FIND_STRUCTURES, {
    filter: function (structure) {
      if (!structure.hits)
        return false;

      if (structure.structureType == STRUCTURE_WALL)
        return false;
      if (structure.structureType == STRUCTURE_RAMPART)
        return false;

      if (structure.hits < structure.hitsMax) {
        return true;
      }
      return false;
    }
  });

  var desiredHitsPerWall = room.controller.level * 10000;
  if (room.controller.level > 7) {
    desiredHitsPerWall = 300000000;
  }

  var wornWalls = room.find(FIND_STRUCTURES, {
    filter: function (structure) {
      if (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
        return false;
      if (structure.hits < desiredHitsPerWall)
        return true;
      return false;
    }
  });
  var plannedFortifications = room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: function (structure) {
      if (structure.structureType == STRUCTURE_WALL)
        return true;
      if (structure.structureType == STRUCTURE_RAMPART)
        return true;
      return false;
    }
  })

  var storingStructures = room.find(FIND_STRUCTURES, {filter: function(structure){
    if(structure.storeCapacity)
      return true;
    return false;
  }});
  var storedEnergy = _.reduce(storingStructures, function (collector, structure) {
    return collector + structure.store[RESOURCE_ENERGY];
  }, 0);


  while (remainingWorkers.length) {
    //assign extra workers

    if (room.controller && room.controller.my && (room.controller.ticksToDowngrade < 4000)) {
      assignRole(remainingWorkers[0], "controlUpgrader");
      remainingWorkers = _.drop(remainingWorkers, 1);
    }

    if (remainingWorkers.length == 0)
      break;

    if (constructionSites.length > 0) {
      assignRole(remainingWorkers[0], "builder");
      remainingWorkers = _.drop(remainingWorkers, 1);
    }
    if (remainingWorkers.length == 0)
      break;

    if (buildingsThatNeedsRepairs.length > 0) {

      assignRole(remainingWorkers[0], "repairer");
      remainingWorkers = _.drop(remainingWorkers, 1);
    }
    if (remainingWorkers.length == 0)
      break;

    if (room.controller.level >= 2 && ((wornWalls.length > 0)) || (plannedFortifications.length > 0)) {
      assignRole(remainingWorkers[0], "fortifier");
      remainingWorkers = _.drop(remainingWorkers, 1);
      if (remainingWorkers.length == 0)
        break;
    }

    if (storedEnergy > 5000) {
      assignRole(remainingWorkers[0], "controlUpgrader");
      remainingWorkers = _.drop(remainingWorkers, 1);
      if (remainingWorkers.length == 0)
        break;
    }
  }

  var hungryBuildings = room.find(FIND_MY_STRUCTURES, {
    filter: function (structure) {
      if (structure.structureType == STRUCTURE_LINK)
        return false; //links do not get resupplied
      if (structure.energyCapacity && structure.energyCapacity > structure.energy)
        return true;
      return false;
    }
  });

  if (remainingMovers.length == 0 && hungryBuildings.length > 0) {
    assignRole(creepsByType["move"][0], 'resupplyBuildings'); //when buildings are hungry, having a harvesttruck just standing around is senseless 
  }

  var scavenger = null;
  while (remainingMovers.length > 0) {
    //
    //TODO: make the movers balance resupplying workers, refill spawn and 

    if (hungryBuildings.length > 0) {
      assignRole(remainingMovers[0], "resupplyBuildings");
      remainingMovers = _.drop(remainingMovers, 1);
    }
    if (remainingMovers.length == 0)
      break;

    if (room.storage && (room.find(FIND_STRUCTURES, { filter: function (structure) { return (structure.structureType == STRUCTURE_CONTAINER); } }).length > 0)) {
      assignRole(remainingMovers[0], "stockpile");
      remainingMovers = _.drop(remainingMovers, 1);
    }
    if (remainingMovers.length == 0)
      break;

    assignRole(remainingMovers[0], "resupplyWorkers");
    remainingMovers = _.drop(remainingMovers, 1);
    if (remainingMovers.length == 0)
      break;

    if (!scavenger) {
      var droppedEnergies = room.find(FIND_DROPPED_ENERGY);
      if (droppedEnergies.length > 0) {
        scavenger = remainingMovers[0];

        if (_.sum(scavenger.carry) > 0) {
          if (hungryBuildings.length > 0) {
            assignRole(scavenger, "resupplyBuildings")
          }
          else {
            assignRole(scavenger, "resupplyWorkers")
          }
        }
        else {
          assignRole(scavenger, "scavenger")
        }

        remainingMovers = _.drop(remainingMovers, 1);
      }


      if (remainingMovers.length == 0)
        break;
    }
    //still need to figure out "looter" role assignment
  }

  //check xxxAssignmentCount against creepsByType[all3Types], possibly assign roles

}

