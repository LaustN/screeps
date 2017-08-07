module.exports = function(creep){
  /*
  determine state:
  - fill spawn
  - fill tower
  */
  var home = Game.getObjectById(creep.memory.home);
  var towers = creep.room.find(FIND_MY_STRUCTURES, {filter:function(structure){ return structure.structureType == STRUCTURE_TOWER }});

  var collectFromStorage = function(ignoreRoomStorage){
    if(creep.carry.energy != 0){
      return false;
    }
    var homeLink = home.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter : function(structure){ return structure.structureType == STRUCTURE_LINK;}});
    if (homeLink && homeLink.energy > 0) {
      if (homeLink.pos.getRangeTo(creep)>1) {
        creep.moveTo(homeLink);
      }
      else {
        creep.withdraw(homeLink, RESOURCE_ENERGY);
      }
      return true;
    }

    var nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if(structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>0){
        return true;
      }
    }});

    if(nearestContainer!=null){
      if(creep.withdraw (nearestContainer,RESOURCE_ENERGY) != OK){
        creep.moveTo(nearestContainer);
      }
      return true;
    }

    if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
      if(creep.withdraw(creep.room.terminal,RESOURCE_ENERGY) != OK){
        creep.moveTo(creep.room.terminal);
      }
      return true;

    }

    if(!ignoreRoomStorage && creep.room.storage){
      if(creep.withdraw(creep.room.storage,RESOURCE_ENERGY) != OK){
        creep.moveTo(creep.room.storage);
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
  if(creep.room.storage){
    if(!collectFromStorage(true)){
      if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) != OK){
        creep.moveTo(creep.room.storage);
      }
      return true;
    }

  }
}
