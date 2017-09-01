module.exports = function (room) {

  var assignRole = function(creep, role){
    if(creep && role){
      if(creep.memory.role != role){
        creep.say(role);
      }
      creep.memory.role = role;
    }
  };


  var creeps = room.find(FIND_MY_CREEPS);

  var creepsByType = {
    "work": [],
    "move": [],
    "mix": []
  };
  var creepsByRole = {};

  creeps.forEach(function (creep) {
    if (typeof (creepsByType[creep.memory.type]) != "undefined") {
      if (typeof (creepsByType[creep.memory.type]) == "undefined") {
        creepsByType[creep.memory.type] = [];
      }
      creepsByType[creep.memory.type].push(creep);
    }

    if (typeof (creepsByRole[creep.memory.role]) != "undefined") {
      if (typeof (creepsByRole[creep.memory.role]) == "undefined") {
        creepsByRole[creep.memory.role] = [];
      }
      creepsByRole[creep.memory.role].push(creep);
    }
  });


  var workAssignmentCount = 0;
  var moveAssignmentCount = 0;
  var mixAssignmentCount = 0;
  //does every source have a work and a move?

  var sources = room.find(FIND_SOURCES);

  var remainingMixers = creepsByType["mix"];

  for (var sourceIndex in sources) {
    var existingHarvester = _.find(creepsByType["work"], function (worker) {
      return ((worker.memory.focus == sources[sourceIndex].id) && (worker.memory.role == "harvester"));
    });
    if (typeof (existingHarvester) == "undefined") {
      var existingNonHarvester = _.find(creepsByType["work"], function (worker) {
        return (worker.memory.role != "harvester");
      });
      if (typeof (existingNonHarvester) != "undefined") {
        assignRole(existingHarvester,"harvester");
        existingNonHarvester.memory.focus = sources[sourceIndex].id;
      } else {
        if (remainingMixers.length) {
          var mixToAssign = remainingMixers[0];
          remainingMixers = _.drop(remainingMixers, 1);
          assignRole(mixToAssign,"harvester");
          mixToAssign.memory.focus = sources[sourceIndex].id;
        }
      }

    }

    var existingHarvestTruck = _.find(creepsByType["move"], function (worker) {
      return (worker.memory.focus == sources[sourceIndex].id) && (worker.memory.role == "harvestTruck");
    });
    if (typeof (existingHarvestTruck) == "undefined") {
      var existingNonHarvestTruck = _.find(creepsByType["move"], function (worker) {
        return (worker.memory.role != "harvestTruck");
      });
      if (typeof (existingNonHarvestTruck) != "undefined") {
        assignRole(existingNonHarvester,"harvestTruck");
        existingNonHarvestTruck.memory.focus = sources[sourceIndex].id;
      } else {
        if (remainingMixers.length) {
          var mixToAssign = remainingMixers[0];
          remainingMixers = _.drop(remainingMixers, 1);
          assignRole(mixToAssign,"harvestTruck");
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
    console.log("A full harvester found: " + harvester.name);

    var matchingHarvetTrucks = room.find(FIND_MY_CREEPS, {
      filter: function (matchingTruck) {
        if ((matchingTruck.memory.focus == harvester.memory.focus) && (matchingTruck.memory.role == "harvestTruck"))
          return true;
        return false;
      }
    });

    if (matchingHarvetTrucks.length == 0) {
      harvester.role = "harvestTruck";
      console.log("reassigning harvester as harvestTruck, since noone will be picking up any time soon");

    }
  }

  var remainingWorkers = _.filter(creepsByType["work"], function (worker) {
    if (worker.memory.role != "harvester")
      return true;
    return false;
  });

  var remainingMovers = _.filter(creepsByType["move"], function (mover) {
    if (mover.memory.role == "harvestTruck")
      return false;
    return true;
  });

  while (remainingMixers.length) {
    remainingWorkers = remainingWorkers.concat([remainingMixers[0]]);
    remainingMixers = _.drop(remainingMixers, 1);
    if (remainingMixers.length) {
      remainingMovers = remainingMovers.concat([remainingMixers[0]]);
      remainingMixers = _.drop(remainingMixers, 1);
    }
  }


  var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
  var buildingsThatNeedsRepairs = room.find(FIND_STRUCTURES, {
    filter: function (structure) {
      if (!structure.hits)
        return false;

      if (structure.hits < structure.hitsMax) {
        return true;
      }
      return false;
    }
  });

  var desiredHitsPerWall = room.controller.level * 500;
  if (room.controller.level > 7) {
    desiredHitsPerWall = 300000000;
  }

  var wornWalls = room.find(FIND_STRUCTURES,{filter: function(structure){
    if(structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART  )
      return false;
    if(structure.hits < desiredHitsPerWall)
      return true;
    return false;
  }});

  while (remainingWorkers.length) {
    //assign extra workers

    if (room.controller && room.controller.my && (room.controller.ticksToDowngrade < 4000)) {
      assignRole(remainingWorkers[0],"controlUpgrader");
      remainingWorkers = _.drop(remainingWorkers, 1);
    }

    if (remainingWorkers.length == 0)
      break;

    if (constructionSites.length > 0) {
      assignRole(remainingWorkers[0],"builder");
      remainingWorkers = _.drop(remainingWorkers, 1);
    }
    if (remainingWorkers.length == 0)
      break;

    if (buildingsThatNeedsRepairs.length > 0) {
      console.log("someone here needs repairs" + JSON.stringify(buildingsThatNeedsRepairs));
      assignRole(remainingWorkers[0],"repairer");
      remainingWorkers = _.drop(remainingWorkers, 1);
    }
    if (remainingWorkers.length == 0)
      break;

    if (room.controller.level >= 2 && (wornWalls.length > 0)) {
      assignRole(remainingWorkers[0],"fortifier");
      remainingWorkers = _.drop(remainingWorkers, 1);
      if (remainingWorkers.length == 0)
        break;
    }

    assignRole(remainingWorkers[0],"controlUpgrader");
    remainingWorkers = _.drop(remainingWorkers, 1);
    if (remainingWorkers.length == 0)
      break;
  }

  var scavenger = null;
  while (remainingMovers.length > 0) {
    //
    //TODO: make the movers balance resupplying workers, refill spawn and 

    var hungryBuildings = room.find(FIND_MY_STRUCTURES, {
      filter: function (structure) {
        if (structure.structureType == STRUCTURE_LINK)
          return false; //links do not get resupplied
        if (structure.energyCapacity && structure.energyCapacity > structure.energy)
          return true;
        return false;
      }
    });
    if (hungryBuildings.length > 0) {
      assignRole(remainingMovers[0],"resupplyBuildings");
      remainingMovers = _.drop(remainingMovers, 1);
    }
    if (remainingMovers.length == 0)
      break;

    if (room.storage && (room.find(FIND_STRUCTURES, { filter: function (structure) { return (structure.structureType == STRUCTURE_CONTAINER); } }).length > 0)) {
      assignRole(remainingMovers[0],"stockpile");
      remainingMovers = _.drop(remainingMovers, 1);
    }
    if (remainingMovers.length == 0)
      break;

    assignRole(remainingMovers[0],"resupplyWorkers");
    remainingMovers = _.drop(remainingMovers, 1);
    if (remainingMovers.length == 0)
      break;

    if (!scavenger) {
      var droppedEnergies = room.find(FIND_DROPPED_ENERGY);
      if (droppedEnergies.length > 0) {
        scavenger = remainingMovers[0];

        if(_.sum(scavenger.carry) > 0){
          if(hungryBuildings.length>0){
            assignRole(scavenger,"resupplyBuildings")
          }
          else{
            assignRole(scavenger,"resupplyWorkers")
          }
        }
        else{
          assignRole(scavenger,"scavenger")
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

