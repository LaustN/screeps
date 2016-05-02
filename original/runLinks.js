module.exports = function () {
  for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    var spawns = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return structure.structureType == "spawn";
    }});

    var links = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return structure.structureType == "link";
    }});

    console.log("Spawns:" + spawns.length + " links:" +  links.length);

    var minRange = 100;
    var centerLink = null;
    var centerSpawn = null;
    for (var spawnIterator in  spawns) {
      for (var linkIterator in links) {
        var range = spawns[spawnIterator].pos.getRangeTo(links[linkIterator]);
        console.log("Range:" + range);
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

    console.log("centerlinkId: " + centerLink.id + " - working links:" + JSON.stringify(Memory.workingLinks));

    var outerLinks = room.find(FIND_MY_STRUCTURES, {filter: function(structure){
      return structure.structureType == "link" && (!Memory.workingLinks[structure.id]) && (structure.id != centerLink.id);
    }});

    console.log("outerLink:" + outerLinks.length);
    console.log("outerLink[0]:" + JSON.stringify(outerLinks[0]));
    if (outerLinks.length > 0) {
      console.log("transfer " + centerLink.pos + " to " + outerLinks[0].pos );
      console.log("transferMessage:" + outerLinks[0].transferEnergy(centerLink, Math.min( outerLinks[0].energy, centerLink.energyCapacity - centerLink.energy)));
      Memory.workingLinks[outerLinks[0].id] = true;
    }

  }
}
