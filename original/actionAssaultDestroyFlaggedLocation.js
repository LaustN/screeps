module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){
      var targetStructure = creep.pos.lookFor(FIND_STRUCTURES,{filter:function(structure){
        if(structure.my){
          return false;
        }
        return true;
      }});
      if(targetStructure != null){
        creep.say("KILL!!!");
        creep.moveTo(targetStructure);
        creep.attack(targetStructure);
        creep.rangedAttack (targetStructure);
      }
      creep.moveTo(targetFlag);
      return true;
    }
  }
}
