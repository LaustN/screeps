module.exports = function () {
  for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    var spawns = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return structure.structureType == "spawn";
    }});

    var links = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return structure.structureType == "link";
    }});

    var minRange = 100;
    var centerLink = null;
    var centerSpawn = null;
    for (var spawnIterator = 0; spawnIterator < spawns.length; spawnIterator++) {
      for (var linkIterator = 0; linkIterator < links.length; linkIterator++) {
        var range = spawns[spawnIterator].getRangeTo(links[linkIterator]);
        if(range < minRange){
          centerLink = links[linkIterator];
          centerSpawn = spawns[spawnIterator];
        }
      }
    }

    if ( Memory.workingLinks[centerLink.id]) {
      continue;
    }

    var outerLinks = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return structure.structureType == "link" && !Memory.workingLinks[structure.id];
    }});

    if (outerLinks.length > 0) {
      outerLinks[0].transferEnergy(centerLink);
      Memory.workingLinks[outerLinks[0].id] = true;
    }

  }
}
