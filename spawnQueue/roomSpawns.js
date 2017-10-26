module.exports = function (room) {
  var spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });

  for (var spawnIndex in spawns) {
    if (room.memory.spawnQueue && room.memory.spawnQueue.length) {
      var spawn = spawns[spawnIndex];
      if (spawn.spawning) {
        continue;
      }
      delete spawn.memory.currentOrder;
      
      var spawnOrder = room.memory.spawnQueue[0];

      var spawnMessage = spawn.createCreep(spawnOrder.body, spawnOrder.name, spawnOrder.memory);
      if (spawnMessage == spawnOrder.name) {
        room.memory.spawnQueue = _.drop(room.memory.spawnQueue, 1);
        spawn.memory.currentOrder = spawnOrder;
        continue;
      }
      return;
    }
  }
}
