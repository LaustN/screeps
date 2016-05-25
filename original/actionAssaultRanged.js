module.exports = function(creep){

//TODO: needs behavior that differentiates it from regular assault

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

  var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if(target) {
    var rangedAttackMessage = creep.rangedAttack(target);
    var attackMessage = creep.attack(target);
    if(attackMessage == ERR_NOT_IN_RANGE) {
      var moveMessage = creep.moveTo(target);
      if(moveMessage != OK && moveMessage != ERR_TIRED ){
        return false;
      }
    }
    return true;
  }

  target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter : function(structure){ return structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_POWER_BANK && structure.structureType != STRUCTURE_KEEPER_LAIR;}});
  if(target) {
    var rangedAttackMessage = creep.rangedAttack(target);
    var attackMessage = creep.attack(target);
    if(attackMessage == ERR_NOT_IN_RANGE) {
      var moveMessage = creep.moveTo(target);
      if(moveMessage != OK && moveMessage != ERR_TIRED ){
        return false;
      }
      return true;
    }
  }


}
