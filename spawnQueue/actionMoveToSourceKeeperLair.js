module.exports = function (creep) {

  var keeperLairs = creep.room.find(FIND_STRUCTURES, {filter:{structureType: STRUCTURE_KEEPER_LAIR}});
  var destination = null;
  if(keeperLairs.length){
    destination = keeperLairs[0];
    _.each(keeperLairs, function(keeperLair){
      if(keeperLair.ticksToSpawn < destination.ticksToSpawn){
        destination = keeperLair;
      }
    });
    creep.moveTo(destination);
    return true;
  }
  return false;
}
