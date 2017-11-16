module.exports = function (creep) {
  if (creep.room.controller && (!creep.room.controller.my)) {
    if (creep.room.controller.safeMode > 0) {
      console.log("Not defending in " + creep.room.name + " since safeMode is active");
      return false;
    }
  }


  var target = null;
  if (creep.room.memory.enemiesHere && creep.room.memory.enemiesHere.length) {
    target = Game.getObjectById(creep.room.memory.enemiesHere[0]);
  }
  if (!target) {
    target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  }

  var attackState = 0;
  var isMoving = false;
  if (target) {
    attackState = 1;
    var targetRange = creep.pos.getRangeTo(target);
    if ((targetRange > 3) || (!creep.memory.targetWasTooClose) ) {
      creep.memory.targetWasTooClose = false;
      creep.moveTo(target);
      isMoving = true;
    }
    if (targetRange < 3) {
      creep.memory.targetWasTooClose = true;
      var retreatPoint = null;
      var flag = Game.flags[creep.memory.flag];
      if(flag){
        retreatPoint = flag;
      }
      else{
        retreatPoint = Game.getObjectById(creep.memory.home);
      }
      
      if(retreatPoint){
        creep.moveTo(retreatPoint)
      }
    }

    if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length > 1) {
      creep.rangedMassAttack();
      attackState = 3;
    } else {
      creep.rangedAttack(target);
      attackState = 2;
    }
  }

  if (creep.getActiveBodyparts(HEAL)) {
    if (creep.hits < creep.hitsMax) {
      creep.heal(creep);
      return true;
    }

    var woundedFriend = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: function (otherCreep) {
        return otherCreep.hits < otherCreep.hitsMax;
      }
    });

    if (woundedFriend) {

      if (!isMoving) {
        if (!target) {
          creep.moveTo(woundedFriend);
        }
        else {
          //if in combat, only move towards wounded friends if they are near my target
          if (woundedFriend.pos.getRangeTo(target) < 4) {
            creep.moveTo(woundedFriend);
          }
        }
      }
      if (attackState < 2) {
        creep.rangedHeal(woundedFriend);
      }
      if (creep.pos.isNearTo(woundedFriend)) {
        creep.heal(woundedFriend);
      }
      return true;
    }
  }

  if (attackState) {
    return true;
  }

  return false;
}
