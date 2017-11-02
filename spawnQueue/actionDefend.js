module.exports = function (creep) {
  if(creep.room.controller &&( !creep.room.controller.my)   ){
    if(creep.room.controller.safeMode > 0){
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
  if (target) {
    attackState = 1;
    var targetRange = creep.pos.getRangeTo(target);
    if (targetRange > 3) {
      creep.moveTo(target);
    }
    if (targetRange < 3) {
      console.log(creep.name + " might move away?");
    }

    if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length > 1) {
      creep.rangedMassAttack();
      attackState = 3;
    } else {
      creep.rangedAttack(target);
      attackState = 2;
    }
  }

  if(creep.getActiveBodyparts(HEAL)){
    if(creep.hits < creep.hitsMax){
      creep.heal(creep);
      return true;
    }
    if(attackState==1){
      //just moving to target, find wounded friends in range
      var woundedFriendsNearby = creep.pos.findInRange(FIND_MY_CREEPS,3, {filter:function(otherCreep){
        return otherCreep.hits < otherCreep.hitsMax;
      }});
      if(woundedFriendsNearby.length>0){
        var woundedFriend = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter:function(otherCreep){
          return otherCreep.hits < otherCreep.hitsMax;
        }});
        if(woundedFriend){
          if(creep.pos.isNearTo(woundedFriend)){
            creep.heal(woundedFriend);
          }
          else{
            creep.rangedHeal(woundedFriend);
          }
        }
        
      }
    }

    if(attackState == 0){
      var woundedFriend = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter:function(otherCreep){
        return otherCreep.hits < otherCreep.hitsMax;
      }});

      if(woundedFriend){
        if(creep.pos.isNearTo(woundedFriend)){
          creep.heal(woundedFriend);
        }
        else{
          creep.moveTo(woundedFriend);
          creep.rangedHeal(woundedFriend);          
        }
        
        //acting like a healer is also a valid action in itself
        return true;
      }
    }
  }

  if(attackState){
    return true;
  }

  return false;
}
