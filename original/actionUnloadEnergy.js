module.exports = function(creep){
  var dropPointsHere = creep.pos.findInRange(FIND_MY_STRUCTURES,1,{
    filter: function(structure){
      return structure.energyCapacity > structure.energy;
    }
  });
  if(dropPointsHere){
    creep.transferEnergy(dropPointsHere[0]);
  }

  if(creep.carry.energy == 0){
    creep.memory.dropoff = false;
  }
  else if(creep.carry.energy == creep.carryCapacity){
    creep.memory.dropoff = true;
  }

  if(creep.memory.dropoff == true){
    var dropoff = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: function(structure){
        if (typeof(structure.energy) != "undefined" && structure.energyCapacity > structure.energy) {
          return true;
        };
        if(typeof(structure.storeCapacity) != "undefined" && structure.storeCapacity > 0 && _.sum(structure.store) < structure.storeCapacity) {
          return true;
        }
        return false;
      }
    });

    if (!dropoff) {
      dropoff = Game.getObjectById(creep.memory.home);
    }

    if(dropoff)
    {
      if(creep.transferEnergy(dropoff) != OK) {
        creep.moveTo(dropoff);
      }
    }

    return true;
  }
}
