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

	    var dropoff = creep.room.find(FIND_MY_STRUCTURES,{
	        filter: function(structure){
	            if (structure.energyCapacity > structure.energy) {
	              return true;
	            };

              if(structure.storeCapacity){
                console.log("Something has storeCapacity at " + structure.pos);
                var collectedCapacity = 0;
                for (var storeKey in structure.store) {
                  console.log(storeKey + "=" + structure.store[storeKey]);
                  collectedCapacity += structure.store[storeKey];
                }
              }
              if(structure.storeCapacity && _.sum(structure.store) < structure.storeCapacity){
                return true;
              }
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
