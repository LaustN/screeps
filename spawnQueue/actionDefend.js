module.exports = function(creep){

  if(creep.room.memory.enemiesHere && creep.room.memory.enemiesHere.length){
    var target = Game.getObjectById(creep.room.memory.enemiesHere[0]);
    var targetRange = creep.pos.getRangeTo(target);
    if(targetRange>3){
      creep.moveTo(target);
    }
    if(targetRange < 3){
      console.log(creep.name + " might move away?");
    }
    if(creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length > 1) {
      creep.rangedMassAttack();
    } else {
      creep.rangedAttack(target);
    }
    return true;
  } else {
    console.log(creep.name + " did not see enemies in " + creep.room.name);
  }
  return false;
}
  