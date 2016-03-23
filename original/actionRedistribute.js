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

  if(home.energy == home.energyCapacity && towers && towers.length>0){
    //home is full, so fill any towers
    console.log(creep.name + " wants to refill towers");
//    return true;
  }

  if(home.energy / home.energyCapacity < 0.75){
    //home is not so full
    console.log(creep.name + " wants to refill home");
//    return true;
  }

}
