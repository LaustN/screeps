module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){

      if(targetFlag.pos.roomName != creep.pos.roomName){
        return false;
      }

      var targetStructure = targetFlag.pos.findInRange(FIND_STRUCTURES,0,{filter:function(structure){
        if(structure.my){
          return false;
        }
        return true;
      }});
      if(targetStructure != null && targetStructure.length > 0){
        creep.moveTo(targetStructure[0]);
        creep.attack(targetStructure[0]);
        creep.rangedAttack (targetStructure[0]);
        return true;
      }
    }
  }
}
