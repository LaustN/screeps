var roomBuildings = require("roomBuildings");
var roomWorkerAssignment = require("roomWorkerAssignment");
var buildCreepBody = require("buildCreepBody");
var roomSpawns = require("roomSpawns");
var flagsLogic = require("flagsLogic");

module.exports = function () {
	for (var roomName in Game.rooms) {
		var room = Game.rooms[roomName];
		room.memory.spawnQueue = [];
	}



	for (var roomName in Game.rooms) {
		var room = Game.rooms[roomName];
		roomBuildings(room);
		roomWorkerAssignment(room);

		var creeps = _.filter(Game.creeps, function (creep) {
			return creep.name.startsWith(room.name);
		});

		var workCount = _.filter(creeps, function (creep) { if (creep.memory.type == "work") return true; return false; }).length;
		var moveCount = _.filter(creeps, function (creep) { if (creep.memory.type == "move") return true; return false; }).length;

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
		if (moveCount == 0 || workCount == 0) {
			maxPrice = moverPrice = workerPrice = 300;
		}
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
	}

	flagsLogic();


	for (var roomName in Game.rooms) {
		var room = Game.rooms[roomName];
		roomSpawns(room);
	}
}    