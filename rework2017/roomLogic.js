module.exports = function () {
	var roomBuildings = require("roomBuildings");

	var roomStates = [
		"Frontier", //many buildings still needed, ControllerLevel likely too low
		"Flush", //Ready to help neighbours
		"Defending", //this room is being attacked or has been attacked recently
		"Attacking" //this room participates in aggressivley spawning assault creeps
	];


	for (var roomName in Game.rooms) {
		var room = Game.rooms[roomName];
		roomBuildings(room);

		var creeps = room.find(FIND_MY_CREEPS);

		var creepsByType = {
			"work": [],
			"move": [],
			"mix": []
		};
		var creepsByRole = {};
		for (var roleName in roleActions) {
			console.log("adding array to creepsByRole for " + roleName);
			creepsByRole[roleName] = [];
		}

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

		for(var creepType in creepsByType){
			creepsByType[creepType] = _.sort(creepsByType[creepType],[function(sortCreep){return sortCreep.name;}]);
		}

		var workCount = creepsByType["work"].length;
		var moveCount = creepsByType["move"].length;

		room.memory.spawnQueue = [];
		var containers = room.find(FIND_STRUCTURES, { structureType: STRUCTURE_CONTAINER });
		//we want 1 harvester pair per source + 1 worker/mover pair per full container
		var fullContainers = _.filter(containers, {
			filter: function (container) {
				if (_.sum(container.store) == container.storeCapacity)
					return true;
				return false;
			}
		});

		var sources = room.find(FIND_SOURCES);

		var workerPairsWanted = fullContainers.length + sources.length + 1;

		if ((room.energyCapacityAvailable < 550) || (workCount < 1) || (moveCount < 1)) {
			//processing starts for frontier

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

				workerPairsWanted = 2; //still keep 2 mix types around, since this is still a frontier

			}

			//mix types
			for (var mixNumber = 1; mixNumber < workerPairsWanted; mixNumber++){
				var mixName = room.name + "Mix" + mixNumber;
				var mix = Game.creeps[mixName];
				if (typeof (mix) == "undefined") {
					//respawn this creep!
					
					room.memory.spawnQueue.push({ body: [CARRY, WORK, MOVE, MOVE], type: "mix", name: mixName });
				}
				
			}

			var workAssignmentCount = 0;
			var moveAssignmentCount = 0;
			var mixAssignmentCount = 0;
			for(var sourceIndex in sources){
				var harvester = null;
				if(creepsByType["work"].length>sourceIndex){
					harvester = creepsByType["work"][sourceIndex];
					workAssignmentCount++;
				} else if((creepsByType["work"].length + creepsByType["mix"].length)>sourceIndex){
					harvester=creepsByType["mix"][sourceIndex-creepsByType["Work"].length];
					mixAssignmentCount++;
				}
				if(harvester!=null){
					harvester.memory.role = "harvester";
					harvester.memory.focus = sources[sourceIndex].id;
				}

				var harvestTruck = null;
				if(creepsByType["move"].length>sourceIndex){
					harvestTruck = creepsByType["move"][sourceIndex];
					moveAssignmentCount++;
				} else if((creepsByType["move"].length + creepsByType["mix"].length)>sourceIndex){
					harvestTruck=creepsByType["mix"][sourceIndex-creepsByType["move"].length];
					mixAssignmentCount++;
				}
				if(harvestTruck!=null){
					harvestTruck.memory.role = "harvestTruck";
					harvestTruck.memory.focus = sources[sourceIndex].id;
				}

				//check xxxAssignmentCount against creepsByType[all3Types], possibly assign roles

			}
			
			continue; //processing done for frontier, next room!
		}

		var enemiesHere = room.find(FIND_HOSTILE_CREEPS)
		if (enemiesHere.length > 0) {
			//processing starts for defending room

			console.log(room.name + " is under attack, but defensive creeps have not been implemented yet");
			//continue; //processing ends for defending room
		}



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