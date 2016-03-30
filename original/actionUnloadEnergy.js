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
  if(creep.carry.energy == creep.carryCapacity){
    creep.memory.dropoff = true;
  }

  if(creep.memory.dropoff == true){
    if(creep.name == "Harvest6"){
      console.log("dropping off");
    }


    var dropoff = creep.room.find(FIND_MY_STRUCTURES,{
      filter: function(structure){
        console.log("filtering structures");
        console.log("structure.energyCapacity" + structure.energyCapacity);
        console.log("structure.energy" + structure.energy);
        console.log("structure.storeCapacity" + structure.storeCapacity);
        console.log("_.sum(structure.store)" + _.sum(structure.store));

        if (structure.energyCapacity && structure.energy && structure.energyCapacity > structure.energy) {
          console.log("true case 1");
          return true;
        };

        if(structure.storeCapacity && _.sum(structure.store) < structure.storeCapacity){
          console.log("true case 2");
          return true;
        }
        console.log("false case 1");
        return false;
      }
    });

    if(dropoff && dropoff.length>0)
    {
      creep.moveTo(dropoff[0]);
      creep.transferEnergy(dropoff[0]);
    }
    return true;
  }
}
