module.exports = function(creep){
  /*
  determine state:
  - fill spawn
  - fill tower
  */
  var home = Game.getObjectById(creep.memory.home);
  var structures = creep.room.find(FIND_MY_STRUCTURES);
  var towers = [];
  var storages = [];
  for(var structureName in structures){
    var structure = structures[structureName];
    if(structure.structureType == STRUCTURE_TOWER){
      towers.push(structure);
    }
    if(structure.structureType == STRUCTURE_STORAGE){
      storages.push(structure);
    }
  }
  var collectFromStorage = function(){
    if(creep.carry.energy == creep.carryCapacity){
      return false;
    }
    var collectionPoint = null;
    for(var storageIndex in storages){
      var storage = storages[storageIndex];
      if(storage.store[RESOURCE_ENERGY] > 0){
        collectionPoint = storage;
      }
    }
    if(collectionPoint){
      if(collectionPoint.transfer(creep,RESOURCE_ENERGY) != OK){
        creep.moveTo(collectionPoint);
      }
      return true;
    }
  };

  if(home.energy == home.energyCapacity && towers && towers.length>0){
    //home is full, so fill any towers
    if(!collectFromStorage()){
      for(var towerIndex in towers){
        var tower = towers[towerIndex];
        if(tower.energy < tower.energyCapacity){
          console.log(creep.name + " wants to refill tower at " + tower.pos);
          if(creep.transfer(tower, RESOURCE_ENERGY) != OK){
            creep.moveTo(tower);
          }
          return true;
        }
      }
    }
  }

  if(home.energy / home.energyCapacity < 0.75){
    //home is not so full
    console.log(creep.name + " wants to refill home");
    if(!collectFromStorage()){
      if(creep.transfer(home, RESOURCE_ENERGY) != OK){
        creep.moveTo(home);
      }
    }
    return true;
  }

  console.log(creep.name + " is not redistributing right now");

}
