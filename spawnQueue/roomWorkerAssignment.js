module.exports = function (room) {
  if(typeof(room.controller) == "undefined" || !room.controller.my){
    console.log("not trying to assign workers in " + room.name + " because it has no controller");
    return;
  }

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
      if (!(creep.memory.role)) {
        if (creep.memory.type == "work")
          creep.memory.role = "pausedWorker";
        if (creep.memory.type == "move")
          creep.memory.role = "pausedMover";
      }

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
        "builder",
        "harvestWithReturn",
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
        "stockpile",
        "looter",
        "scavenger",
        "resupplyWorkers",
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
    console.log(creep.name + " " + creep.memory.role + "->" + role);
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
    if (creepsByRole[role].length < count) {

      while (creepsByRole[role].length < count) {
        var repurposedWorker = getLowPrioWorker();
        if (repurposedWorker && repurposedWorker.memory.role != role)
          assignRole(repurposedWorker, role);
        else return;
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
    if (creepsByRole[role].length < count) {
      while (creepsByRole[role].length < count) {
        var repurposedWorker = getLowPrioMover();
        if (repurposedWorker && repurposedWorker.memory.role != role)
          assignRole(repurposedWorker, role);
        else return;
      }
    }
    else {
      while (creepsByRole[role] && creepsByRole[role].length > count) {
        assignRole(creepsByRole[role][0], "pausedMover");
      }
    }
  }

  room.memory.moversWanted = 0;
  room.memory.workersWanted = 0;

  var workAssignmentCount = 0;
  var moveAssignmentCount = 0;
  //does every source have a work and a move?

  var sources = room.find(FIND_SOURCES);


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

  if (room.controller.ticksToDowngrade < 3500) {
    adjustWorkerRoleCount("builder", 0);
    adjustWorkerRoleCount("repairer", 0);
    adjustWorkerRoleCount("fortifier", 0);
    adjustWorkerRoleCount("controlUpgrader", 1);
    room.memory.workersWanted++;
    room.memory.moversWanted++;
  }
  else {
    var builderWanted = (constructionSites.length > 0);
    if (builderWanted) {
      adjustWorkerRoleCount("builder", 1);
      room.memory.workersWanted++;
      room.memory.moversWanted++;
    }
    else {
      adjustWorkerRoleCount("builder", 0);
    }


    var repairerWanted = (buildingsThatNeedsRepairs.length > 0);
    if (repairerWanted) {
      adjustWorkerRoleCount("repairer", 1);
      room.memory.workersWanted++;
      room.memory.moversWanted++;
    }
    else {
      adjustWorkerRoleCount("repairer", 0);
    }

    var overflowApproaching  =  (storedEnergy >( (storingStructures.length - 1) * 2000 )) && !room.storage;
    
    if ((storedEnergy > 500000) || (overflowApproaching && (storingStructures.length>0) )  ){
      maxUpgraderCount =
        (creepsByRole["pausedWorker"] || []).length
        + (creepsByRole["controlUpgrader"] || []).length;

      adjustWorkerRoleCount("controlUpgrader", maxUpgraderCount);
      room.memory.workersWanted += 2;
      room.memory.moversWanted += 2;
    }
    else {

      var upgraderWanted =
        (room.controller
          && room.controller.my
          && (storedEnergy > (2000 * room.controller.level))

        ) || overflowApproaching;
      if (upgraderWanted) {
        adjustWorkerRoleCount("controlUpgrader", 1);
        room.memory.workersWanted++;
        room.memory.moversWanted++;
      }
      else {
        adjustWorkerRoleCount("controlUpgrader", 0);
      }
    }

    var fortifierWanted = ((room.controller.level >= 2) && ((wornWalls.length > 0)) || (plannedFortifications.length > 0));
    if (fortifierWanted) {
      adjustWorkerRoleCount("fortifier", 1);
      room.memory.workersWanted++;
      room.memory.moversWanted++;
    }
    else {
      adjustWorkerRoleCount("fortifier", 0);
    }

  }

  var hungryBuildings = room.find(FIND_MY_STRUCTURES, {
    filter: function (structure) {
      if (structure.structureType == STRUCTURE_LINK)
        return false; //links do not get resupplied
      if (structure.energyCapacity && (structure.energyCapacity > structure.energy))
        return true;
      return false;
    }
  });

  var stockpilerWanted = (
    room.storage
    && (
      room.find(FIND_STRUCTURES, {
        filter: function (structure) {
          return ((structure.structureType == STRUCTURE_CONTAINER) || (structure.structureType == STRUCTURE_LINK));
        }
      }).length > 0)

  );

  var droppedEnergies = room.find(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY } });
  var scavengerWanted = droppedEnergies.length > 0;


  var assignableMoverCount = (creepsByType["move"] || []).length - (creepsByRole["harvestTruck"] || []).length;

  if ((assignableMoverCount > 0) && scavengerWanted) {
    adjustMoverRoleCount("scavenger", 1);
    assignableMoverCount--;
  }
  else {
    adjustMoverRoleCount("scavenger", 0);
  }

  if (scavengerWanted) {
    room.memory.moversWanted++;
  }

  if ((assignableMoverCount > 0) && stockpilerWanted) {
    adjustMoverRoleCount("stockpile", 1);
    assignableMoverCount--;
  }
  else {
    adjustMoverRoleCount("stockpile", 0);
  }

  if (stockpilerWanted) {
    room.memory.moversWanted++;
  }


  if (hungryBuildings.length > 0) {
    var resupplyBuildingsCount = Math.floor(assignableMoverCount / 3) + 1;
    adjustMoverRoleCount("resupplyBuildings", resupplyBuildingsCount);
    assignableMoverCount -= resupplyBuildingsCount;
    room.memory.moversWanted++;
  }
  else {
    adjustMoverRoleCount("resupplyBuildings", 0);
  }

  if (assignableMoverCount > 0) {
    adjustMoverRoleCount("resupplyWorkers", assignableMoverCount);
    //adjustment of moversWanted here should not be needed, since this is accounted for when workers are allocated
  }

  for (var sourceIndex in sources) {
    var existingHarvester = _.find(creepsByRole["harvester"], function (harvester) {
      var isMyHarvester = (harvester.memory.focus == sources[sourceIndex].id);
      return isMyHarvester;
    });
    room.memory.workersWanted++;

    var nearbyRemoteHarvester = sources[sourceIndex].pos.findInRange(FIND_MY_CREEPS, 2, {
      filter: function (possiblyRemoteHarvester) {
        return (possiblyRemoteHarvester.memory.role == "remoteHarvester");
      }
    });

    if (!existingHarvester) {
      if (nearbyRemoteHarvester.length < 1) {
        var existingNonHarvester = getLowPrioWorker();
        if (existingNonHarvester) {
          assignRole(existingNonHarvester, "harvester");
          existingNonHarvester.memory.focus = sources[sourceIndex].id;
        }
      }
    }
    else{
      if(nearbyRemoteHarvester.length > 0){
        //seems like the easiest way of moving a step away from the source, then doing nothing
        assignRole(existingHarvester, "pausedWorker");
        room.memory.workersWanted--;
      }
    }

    var existingHarvestTruck = _.find(creepsByRole["harvestTruck"], function (mover) {
      return mover.memory.focus == sources[sourceIndex].id;
    });

    var hasLink = (sources[sourceIndex].pos.findInRange(FIND_MY_STRUCTURES, 2, { filter: { structureType: STRUCTURE_LINK } }).length > 0);
    if (!hasLink) {
      room.memory.moversWanted++;
    }

    if (!(existingHarvestTruck || hasLink)) {
      var existingNonHarvestTruck = getLowPrioMover();
      if (existingNonHarvestTruck) {
        assignRole(existingNonHarvestTruck, "harvestTruck");
        existingNonHarvestTruck.memory.focus = sources[sourceIndex].id;
      }
      else {
        if (existingHarvester && (_.sum(existingHarvester.carry) == existingHarvester.carryCapacity)) {
          assignRole(existingHarvester, "harvestWithReturn");
        }
      }
    }
  }
}

