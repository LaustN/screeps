var rally = require("rally");
module.exports = function(creep){
	var targets = creep.room.find(FIND_HOSTILE_CREEPS);
	if(targets.length > 0) {
	    var targetFound = false;
	    for(var targetName in targets) {
	        if(!targetFound){
    	        var target  = targets[targetName];

    	        var targetRange = target.pos.getRangeTo(Game.spawns.Spawn1);

        	    if(targetRange < 20) {
        	        creep.say("Engaging " + target.name);
            		if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            			creep.moveTo(target);
            		}
            		creep.rangedAttack(target);
            		targetFound = true;

        	    }
	        }
    	}
    }
    else{
        rally(creep);
    }
}
