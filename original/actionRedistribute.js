module.exports = function(creep){
  /*
  determine state:
  - fill spawn
  - fill tower
  */
  var home = Game.getObjectById(creep.memory.home);
  var structures = creep.room.find(FIND_STRUCTURES);
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
    if(structure.structureType == STRUCTURE_CONTAINER){
      storages.push(structure);
    }
  }

  var collectFromStorage = function(){
    if(creep.carry.energy != 0){
      return false;
    }

    var nearestStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if(structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY]>0){
        return true;
      }
      if(structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>0){
        return true;
      }
    }});

    if(nearestStorage!=null){
      if(nearestStorage.transfer(creep,RESOURCE_ENERGY) != OK){
        creep.moveTo(nearestStorage);
      }
      return true;
    }
  };

  if(home.energy < home.energyCapacity ){
    //home is not so full
    if(!collectFromStorage()){
      if(creep.transfer(home, RESOURCE_ENERGY) != OK){
        creep.moveTo(home);
      }
    }
    return true;
  }

  var lowEnergySpawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(structure){
    if(structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity){
      return true;
    }
  }});
  if(lowEnergySpawn){

    if(!collectFromStorage()){
      if(creep.transfer(lowEnergySpawn, RESOURCE_ENERGY) != OK){
        creep.moveTo(lowEnergySpawn);
      }
    }
    return true;
  }

  var lowEnergyExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(structure){
    if(structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity){
      return true;
    }
  }});
  if(lowEnergyExtension){
    if(!collectFromStorage()){
      if(creep.transfer(lowEnergyExtension, RESOURCE_ENERGY) != OK){
        creep.moveTo(lowEnergyExtension);
      }
    }
    return true;
  }

  if(home.energy == home.energyCapacity && towers && towers.length>0){
    //home is full, so fill any towers
    for(var towerIndex in towers){
      var tower = towers[towerIndex];
      if(tower.energy < tower.energyCapacity){
        if(!collectFromStorage()){
          if(creep.transfer(tower, RESOURCE_ENERGY) != OK){
            creep.moveTo(tower);
          }
          return true;
        }
      }
    }
  }
}
