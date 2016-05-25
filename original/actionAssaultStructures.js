module.exports = function(creep){
  var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter : function(structure){ return structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_POWER_BANK && structure.structureType != STRUCTURE_KEEPER_LAIR;}});
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
