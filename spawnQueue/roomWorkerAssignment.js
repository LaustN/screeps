module.exports = function (room) {
  var creeps = _.filter(Game.creeps, function (creep) {
    return creep.name.startsWith(room.name);
  });

  var creepsByType = {
    "work": [],
    "move": [],
    "mix": []
  };

  var creepsByRole = {};

  var sortByRole = function () {
    creepsByRole = {};
    for (var creepIndex in creeps) {
      var creep = creeps[creepIndex];
      if (!creepsByRole[creep.memory.role])
        creepsByRole[creep.memory.role] = [];
      creepsByRole[creep.memory.role].push(creep);
    }
  };

  var sortByType = function () {
    creepsByType = {
      "work": [],
      "move": []
    };
    for (var creepIndex in creeps) {
      var creep = creeps[creepIndex];
      if (!creepsByType[creep.memory.type])
        creepsByType[creep.memory.type] = [];
      creepsByType[creep.memory.type].push(creep);
    }
  };

  sortByRole();
  sortByType();

  var getLowPrioWorker = function () {
    var workerRolesAscendingPriority =
      [
        "pausedWorker",
        "controlUpgrader",
        "fortifier",
        "repairer",
        "remoteHarvester",
        "builder",
        "harvestTruck",
        "harvester"
      ];
    for (var roleIndex in workerRolesAscendingPriority) {
      var roleName = workerRolesAscendingPriority[roleIndex];
      if (creepsByRole[roleName] && creepsByRole[roleName].length > 0) {
        return creepsByRole[roleName][0];
      }
    }
    return null;
  }
  var getLowPrioMover = function () {
    var moverRolesAscendingPriority =
      [
        "pausedMover",
        "resupplyWorkers",
        "stockpile",
        "looter",
        "scavenger",
        "remoteHarvestCollector",
        "resupplyBuildings",
        "harvestTruck"
      ];
    for (var roleIndex in moverRolesAscendingPriority) {
      var roleName = moverRolesAscendingPriority[roleIndex];
      if (creepsByRole[roleName] && creepsByRole[roleName].length > 0) {
        return creepsByRole[roleName][0];
      }
    }
    return null;
  }

  var assignRole = function (creep, role) {
    if (creep.memory.role != role) {
      creep.say(role);
    }
    creep.memory.role = role;
    sortByRole();
  };

  var adjustWorkerRoleCount = function (role, count) {
    if (!creepsByRole[role]) {
      creepsByRole[role] = [];
    }
    if (creepsByRole.length < count) {
      while (creepsByRole[role].length < count) {
        var repurposedWorker = getLowPrioWorker()
        assignRole(repurposedWorker, role);
      }
    }
    else {
      while (creepsByRole[role] && creepsByRole[role].length > count) {
        assignRole(creepsByRole[role][0], "pausedWorker");
      }
    }
  }

  var adjustMoverRoleCount = function (role, count) {
    if (!creepsByRole[role]) {
      creepsByRole[role] = [];
    }
    if (creepsByRole.length < count) {
      while (creepsByRole[role].length < count) {
        var repurposedWorker = getLowPrioMover()
        assignRole(repurposedWorker, role);
      }
    }
    else {
      while (creepsByRole[role] && creepsByRole[role].length > count) {
        assignRole(creepsByRole[role][0], "pausedMover");
      }
    }
  }

  var workAssignmentCount = 0;
  var moveAssignmentCount = 0;
  //does every source have a work and a move?

  var sources = room.find(FIND_SOURCES);
  for (var sourceIndex in sources) {
    var existingHarvester = _.find(creepsByRole["harvester"], function (harvester) {
      var isMyHarvester = (harvester.memory.focus == sources[sourceIndex].id);
      return isMyHarvester;
    });

    if (!existingHarvester) {

      var existingNonHarvester = getLowPrioWorker();
      if (existingNonHarvester) {
        assignRole(existingNonHarvester, "harvester");
        existingNonHarvester.memory.focus = sources[sourceIndex].id;
      }
    }

    var existingHarvestTruck = _.find(creepsByRole["harvestTruck"], function (mover) {
      return mover.memory.focus == sources[sourceIndex].id;
    });
    if (!existingHarvestTruck) {
      var existingNonHarvestTruck = getLowPrioMover();
      if (existingNonHarvestTruck) {
        assignRole(existingNonHarvestTruck, "harvestTruck");
        existingNonHarvestTruck.memory.focus = sources[sourceIndex].id;
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

  var storingStructures = room.find(FIND_STRUCTURES, {
    filter: function (structure) {
      if (structure.storeCapacity)
        return true;
      return false;
    }
  });
  var storedEnergy = _.reduce(storingStructures, function (collector, structure) {
    return collector + structure.store[RESOURCE_ENERGY];
  }, 0);


  var upgraderWanted = (room.controller && room.controller.my) && ((room.controller.ticksToDowngrade < 4000) || storedEnergy > 100000);
  if(upgraderWanted){
    adjustWorkerRoleCount("controlUpgrader",1);
  }
  else{
    adjustWorkerRoleCount("controlUpgrader",0);
  }


  var builderWanted = (constructionSites.length > 0);
  if(builderWanted){
    adjustWorkerRoleCount("builder",1);
  }
  else{
    adjustWorkerRoleCount("builder",0);
  }


  var repairerWanted = buildingsThatNeedsRepairs.length > 0;
  if(repairerWanted){
    adjustWorkerRoleCount("repairer",1);
  }
  else{
    adjustWorkerRoleCount("repairer",0);
  }


  var fortifierWanted = (room.controller.level >= 2 && ((wornWalls.length > 0)) || (plannedFortifications.length > 0));
  if(repairerWanted){
    adjustWorkerRoleCount("fortifier",1);
  }
  else{
    adjustWorkerRoleCount("fortifier",0);
  }

  if (storedEnergy > 500000 && creepsByRole["pausedWorker"] && creepsByRole["pausedWorker"].length) {
    adjustWorkerRoleCount("controlUpgrader",creepsByRole["pausedWorker"].length + (upgraderWanted?1:0));
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
  var stockpilerWanted = (
    room.storage 
    && (
      room.find(FIND_STRUCTURES, { filter: function (structure) { 
        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK ); 
      } }).length > 0)

  );

  var droppedEnergies = room.find(FIND_DROPPED_ENERGY);
  var scavengerWanted = droppedEnergies.length > 0;
  
  
  var assignableMoverCount =  (creepsByType["move"]||[]).length - (creepsByRole["harvestTruck"]||[]).length;

  if((assignableMoverCount > 0) && scavengerWanted){
    adjustMoverRoleCount("scavenger",1);
    assignableMoverCount --;
  }

  if((assignableMoverCount > 0) && stockpilerWanted){
    adjustMoverRoleCount("stockpile",1);
    assignableMoverCount --;
  }



  if (hungryBuildings.length > 0) {
    var resupplyBuildingsCount =  Math.ceil(assignableMoverCount/2);
    adjustMoverRoleCount("resupplyBuildings",resupplyBuildingsCount);
    assignableMoverCount -= resupplyBuildingsCount;
  }

  adjustMoverRoleCount("resupplyWorkers",assignableMoverCount);

}

