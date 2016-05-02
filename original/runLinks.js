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
    for (var spawnIterator in  spawns) {
      for (var linkIterator in links) {
        var range = spawns[spawnIterator].pos.getRangeTo(links[linkIterator]);
        if(range < minRange){
          centerLink = links[linkIterator];
          centerSpawn = spawns[spawnIterator];
        }
      }
    }

    if (centerLink == null) {
      continue;
    }
    if (centerLink != null && Memory.workingLinks[centerLink.id]) {
      continue;
    }

    if(centerLink.energy == centerLink.energyCapacity){
      continue;
    }

    var outerLinks = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return ((structure.structureType == "link") && (!Memory.workingLinks[structure.id]) && (structure.id != centerLink.id));
    }});

    if (outerLinks.length > 0) {

      var bestEnergyAmount = 0;
      var outerLink = null;
      for (var outerlinkIterator in outerLinks) {
        var link =  outerLinks[outerlinkIterator];
        if(link.energy > bestEnergyAmount){
          bestEnergyAmount = link.energy;
          outerLink = link;
        }
      }

      centerLink.transferEnergy(link); //WHY IS THIS INVERTED???
      Memory.workingLinks[link.id] = true;
    }

  }
}
