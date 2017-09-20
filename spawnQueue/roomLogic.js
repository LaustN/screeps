var roomBuildings = require("roomBuildings");
var roomWorkerAssignment = require("roomWorkerAssignment");
var buildCreepBody = require("buildCreepBody");
var roomSpawns = require("roomSpawns");

module.exports = function () {
	var roomStates = [
		"Frontier", //many buildings still needed, ControllerLevel likely too low
		"Flush", //Ready to help neighbours
		"Defending", //this room is being attacked or has been attacked recently
		"Attacking" //this room participates in aggressivley spawning assault creeps
	];


	for (var roomName in Game.rooms) {
		var room = Game.rooms[roomName];
		roomBuildings(room);
		roomWorkerAssignment(room);

		var creeps = _.filter(Game.creeps, function (creep) {
			return creep.name.startsWith(room.name);
		});

		var workCount = _.filter(creeps, function (creep) { if (creep.memory.type == "work") return true; return false; }).length;
		var moveCount = _.filter(creeps, function (creep) { if (creep.memory.type == "move") return true; return false; }).length;

		room.memory.spawnQueue = [];
		var containers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
		//we want 1 harvester pair per source + 1 worker/mover pair per full container
		var fullContainers = _.filter(containers, {
			filter: function (container) {
				if (_.sum(container.store) == container.storeCapacity)
					return true;
				return false;
			}
		});

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

		var allContainersAreFull = _.reduce(storingStructures, function (collector, structure) {
			return collector && (structure.store[RESOURCE_ENERGY] == structure.storeCapacity);
		}, true);

		var maxPrice = Math.min(room.energyCapacityAvailable, 3000);

		var moverPrice = Math.min(room.energyCapacityAvailable, 1000);
		var workerPrice = Math.min(room.energyCapacityAvailable, 1500);

		var workerBody = buildCreepBody([WORK, WORK, CARRY, MOVE], workerPrice);
		var remoteWorkerBody = buildCreepBody([WORK, CARRY, MOVE, MOVE], maxPrice);
		var moverBody = buildCreepBody([CARRY, MOVE], moverPrice);
		var defenderBody = buildCreepBody([MOVE, RANGED_ATTACK], room.energyCapacityAvailable);
		var closeAssaultBody = buildCreepBody([MOVE, ATTACK], room.energyCapacityAvailable);
		var healerBody = buildCreepBody([MOVE, HEAL], room.energyCapacityAvailable);

		var maxCount = Math.max(room.memory.workersWanted, room.memory.moversWanted);

		if ((workCount < room.memory.workersWanted) || (moveCount < room.memory.moversWanted)) {
			for (var workerLayerNumber = 1; workerLayerNumber <= maxCount; workerLayerNumber++) {

				if (workerLayerNumber <= room.memory.moversWanted) {
					var moverName = room.name + "Move" + workerLayerNumber;
					var mover = Game.creeps[moverName];
					if (typeof (mover) == "undefined") {
						room.memory.spawnQueue.push({ body: moverBody, memory: { type: "move", role: "pausedMover" }, name: moverName });
					}
				}

				if (workerLayerNumber <= room.memory.workersWanted) {
					var workerName = room.name + "Work" + workerLayerNumber;
					var worker = Game.creeps[workerName];
					if (typeof (worker) == "undefined") {
						room.memory.spawnQueue.push({ body: workerBody, memory: { type: "work", role: "pausedWorker" }, name: workerName });
					}
				}
			}
		}

		var enemiesHere = room.find(FIND_HOSTILE_CREEPS)
		room.memory.enemiesHere = [];
		for (var enemyIndex in enemiesHere) {
			var enemy = enemiesHere[enemyIndex];

			if (enemy.getActiveBodyparts(HEAL) > 0) {
				room.memory.enemiesHere.unshift(enemy.id);
			} else {
				room.memory.enemiesHere.push(enemy.id);
			}


		}
		if (enemiesHere.length > 0) {
			//processing starts for defending room
			for (var defenderIndex = 1; defenderIndex <= 10; defenderIndex++) {
				var defenderName = room.name + "Defender" + defenderIndex;
				var defender = Game.creeps[defenderName];
				if (typeof (defender) == "undefined") {
					room.memory.spawnQueue.push({ body: defenderBody, memory: { type: "shoot", role: "defender" }, name: defenderName });
				}

			}
			console.log(room.name + " is under attack");
		}

		room.memory.flags = room.memory.flags || [{
			name: "[flagName]",
			harvest: false,
			collect: false,
			scout: false,
			reserve: false,
			claim: false,
			healers: 0,
			assaulters: 0
		}];


		for (var flagIndex in room.memory.flags) {
			if (flagIndex > room.memory.flags.length)
				break;
			var flagData = room.memory.flags[flagIndex];
			if ((!flagData) || !flagData.name) {
				room.memory.flags.splice(flagIndex, 1);
				break;
			}

			var flag = Game.flags[flagData.name];
			if (!flag) {
				if (flagData.name != "[flagName]") {
					room.memory.flags.splice(flagIndex, 1);

					console.log("Not a flag name: " + room.name + "->" + flagData.name);
					break;
				}
				continue;
			}

			if (flag) {
				var roomIsOwned = false;
				if (flag.room) {
					if (flag.room.controller && flag.room.controller.my) {
						roomIsOwned = true;
					}
				}

				if (flagData.scout && !roomIsOwned) {
					var scoutName = room.name + "Scout" + flagData.name;
					var scout = Game.creeps[scoutName];
					if (!scout) {
						var scoutOrder = { body: [MOVE], memory: { type: "scout", role: "scout", flag: flagData.name }, name: scoutName };
						room.memory.spawnQueue.push(scoutOrder);
					}
				}

				if (flagData.reserve && !roomIsOwned) {
					var reserverName = room.name + "Reserver" + flagData.name;
					var reserver = Game.creeps[reserverName];
					var reserverBody = buildCreepBody([CLAIM, MOVE], room.energyCapacityAvailable);
					if (!reserver) {
						var reserverOrder = { body: reserverBody, memory: { type: "reserver", role: "reserver", flag: flagData.name }, name: reserverName };
						room.memory.spawnQueue.push(reserverOrder);
					}
					if (reserver) {
						if (flagData.claim) {
							reserver.memory.role = "claimer";
						}
					}
				}

				var largestRaidCounter = Math.max(flagData.assaulters, flagData.healers, flagData.closeAssaulters);
				for (var assaulterIndex = 1; assaulterIndex <= largestRaidCounter; assaulterIndex++) {

					if (assaulterIndex <= flagData.closeAssaulters) {
						var assaulterName = room.name + "CA" + assaulterIndex + flagData.name;
						var assaulter = Game.creeps[assaulterName];
						if (typeof (assaulter) == "undefined") {
							room.memory.spawnQueue.push({ body: closeAssaultBody, memory: { type: "bite", role: "closeAssaulter", flag: flagData.name }, name: assaulterName });
						}

					}
					if (assaulterIndex <= flagData.assaulters) {
						var assaulterName = room.name + "RA" + assaulterIndex + flagData.name;
						var assaulter = Game.creeps[assaulterName];
						if (typeof (assaulter) == "undefined") {
							room.memory.spawnQueue.push({ body: defenderBody, memory: { type: "shoot", role: "assaulter", flag: flagData.name }, name: assaulterName });
						}

					}
					if ( assaulterIndex <= flagData.healers) {
						var healerName = room.name + "HEAL" + assaulterIndex + flagData.name;
						var healer = Game.creeps[healerName];
						if (typeof (healer) == "undefined") {
							room.memory.spawnQueue.push({ body: healerBody, memory: { type: "healer", role: "healer", flag: flagData.name }, name: healerName });
						}

					}
				}

				if (flagData.harvest && flag && flag.room) {
					var flagRoom = flag.room;

					var fullcontainersNearFlag = flagRoom.find(FIND_STRUCTURES, {
						filter: function (structure) {
							if (structure.structureType == STRUCTURE_CONTAINER) {
								if (_.sum(structure.store) == structure.storeCapacity) {
									return true;
								}
							}
							return false;
						}
					});

					var flagSources = flagRoom.find(FIND_SOURCES);
					for (var sourceIndex in flagSources) {
						var flagSource = flagSources[sourceIndex];
						var remoteHarvesterName = room.name + "RH" + sourceIndex + flagData.name;
						var remoteHarvester = Game.creeps[remoteHarvesterName];
						if (!remoteHarvester) {
							var remoteHarvesterOrder = {
								body: remoteWorkerBody,
								memory: { type: "remoteHarvester", role: "remoteHarvester", flag: flagData.name, focus: flagSource.id },
								name: remoteHarvesterName
							};
							room.memory.spawnQueue.push(remoteHarvesterOrder);
						}

						if (flagData.collect) {
							var remoteCollectorName = room.name + "RC" + sourceIndex + flagData.name;
							var remoteCollector = Game.creeps[remoteCollectorName];
							if (!remoteCollector) {
								var remoteCollectorOrder = {
									body: moverBody,
									memory: { type: "remoteCollector", role: "remoteCollector", flag: flagData.name, focus: flagSource.id },
									name: remoteCollectorName
								};
								room.memory.spawnQueue.push(remoteCollectorOrder);
							}
						}
					}




					var enemiesHere = flagRoom.find(FIND_HOSTILE_CREEPS)
					flagRoom.memory.enemiesHere = [];
					for (var enemyIndex in enemiesHere) {
						var enemy = enemiesHere[enemyIndex];

						if (enemy.getActiveBodyparts(HEAL) > 0) {
							flagRoom.memory.enemiesHere.unshift(enemy.id);
						} else {
							flagRoom.memory.enemiesHere.push(enemy.id);
						}


					}
					if (enemiesHere.length > 0) {
						//processing starts for defending room
						for (var defenderIndex = 1; defenderIndex <= 10; defenderIndex++) {
							var defenderName = room.name + "Defender" + defenderIndex + flagData.name;
							var defender = Game.creeps[defenderName];
							if (typeof (defender) == "undefined") {
								room.memory.spawnQueue.push({ body: defenderBody, memory: { type: "shoot", role: "defender", flag: flagData.name }, name: defenderName });
							}

						}
						console.log(flagRoom.name + " is under attack");
					}


					var anyBuildingsInNeedOfRepairs = flagRoom.find(FIND_STRUCTURES, {
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

					var constructionSites = flagRoom.find(FIND_CONSTRUCTION_SITES);
					var anyNonDefaultedConstructionSites = _.filter(constructionSites, function (constructionSite) {
						return constructionSite.pos.lookFor(LOOK_CREEPS).length == 0;
					}).length > 0;
					if (anyNonDefaultedConstructionSites || anyBuildingsInNeedOfRepairs) {
						var desiredBuilderCount = 1;
						if (flagRoom.controller && flagRoom.controller.my) {
							desiredBuilderCount = fullcontainersNearFlag.length;
						}
						for (var builderIndex = 0; builderIndex <= desiredBuilderCount; builderIndex++) {
							var remoteBuilderName = room.name + "RB" + builderIndex + flagData.name;
							var remoteBuilder = Game.creeps[remoteBuilderName];
							if (!remoteBuilder) {
								var remoteBuilderOrder = {
									body: remoteWorkerBody,
									memory: { type: "remoteBuilder", role: "remoteBuilder", flag: flagData.name },
									name: remoteBuilderName
								};
								room.memory.spawnQueue.push(remoteBuilderOrder);
							}
						}
					}

				}
			}
		}
		roomSpawns(room);


	}
}    