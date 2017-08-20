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
					room.memory.spawnQueue.push({ body: [CARRY, WORK, MOVE, MOVE], type: "mix", name: mixName });
				}
				
			}

			var workAssignmentCount = 0;
			var moveAssignmentCount = 0;
			var mixAssignmentCount = 0;
			//does every source have a work and a move?

			for(var sourceIndex in sources){
				var existingHarvester  = _.find(creepsByType["work"],function(worker){
					return (worker.memory.focus == sources[sourceIndex].id) && (worker.memory.role == "harvester"); 
				});
				if(typeof(existingHarvester) == "undefined"){
					var existingNonHarvester = _.find(creepsByType["work"],function(worker){
						return (worker.memory.role != "harvester"); 
					}); 
					if(typeof(existingNonHarvester) != "undefined"){
						existingNonHarvester.memory.role = "harvester";
						existingNonHarvester.memory.focus = sources[sourceIndex].id;
					}
				}

				var existingHarvestTruck  = _.find(creepsByType["move"],function(worker){
					return (worker.memory.focus == sources[sourceIndex].id) && (worker.memory.role == "harvestTruck"); 
				});
				if(typeof(existingHarvestTruck) == "undefined"){
					var existingNonHarvestTruck = _.find(creepsByType["move"],function(worker){
						return (worker.memory.role != "harvestTruck"); 
					}); 
					if(typeof(existingNonHarvestTruck) != "undefined"){
						existingNonHarvestTruck.memory.role = "harvestTruck";
						existingNonHarvestTruck.memory.focus = sources[sourceIndex].id;
					}
				}

				var remainingWorkers = _.filter(creepsByType["work"],function(worker){
					if(worker.memory.role != "harvester")
						return true;
					return false;
				});

				var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
				var buildingsThatNeedsRepairs = room.find(FIND_STRUCTURES,function(structure){
					if(structure.hits == structure.hitsMax)
						return false;
					if(
						structure.structureType == STRUCTURE_WALL
						|| structure.structureType == STRUCTURE_RAMPART)
						return false;
					return true;
				});

				while(remainingWorkers.length){
					//assign extra workers

					if(room.controller && room.controller.my && (room.controller.ticksToDowngrade < 1000)){
						remainingWorkers[0].memory.role = "controlUpgrader";
						remainingWorkers = _.drop(remainingWorkers, 1);
					}

					if(remainingWorkers.length == 0)
						break;

					if(constructionSites.length >0){
						remainingWorkers[0].memory.role = "builder";
						remainingWorkers = _.drop(remainingWorkers, 1);
					}
					if(remainingWorkers.length == 0)
						break;

					if(buildingsThatNeedsRepairs.length >0){
						remainingWorkers[0].memory.role = "repairer";
						remainingWorkers = _.drop(remainingWorkers, 1);
					}
					if(remainingWorkers.length == 0)
						break;

					remainingWorkers[0].memory.role = "fortifier";
					remainingWorkers = _.drop(remainingWorkers, 1);
					if(remainingWorkers.length == 0)
						break;

					remainingWorkers[0].memory.role = "controlUpgrader";
					remainingWorkers = _.drop(remainingWorkers, 1);
					if(remainingWorkers.length == 0)
						break;
				}

				var remainingMovers = _.filter(creepsByType["move"],function(mover){
					if(mover.memory.role == "harvestTruck")
						return false;
					return true;
				});

				while(remainingMovers.length>0){
					//TODO: make the movers balance resupplying workers, refill spawn and 


					"resupplyBuildings"
					"stockpile"
					"resupplyWorkers"
					"looter" 
					"scavenger" 
				
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