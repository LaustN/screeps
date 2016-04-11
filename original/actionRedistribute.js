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
    if(structure.structureType == STRUCTURE_CONTAINER){
      storages.push(structure);
    }
  }

  var collectFromStorage = function(){
    if(creep.carry.energy != 0){
      return false;
    }
    for(var storageIndex in storages){
      var storage = storages[storageIndex];

      if(storage.store[RESOURCE_ENERGY] > 0){
        if(storage.transfer(creep,RESOURCE_ENERGY) != OK){
          creep.moveTo(storage);
        }
        return true;
      }
    }
    for(var storageIndex in towers){
      var storage = towers[storageIndex];
      if(storage.energy > 0){
        if(storage.transferEnergy(creep) != OK){
          creep.moveTo(storage);
        }
        return true;
      }
    }
  };

  if(home.energy / home.energyCapacity < 0.75){
    //home is not so full
    if(!collectFromStorage()){
      if(creep.transfer(home, RESOURCE_ENERGY) != OK){
        creep.moveTo(home);
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
    if(!collectFromStorage()){
      for(var towerIndex in towers){
        var tower = towers[towerIndex];
        if(tower.energy < tower.energyCapacity){
          if(creep.transfer(tower, RESOURCE_ENERGY) != OK){
            creep.moveTo(tower);
          }
          return true;
        }
      }
    }
  }
}
