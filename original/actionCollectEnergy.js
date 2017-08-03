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
      var nearestEnergyCarrier = creep.pos.findClosestByRange(FIND_MY_CREEPS,{
        filter: function(harvestCreep){
          if (harvestCreep.memory.role == "harvestTruck" && harvestCreep.carry.energy > 0 ) {
            return true;
          };
          if (harvestCreep.memory.role == "harvester" && harvestCreep.carry.energy > 0 ) {
            return true;
          };
        }
      });

      var localEnergyStorage = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : function(structure){
        if(structure.store && structure.store[RESOURCE_ENERGY] && structure.store[RESOURCE_ENERGY] > 0 ){
          return true;
        }
        return false;
      }});

      var collectionSource = null;

      if(nearestEnergyCarrier && localEnergyStorage){
        var rangestorage = localEnergyStorage.pos.getRangeTo(creep);
        var rangeCarrier = nearestEnergyCarrier.pos.getRangeTo(creep);

        if(rangeCarrier > rangestorage)
        {
          collectionSource = localEnergyStorage;
        }
        else {
          collectionSource = nearestEnergyCarrier;
        }
      }
      else if(nearestEnergyCarrier){
        collectionSource = nearestEnergyCarrier;
      }
      else {
        collectionSource = localEnergyStorage;
      }

      if(collectionSource){
        if (collectionSource.transfer(creep,RESOURCE_ENERGY) != OK) {
          creep.moveTo(collectionSource);
        }
        return true;
      }
      return false;
    }
    else{
      creep.say("not collecting right now");

      var rallypoint = Game.flags[home.memory.spawnRally];
      var nearbyPosition = new RoomPosition(home.pos.x + 5, home.pos.y + 5, home.pos.roomName ) ;
      if(rallypoint){
        creep.moveTo(rallypoint);  
      } 
      else{
        creep.moveTo(nearbyPosition);
      }
      return true;
    }

  }
}
