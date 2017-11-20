var buildCreepBody = require("buildCreepBody");

var flagDataTemplate = {
  rooms: ["[roomName]"],
  harvest: false,
  collect: false,
  scout: false,
  reserve: false,
  claim: false,
  healers: 0,
  assaulters: 0,
  closeAssaulters: 0
};;


module.exports = function () {

  for (var flagName in Game.flags) {
    var flag = Game.flags[flagName];
    if (flag) {

      for (var templateKey in flagDataTemplate) {
        if (!flag.memory[templateKey]) {
          flag.memory[templateKey] = flagDataTemplate[templateKey];
        }
      }

      for (var roomIndex in flag.memory.rooms) {
        var roomName = flag.memory.rooms[roomIndex];
        var sourceRoom = Game.rooms[roomName];
        if (!sourceRoom) {
          console.log("failed to get a source room for " + roomName + " on flag " + flag.name);
          continue;
        }

        var maxPrice = Math.min(sourceRoom.energyCapacityAvailable, 1600);

        var remoteWorkerBody = buildCreepBody([WORK, CARRY, MOVE], maxPrice);
        var remoteMoverBody = buildCreepBody([CARRY, MOVE], sourceRoom.energyCapacityAvailable);
        var defenderBody = buildCreepBody([MOVE, MOVE, RANGED_ATTACK, HEAL], sourceRoom.energyCapacityAvailable);
        var assaultBody = buildCreepBody([MOVE, RANGED_ATTACK], sourceRoom.energyCapacityAvailable);
        var closeAssaultBody = buildCreepBody([MOVE, ATTACK], sourceRoom.energyCapacityAvailable);
        var healerBody = buildCreepBody([MOVE, HEAL], sourceRoom.energyCapacityAvailable);


        var flagRoomIsOwned = false;
        if (flag.room) {
          if (flag.room.controller && flag.room.controller.my) {
            roomIsOwned = true;
          }
        }


        var largestRaidCounter = Math.max(flag.memory.assaulters, flag.memory.healers, flag.memory.closeAssaulters);
        for (var assaulterIndex = 1; assaulterIndex <= largestRaidCounter; assaulterIndex++) {

          if (assaulterIndex <= flag.memory.closeAssaulters) {
            var assaulterName = flag.name + "CA" + assaulterIndex;
            var assaulter = Game.creeps[assaulterName];
            if (typeof (assaulter) == "undefined") {
              sourceRoom.memory.spawnQueue.push({ body: closeAssaultBody, memory: { type: "bite", role: "closeAssaulter", flag: flag.name }, name: assaulterName });
            }

          }
          if (assaulterIndex <= flag.memory.assaulters) {
            var assaulterName = flag.name + "RA" + assaulterIndex;
            var assaulter = Game.creeps[assaulterName];
            if (typeof (assaulter) == "undefined") {
              sourceRoom.memory.spawnQueue.push({ body: assaultBody, memory: { type: "shoot", role: "assaulter", flag: flag.name }, name: assaulterName });
            }

          }
          if (assaulterIndex <= flag.memory.healers) {
            var healerName = flag.name + "HEAL" + assaulterIndex;
            var healer = Game.creeps[healerName];
            if (typeof (healer) == "undefined") {
              sourceRoom.memory.spawnQueue.push({ body: healerBody, memory: { type: "healer", role: "healer", flag: flag.name }, name: healerName });
            }

          }
        }

        if (flag.room && flag.memory.harvest) {
          var enemiesHere = flag.room.find(FIND_HOSTILE_CREEPS)
          flag.room.memory.enemiesHere = [];
          for (var enemyIndex in enemiesHere) {
            var enemy = enemiesHere[enemyIndex];

            if (enemy.getActiveBodyparts(HEAL) > 0) {
              flag.room.memory.enemiesHere.unshift(enemy.id);
            } else {
              flag.room.memory.enemiesHere.push(enemy.id);
            }
          }
          var keeperLairs = flag.room.find(FIND_STRUCTURES, {filter:{structureType: STRUCTURE_KEEPER_LAIR}});

          var desiredDefenderCount = Math.max(enemiesHere.length,keeperLairs.length);

          if (desiredDefenderCount > 0) {
            //processing starts for defending sourceRoom
            for (var defenderIndex = 1; defenderIndex <= desiredDefenderCount; defenderIndex++) {
              var defenderName = flag.name + "Defender" + defenderIndex;
              var defender = Game.creeps[defenderName];
              if (typeof (defender) == "undefined") {
                sourceRoom.memory.spawnQueue.push({ body: defenderBody, memory: { type: "shoot", role: "defender", flag: flag.name }, name: defenderName });
              }

            }
            console.log(flag.room.name + " is under attack");
          }

          var fullcontainersNearFlag = flag.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
              if (structure.structureType == STRUCTURE_CONTAINER) {
                if (_.sum(structure.store) == structure.storeCapacity) {
                  return true;
                }
              }
              return false;
            }
          });

          var flagSources = flag.room.find(FIND_SOURCES);
          for (var sourceIndex in flagSources) {
            var flagSource = flagSources[sourceIndex];
            var remoteHarvesterName = flag.name + "RH" + sourceIndex;
            var remoteHarvester = Game.creeps[remoteHarvesterName];
            if (!remoteHarvester) {
              var remoteHarvesterOrder = {
                body: remoteWorkerBody,
                memory: { type: "remoteHarvester", role: "remoteHarvester", flag: flag.name, focus: flagSource.id },
                name: remoteHarvesterName
              };
              sourceRoom.memory.spawnQueue.push(remoteHarvesterOrder);
            }
          }

          if (flag.memory.collect) {

            var roomsDistance = Game.map.getRoomLinearDistance(flag.pos.roomName, sourceRoom.name);
            for (var collectorIndex = 1; collectorIndex <= (fullcontainersNearFlag.length * roomsDistance); collectorIndex++) {
              var remoteCollectorName = flag.name + "RC" + collectorIndex;
              var remoteCollector = Game.creeps[remoteCollectorName];
              if (!remoteCollector) {
                var remoteCollectorOrder = {
                  body: remoteMoverBody,
                  memory: { type: "remoteCollector", role: "remoteCollector", flag: flag.name, focus: flagSource.id },
                  name: remoteCollectorName
                };
                sourceRoom.memory.spawnQueue.push(remoteCollectorOrder);
              }
            }
          }



          var anyBuildingsInNeedOfRepairs = flag.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
              if (structure.structureType == STRUCTURE_WALL
                || structure.structureType == STRUCTURE_RAMPART)
                return false;
              if (structure.hits < structure.hitsMax) {
                return true;
              }
              return false;
            }
          }).length > 0;

          var constructionSites = flag.room.find(FIND_CONSTRUCTION_SITES);
          var anyNonDefaultedConstructionSites = _.filter(constructionSites, function (constructionSite) {
            return constructionSite.pos.findInRange(FIND_CREEPS, 1).length == 0;
          }).length > 0;
          if (anyNonDefaultedConstructionSites || anyBuildingsInNeedOfRepairs) {
            var desiredBuilderCount = 1;
            if (flag.room.controller && flag.room.controller.my) {
              desiredBuilderCount = fullcontainersNearFlag.length;
            }
            for (var builderIndex = 1; builderIndex <= desiredBuilderCount; builderIndex++) {
              var remoteBuilderName = flag.name + "RB" + builderIndex;
              var remoteBuilder = Game.creeps[remoteBuilderName];
              if (!remoteBuilder) {
                var remoteBuilderOrder = {
                  body: remoteWorkerBody,
                  memory: { type: "remoteBuilder", role: "remoteBuilder", flag: flag.name },
                  name: remoteBuilderName
                };
                sourceRoom.memory.spawnQueue.push(remoteBuilderOrder);
              }
            }
          }

        }

        if (flag.memory.scout && !flagRoomIsOwned) {
          var scoutName = flag.name + "Scout";
          var scout = Game.creeps[scoutName];
          if (!scout) {
            var scoutOrder = { body: [MOVE], memory: { type: "scout", role: "scout", flag: flag.name }, name: scoutName };
            sourceRoom.memory.spawnQueue.push(scoutOrder);
          }
        }

        var roomHasEnoughReservation = false;
        if (
          flag
          && flag.room
          && flag.room.controller 
          && !flag.room.controller.my 
          && flag.room.controller.reservation 
          && flag.room.controller.reservation.username == "Folofo" 
          && flag.room.controller.reservation.ticksToEnd > 2000 
          && !flag.memory.claim
        ) {
          roomHasEnoughReservation = true;
        }


        if (flag.memory.reserve && !flagRoomIsOwned && !roomHasEnoughReservation) {
          var reserverName = flag.name + "Reserver";
          var reserver = Game.creeps[reserverName];
          var reserverBody = buildCreepBody([CLAIM, MOVE], sourceRoom.energyCapacityAvailable);
          if (!reserver) {
            var reserverOrder = { body: reserverBody, memory: { type: "reserver", role: "reserver", flag: flag.name }, name: reserverName };
            sourceRoom.memory.spawnQueue.push(reserverOrder);
          }
          if (reserver) {
            if (flag.memory.claim) {
              reserver.memory.role = "claimer";
            }
          }
        }


      }
    }
  }
}    