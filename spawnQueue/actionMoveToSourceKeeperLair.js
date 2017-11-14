module.exports = function (creep) {

  var keeperLairs = creep.room.find(FIND_STRUCTURES, {filter:{structureType: STRUCTURE_KEEPER_LAIR}});
  if(keeperLairs.length){
    console.log("found " + keeperLairs.length + " keeper lairs in " + creep.room.name);
  }

  return false;
}
