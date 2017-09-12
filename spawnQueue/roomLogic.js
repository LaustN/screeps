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

		var creeps = room.find(FIND_MY_CREEPS);


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

		var sources = room.find(FIND_SOURCES);

		var workersByEnergyStored = 1 + Math.floor(Math.log10(storedEnergy));
		if (allContainersAreFull) {
			workersByEnergyStored = 5;
		}

		var workerPairsWanted = workersByEnergyStored + sources.length;

		var maxPrice = Math.min(room.energyCapacityAvailable, 3000); //TODO: figure out if  a price cap here is irrelevant?

		var workerBody = buildCreepBody([WORK, WORK, CARRY, MOVE], maxPrice);
		var moverBody = buildCreepBody([CARRY, MOVE], maxPrice);

		for (var workerLayerNumber = 1; workerLayerNumber <= workerPairsWanted; workerLayerNumber++) {
			var workerName = room.name + "Work" + workerLayerNumber;
			var worker = Game.creeps[workerName];
			if (typeof (worker) == "undefined") {
				room.memory.spawnQueue.push({ body: workerBody, type: "work", name: workerName });
			}

			var moverName = room.name + "Move" + workerLayerNumber;
			var mover = Game.creeps[moverName];
			if (typeof (mover) == "undefined") {
				room.memory.spawnQueue.push({ body: moverBody, type: "move", name: moverName });
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
			var defenderBody = buildCreepBody([MOVE, RANGED_ATTACK], room.energyCapacityAvailable);
			//processing starts for defending room
			for (var defenderIndex = 1; defenderIndex <= 10; defenderIndex++) {
				var defenderName = room.name + "Defender" + defenderIndex;
				var defender = Game.creeps[defenderName];
				if (typeof (defender) == "undefined") {
					room.memory.spawnQueue.push({ body: defenderBody, type: "shoot", role: "defender", name: defenderName });
				}

			}
			console.log(room.name + " is under attack");
		}

		room.memory.flags = room.memory.flags || [{
			name: "[flagName]",
			workers: 0,
			movers: 0,
			scout: false,
			reserve: false,
			claim: false,
			healers: 0,
			assaulters: 0
		}];

		for(var flagIndex in room.memory.flags){
			var flagData = room.memory.flags[flagIndex];
			var flag = Game.flags[flagData.name];
			if(!flag){
				if(flagData.name != "[flagName]"){
					console.log("Not a flag name: " + room.name + "->" + flagData.name);
				}
				continue;
			}

			if(flag && flagData.scout){
				var scoutName = room.name + "Scout" + flagData.name;
				var scout  = Game.creeps[scoutName];
				if(!scout){
					console.log("adding scout to queue");
					var scoutOrder = { body: [MOVE], type: "scout", role: "scout", name:scoutName, flag: flag.name };
					room.memory.spawnQueue.push(scoutOrder);
				}
			}
		}
		roomSpawns(room);


	}
}    