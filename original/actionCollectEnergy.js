module.exports = function(creep){
  var home = Game.getObjectById(creep.memory.home);
  if(home.memory.state != "SaveEnergy") {
    var collectionPointsHere = creep.pos.findInRange(FIND_MY_STRUCTURES,1,{
      filter: function(structure){
        structure.energy > 0;
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
      console.log(creep.name + " is getting some energy from " + energyCarriersHere[0].name);
      energyCarriersHere[0].transferEnergy(creep);
      return true;
    }

  }

  if(creep.carry.energy == 0) {
    creep.memory.collectingEnergy = true;
  }

  if(creep.carry.energy == creep.carryCapacity) {
    creep.memory.collectingEnergy = false;
  }

  if(creep.memory.collectingEnergy) {
    var home = Game.getObjectById(creep.memory.home);
    if(home.memory.state != "SaveEnergy") {
      creep.moveTo(home);
      home.transferEnergy(creep);
    }
    else{
      var actionHarvest = require("actionHarvest");
      actionHarvest(creep);
    }
    return true;
  }
}
