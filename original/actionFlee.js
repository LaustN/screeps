module.exports = function(creep){
  var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS,5);

  var flee = hostiles.length > 0;
  if(flee){
    var ensurehome = require("actionEnsureHome");
    ensurehome(creep);
    var destination = Game.getObjectById(creep.memory.home);
    if(creep.pos.getRangeTo(destination) <= 2){
        return false;
    }
    creep.moveTo(destination);
    return true;
  }
}
