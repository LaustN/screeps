module.exports = function(creep){
  var actionAttackRanged = require("actionAttackRanged");
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){

      if(targetFlag.pos.roomName != creep.pos.roomName){
        return false;
      }
      var target = null;

      var targetStructure = targetFlag.pos.findInRange(FIND_STRUCTURES,0,{filter:function(structure){ if(structure.my){return false;} return true; }});
      if(targetStructure != null && targetStructure.length > 0){
        target = targetStructure[0];
      }

      if(!target) {
        //find a creep to attack
        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      }
      if(!target){
        target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter : function(structure){ return structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_POWER_BANK && structure.structureType != STRUCTURE_KEEPER_LAIR;}});
      }
      return actionAttackRanged(creep,target);
    }
  }
  //getting here means that creep is not busy doing ranged assault
  return false;
}
