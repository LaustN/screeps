module.exports = function (creep) {
  var home = Game.getObjectById(creep.memory.home);
  if(creep.room.name != home.room.name){
    creep.memory.awayCounter++;
    if(creep.memory.awayCounter>20){
      creep.moveTo(home);
      return true;
    }
    else{
      return false; //do not run home just yet, allow some time for pathfinding to have been right
    }
  }
  creep.memory.awayCounter = 0;
  return false;
}
