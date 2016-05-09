module.exports = function(creep){
  console.log("resetting " + creep.name);
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }
  var newMemory = { role: creep.memory.role, focus: null, home: creep.memory.home, harvest: true, scoutFlag: creep.memory.scoutFlag };
  creep.memory = newMemory;
  return true;
}
