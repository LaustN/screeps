module.exports = function (room) {

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
      return (worker.memory.focus == sources[sourceIndex].id) && (worker.memory.role == "harvester");
    });
    if (typeof (existingHarvester) == "undefined") {
      var existingNonHarvester = _.find(creepsByType["work"], function (worker) {
        return (worker.memory.role != "harvester");
      });
      if (typeof (existingNonHarvester) != "undefined") {
        existingNonHarvester.memory.role = "harvester";
        existingNonHarvester.memory.focus = sources[sourceIndex].id;
      } else {
        if (remainingMixers.length) {
          var mixToAssign = remainingMixers[0];
          remainingMixers = _.drop(remainingMixers, 1);
          mixToAssign.memory.role = "harvester";
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
        existingNonHarvestTruck.memory.role = "harvestTruck";
        existingNonHarvestTruck.memory.focus = sources[sourceIndex].id;
      } else {
        if (remainingMixers.length) {
          var mixToAssign = remainingMixers[0];
          remainingMixers = _.drop(remainingMixers, 1);
          mixToAssign.memory.role = "harvestTruck";
          mixToAssign.memory.focus = sources[sourceIndex].id;
        }
      }
    }
  }

  var fullHarvesters = room.find(FIND_MY_CREEPS,{filter: function(harvester){
    if(harvester.memory.role == "harvester" && _.sum(harvester.carry) == harvester.carryCapacity)
      return true;
    return false;
  }});
  
  for(var harvesterIndex in fullHarvesters){
    var harvester = fullHarvesters[harvesterIndex];
    console.log("A full harvester found: " + harvester.name);
    
    var matchingHarvetTrucks = room.find(FIND_MY_CREEPS,{filter:function(matchingTruck){
      if( (matchingTruck.memory.focus == harvester.memory.focus) && matchingTruck.memory.role == "harvestTruck" )
        return true;
      return false;
    }});

    if(matchingHarvetTrucks.length == 0){
      harvester.role = "harvestTruck";
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
  var buildingsThatNeedsRepairs = room.find(FIND_STRUCTURES, function (structure) {
    if (structure.hits == structure.hitsMax)
      return false;
    if (
      structure.structureType == STRUCTURE_WALL
      || structure.structureType == STRUCTURE_RAMPART)
      return false;
    return true;
  });

  while (remainingWorkers.length) {
    //assign extra workers

    if (room.controller && room.controller.my && (room.controller.ticksToDowngrade < 1000)) {
      remainingWorkers[0].memory.role = "controlUpgrader";
      remainingWorkers = _.drop(remainingWorkers, 1);
    }

    if (remainingWorkers.length == 0)
      break;

    if (constructionSites.length > 0) {
      remainingWorkers[0].memory.role = "builder";
      remainingWorkers = _.drop(remainingWorkers, 1);
    }
    if (remainingWorkers.length == 0)
      break;

    if (buildingsThatNeedsRepairs.length > 0) {
      remainingWorkers[0].memory.role = "repairer";
      remainingWorkers = _.drop(remainingWorkers, 1);
    }
    if (remainingWorkers.length == 0)
      break;

    remainingWorkers[0].memory.role = "fortifier";
    remainingWorkers = _.drop(remainingWorkers, 1);
    if (remainingWorkers.length == 0)
      break;

    remainingWorkers[0].memory.role = "controlUpgrader";
    remainingWorkers = _.drop(remainingWorkers, 1);
    if (remainingWorkers.length == 0)
      break;
  }

  var scavengerAssigned = false;
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
      remainingMovers[0].memory.role = "resupplyBuildings";
      remainingMovers = _.drop(remainingMovers, 1);
    }
    if (remainingMovers.length == 0)
      break;

    if (room.storage && (room.find(FIND_STRUCTURES, { filter: function (structure) { return (structure.structureType == STRUCTURE_CONTAINER); } }).length > 0)) {
      remainingMovers[0].memory.role = "stockpile";
      remainingMovers = _.drop(remainingMovers, 1);
    }
    if (remainingMovers.length == 0)
      break;

    if (!scavengerAssigned) {
      var droppedEnergies = room.find(FIND_DROPPED_ENERGY);
      if (droppedEnergies.length > 0) {
        remainingMovers[0].memory.role = "scavenger";
        remainingMovers = _.drop(remainingMovers, 1);
        scavengerAssigned = true;
      }
      if (remainingMovers.length == 0)
        break;
    }

    remainingMovers[0].memory.role = "resupplyWorkers";
    remainingMovers = _.drop(remainingMovers, 1);

    //still need to figure out "looter" role assignment

  }

  //check xxxAssignmentCount against creepsByType[all3Types], possibly assign roles

}

