module.exports = function(creep){
  var spawn = Game.getObjectById(creep.memory.home);
  console.log(spawn.name + "Recycling " + creep.name);
  creep.say("Recycle");
  if (spawn.pos.roomName != creep.pos.roomName || spawn.pos.getRangeTo(creep) > 1) {
    creep.moveTo(spawn);
  }
  else {
    spawn.recycleCreep(creep);
  }
  return true;
}
