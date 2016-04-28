module.exports = function(creep){
  if(creep.memory.razeTarget){
    var razeFlag = Game.flags[creep.memory.razeTarget];
    if(razeFlag != null){
      var razeRange = 0;
      if(creep.memory.razeRange){
        razeRange = creep.memory.razeRange;
      }
      else {
        creep.memory.razeRange = 0;
      }
      var razeTarget = razeFlag.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure){
        if (structure.my) {
          return false;
        }
        if (razeFlag.pos.getRangeTo(structure) <=razeRange) {
          return true;
        }
        return false;
      }});
      if(razeTarget){
        creep.moveTo(razeTarget);
        creep.dismantle(razeTarget);
        creep.attack(razeTarget);
        if(creep.carry.energy == creep.carryCapacity){
          creep.drop(RESOURCE_ENERGY); //while breaking stuff, do not return anything. Let others do that!
        }
        return true;
      }
      creep.memory.razing = false;
      return false; //I wanted to raze, but found nothing to raze
    }
  }
  else {
    creep.memory.razeTarget = "[Name of a flag]";
  }
}
