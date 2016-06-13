module.exports = function(creep){
  if(creep.carry.energy == 0){
    creep.memory.dropoff = false;
  }
  if(creep.carry.energy == creep.carryCapacity){
    creep.memory.dropoff = true;
  }

  if(creep.memory.dropoff == true){
    var home = Game.getObjectById(creep.memory.home);
    if(creep.pos.roomName != home.pos.roomName) {
      creep.moveTo(home, {reusePath: 30});
      return true;
    }

    var dropoff = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: function(structure){
        if (typeof(structure.energy) != "undefined" && structure.energyCapacity > structure.energy && structure.isActive()) {
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
      if(creep.transfer(dropoff, RESOURCE_ENERGY)!=OK){
        creep.moveTo(dropoff, {reusePath: 30});
      }
    }
    return true;
  }
}
