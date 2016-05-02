module.exports = function(creep) {
  var target = Game.getObjectById(creep.memory.chosenTargetId);

  if(!target){

    var controllerLevel = 0;
    if(creep.room.controller && creep.room.controller.my){
      controllerLevel = creep.room.controller.level;
    }
    var targets = creep.room.find(FIND_STRUCTURES,
      { filter: function(structure){

        //do not repair roads until they are halfway worn down, in order to waste less time driving around
        if(structure.structureType == STRUCTURE_ROAD){
          if(structure.hits < (structure.hitsMax/2)){
            return true;
          }
          else {
            return false;
          }
        }

        if(structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits<structure.hitsMax){
          return true;
        }
        if(structure.hits > 20000 * controllerLevel){
          return false;
        }
        if(structure.structureType == STRUCTURE_WALL)
        {
          if(structure.my) {
            return false;
          }
          return true;
        }
        if(structure.structureType == STRUCTURE_RAMPART){
          return true;
        }
        return false;
      }
    });
    if(targets.length > 0) {
      var chosenTarget = targets[0];
      for(var targetName in targets){
        var nextTarget = targets[targetName];
        if(nextTarget.hits<chosenTarget.hits){
          chosenTarget = nextTarget;
        }
      }
      creep.say("V" + (chosenTarget.pos.x - creep.pos.x) + "," + (chosenTarget.pos.y - creep.pos.y));
      creep.memory.chosenTargetId = chosenTarget.id;
      creep.memory.chosenTargetHitCount = 5;
    }
    else {
      creep.memory.chosenTargetId = null;

    }
  }

  if(target != null && target.structureType){
    var repairMessage = creep.repair(target);

    if( repairMessage == ERR_NOT_IN_RANGE){
      creep.moveTo(target);
    }
    else if(repairMessage != OK){
      creep.memory.chosenTargetId = null;
    }
    else{
      creep.memory.chosenTargetHitCount--;
      if(creep.memory.chosenTargetHitCount<0){
        creep.memory.chosenTargetId = null;
      }
    }
    creep.memory.dropoff = false;
    return true;
  }

}
