module.exports = function (creep) {
  var home = Game.getObjectById(creep.memory.home);
  if(creep.room.name != home.room.name){
    creep.moveTo(home);
    return true;
  }
  return false;
}
