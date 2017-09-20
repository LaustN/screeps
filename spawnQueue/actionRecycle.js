module.exports = function (creep) {
  creep.say("NO MORE!!");
  var spawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
  if(!spawn){
    spawn = Game.getObjectById(creep.memory.home);
  }
  if (spawn) {
    var recycleMessage = spawn.recycleCreep(creep);
    if (recycleMessage == ERR_NOT_IN_RANGE)
      creep.moveTo(spawn);

    return true;
  }
}
