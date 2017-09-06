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

		var workersByEnergyStored = storedEnergy / 1000;
		if (storedEnergy > 10000) {
			workersByEnergyStored = 7 + Math.log10(storedEnergy);
		}
		if (allContainersAreFull) {
			workersByEnergyStored = 10;
		}

		var workerPairsWanted = workersByEnergyStored + sources.length + 2;

		if ((room.energyCapacityAvailable < 550) || (workCount < 1) || (moveCount < 1)) {
			//processing starts for frontier
			workerPairsWanted += 2; //we need a few extra workers initially

			//mix types are wanted as long as we have no containers
			if (containers.length > 0) {
				//worker types and mover types				

				for (var workerLayerNumber = 1; workerLayerNumber <= workerPairsWanted; workerLayerNumber++) {
					var workerName = room.name + "Work" + workerLayerNumber;
					var worker = Game.creeps[workerName];
					if (typeof (worker) == "undefined") {
						room.memory.spawnQueue.push({ body: [WORK, WORK, CARRY, MOVE], type: "work", name: workerName });
					}

					var moverName = room.name + "Move" + workerLayerNumber;
					var mover = Game.creeps[moverName];
					if (typeof (mover) == "undefined") {
						room.memory.spawnQueue.push({ body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], type: "move", name: moverName });
					}
				}

				workerPairsWanted = 1; //still keep 2 mix types around, since this is still a frontier

			}

			//mix types
			for (var mixNumber = 1; mixNumber <= (workerPairsWanted * 2); mixNumber++) {
				var mixName = room.name + "Mix" + mixNumber;
				var mix = Game.creeps[mixName];
				if (typeof (mix) == "undefined") {
					room.memory.spawnQueue.push({ body: [CARRY, WORK, MOVE, MOVE], type: "mix", name: mixName });
				}

			}

		} else {
			//processing starts for decent quality room

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
		var scoutsWanted =  false;
		if (scoutsWanted) {
			//look at rooms in expanding circle
			//closest by walk distance, 
			var scoutName = room.name + "Scout" + 1
			room.memory.spawnQueue.push({ body: moverBody, type: "scout", name: scoutName });
		}


		roomSpawns(room);

		/**
		 * a room is a frontier if
		 *  - energyCapacityAvailable is "small"
		 *  - the room has no "work" type 
		 *  - the room has no "move" type
		 * 
		 * a room is defending when enemies are present
		 * 
		 * a room is attacking when a spawn in the room has a valid assault flag in memory
		 */



		/**
		 * a frontier room will build mix creeps untill energyCapacityAvailable is "first level completed"
		 * a frontier will build at least 1 mix 1 work and 1 move
		 * 
		 * a flush room will maintain at least 1 "work" + 1 "move" per source 
		 * a flush room will create more "work" as per stored energy available
		 * 
		 * an attacking room will maintain at least 1 "work" + 1 "move" per source 
		 * an attacking room will maintain 1 "work" for doing basic maintenance like fortifying walls that have decayed/are damaged + minimal controller upgrading
		 * an attacking room will look at flags referred by memory for assault orders.
		 * 
		 * a defending room will maintain at least 1 "work" + 1 "move" per source 
		 * a defending room will maintain 1 "work" for doing basic maintenance like fortifying walls that have decayed/are damaged + minimal controller upgrading
		 * a defending room wil build all the defenders it can
		 */


	}
}    