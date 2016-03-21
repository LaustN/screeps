module.exports = function(creep){
    var collectionPointsHere = creep.pos.findInRange(FIND_MY_STRUCTURES,1,{
        filter: function(structure){
            structure.energy > 0;
        }
    });
    if(collectionPointsHere && collectionPointsHere[0]){
	    var home = Game.getObjectById(creep.memory.home);
    	if(home.memory.state != "SaveEnergy") {
            collectionPointsHere[0].transferEnergy(creep);
    	}
    }

	if(creep.carry.energy == 0) {
	    creep.memory.collectingEnergy = true;
	}

	if(creep.carry.energy == creep.carryCapacity) {
	    creep.memory.collectingEnergy = false;
	}

	if(creep.memory.collectingEnergy) {
	    var home = Game.getObjectById(creep.memory.home);
    	if(home.memory.state != "SaveEnergy") {
            creep.moveTo(home);
    		home.transferEnergy(creep);
    	}
    	else{
    	    var actionHarvest = require("actionHarvest");
    	    actionHarvest(creep);
    	}
    	return true;
    }
}
