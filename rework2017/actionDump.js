module.exports = function(creep){
  var structuresHere = creep.pos.findInRange(FIND_STRUCTURES,1);
  if(structuresHere && structuresHere.length){
    creep.transfer(structuresHere[0],RESOURCE_ENERGY);
  }
  creep.drop(RESOURCE_ENERGY);

}
  