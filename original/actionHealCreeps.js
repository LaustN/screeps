module.exports = function(creep){
  var target = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter: function(creep){ return creep.hits < creep.hitsMax && (creep.getActiveBodyparts(RANGED_ATTACK) + creep.getActiveBodyparts(ATTACK)) > 0; }});
  if(!target){
    target = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter: function(creep){ return creep.hits < creep.hitsMax; }});
  }
  if(target) {
    var healMessage = creep.heal(target);
    if(healMessage == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
      healMessage = creep.rangedHeal(target);
    }
    return true;
  }
}
