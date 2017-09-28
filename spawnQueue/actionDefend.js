module.exports = function (creep) {
  if(creep.room.controller &&( !creep.room.controller.my)   ){
    if(creep.room.controller.safeMode > 0){
      console.log("Not defending in " + creep.room.name + " since safeMode is active");
      return;
    }
  }


  var target = null;
  if (creep.room.memory.enemiesHere && creep.room.memory.enemiesHere.length) {
    target = Game.getObjectById(creep.room.memory.enemiesHere[0]);
  }
  if (!target) {
    target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  }

  if (target) {
    var targetRange = creep.pos.getRangeTo(target);
    if (targetRange > 3) {
      creep.moveTo(target);
    }
    if (targetRange < 3) {
      console.log(creep.name + " might move away?");
    }
    if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length > 1) {
      creep.rangedMassAttack();
    } else {
      creep.rangedAttack(target);
    }
    return true;
  }

  return false;
}
