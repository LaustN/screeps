module.exports = function (room) {
  var spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });

  if (room.memory.spawnQueue && room.memory.spawnQueue.length) {
    console.log("we have a spawn queue");
    for (var spawnIndex in spawns) {
      var spawn = spawns[spawnIndex];
      console.log("found a spawn:" + spawn.id);
      if (spawn.spawning) {
        console.log("already spawning at " + spawn.id);
        continue;
      }
      // room.memory.spawnQueue.push({ body: workerBody, type: "work", name: workerName });
      var spawnOrder = room.memory.spawnQueue[0];

      var spawnMessage = spawn.createCreep(spawnOrder.body, spawnOrder.name, { type: spawnOrder.type, role: spawnOrder.role });
      if (spawnMessage == spawnOrder.name) {
        room.memory.spawnQueue = _.drop(room.memory.spawnQueue, 1);
        continue;
      }

      console.log("unexpected spawn message in " + room.name + ": " + spawnMessage);
      return;
    }
  }
}
