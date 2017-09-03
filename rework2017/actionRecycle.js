module.exports = function (creep) {
  var spawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { structureType: STRUCTURE_SPAWN })
  var recycleMessage = spawn.recycle(creep);
  if (recycleMessage == ERR_NOT_IN_RANGE)
    creep.moveTo(spawn);

  return true;
}
