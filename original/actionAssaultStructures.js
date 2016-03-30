module.exports = function(creep){
  var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
  if(target) {
    creep.say("Engaging " + target.pos);
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
