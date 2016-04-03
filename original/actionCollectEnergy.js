module.exports = function(creep){
  if(creep.carry.energy == 0) {
    creep.memory.collectingEnergy = true;
  }

  if(creep.carry.energy == creep.carryCapacity) {
    creep.memory.collectingEnergy = false;
  }

  if(creep.memory.collectingEnergy) {
    var home = Game.getObjectById(creep.memory.home);
    if(home.memory.state != "SaveEnergy") {
      var collectionPointsHere = creep.pos.findInRange(FIND_MY_STRUCTURES,1,{
        filter: function(structure){
          return structure.energy > 0;
        }
      });
      if(collectionPointsHere && collectionPointsHere[0]){
        collectionPointsHere[0].transferEnergy(creep);
        return true;
      }

      var energyCarriersHere = creep.pos.findInRange(FIND_MY_CREEPS,1,{
        filter: function(harvestCreep){
          if (harvestCreep.memory.role == "harvestTruck" && harvestCreep.carry.energy > 0 ) {
            return true;
          };
          if (harvestCreep.memory.role == "harvester" && harvestCreep.carry.energy > 0 ) {
            return true;
          };
        }
      });

      if(energyCarriersHere && energyCarriersHere[0])
      {
        var bestCarrier = energyCarriersHere[0]
        for(var energyCarrierKey in energyCarriersHere){
          var currentCarrier = energyCarriersHere[energyCarrierKey];
          if(currentCarrier.carry.energy > bestCarrier.carry.energy){
            bestCarrier = currentCarrier;
          }
        }
        console.log(creep.name + " is getting some energy from " + bestCarrier.name);
        bestCarrier.transferEnergy(creep);
        return true;
      }

      var localEnergyStorage = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : function(structure){
        if(structure && structure.store && structure.store[RESOURCE_ENERGY] && structure.store[RESOURCE_ENERGY] > 0 ){
          return true;
        }
        return false;
      }});

      if(localEnergyStorage){
        creep.say("I want energy");
        creep.moveTo(localEnergyStorage);
        localEnergyStorage.transfer(RESOURCE_ENERGY,creep);
        return true;
      }

      creep.moveTo(home);
      home.transferEnergy(creep);
      return true;
    }
  }
}
