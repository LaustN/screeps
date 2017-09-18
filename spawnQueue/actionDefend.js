module.exports = function (creep) {

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
