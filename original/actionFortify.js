module.exports = function(creep) {
    var target = Game.getObjectById(creep.memory.chosenTargetId);

    if(!target){
    	var targets = creep.room.find(FIND_STRUCTURES,
        	{ filter: function(structure){
        	    if(structure.structureType == STRUCTURE_WALL)
        	    {
        	        if(structure.ticksToLive > 0 )
        	            return false;
        	        return true;
        	    }
        	    if(structure.structureType == STRUCTURE_RAMPART)
        	        return true;
        	    return false;
        	}}
    	);
    	if(targets.length > 0) {
    	    var chosenTarget = targets[0];
    	    for(var targetName in targets){
    	        var nextTarget = targets[targetName];
    	        if(nextTarget.hits<chosenTarget.hits){
    	            chosenTarget = nextTarget;
    	        }
    	    }
    	    console.log(creep.name + " chose " + chosenTarget.pos.x + "," + chosenTarget.pos.y  + " for further fortification");
    	    creep.memory.chosenTargetId = chosenTarget.id;
    	    creep.memory.chosenTargetHitCount = 5;
        }
    }

    if(target != null && target.structureType){
	    var repairMessage = creep.repair(target);

	    if( repairMessage == ERR_NOT_IN_RANGE){
	        creep.moveTo(target);
	    }
	    else if(repairMessage != OK){
	        console.log("Unexpected repair message: " + repairMessage + " from " + creep.name);
	        creep.memory.chosenTargetId = null;
	    }
	    else{
    	    creep.memory.chosenTargetHitCount--;
    	    if(creep.memory.chosenTargetHitCount<0){
                creep.memory.chosenTargetId = null;
    	    }
	    }
      return true;
    }

}
