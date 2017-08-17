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