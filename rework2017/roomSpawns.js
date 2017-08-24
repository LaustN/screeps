module.exports = function (room) {
  var spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });

  while (room.memory.SpawnQueue && room.memory.SpawnQueue.length) {
    for (var spawnIndex in spawns) {
      var spawn = spawns[spawnIndex];
      if(spawn.spawning)
        continue;
      // room.memory.spawnQueue.push({ body: workerBody, type: "work", name: workerName });
      var spawnOrder = room.memory.SpawnQueue[0];
      var spawnMessage = spawn.createCreep(spawnOrder.body,spawnOrder.name,{type:spawnOrder.type});
      if(spawnMessage == spawnOrder.name)
        continue;

      console.log("unexpected spawn message in " + room.name + ": " + spawnMessage);
      return; 
    }
  }
}
