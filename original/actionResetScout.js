module.exports = function(creep){
  console.log("resetting " + creep.name);
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }
  var newMemory = { role: creep.memory.role, focus: creep.memory.focus, home: creep.memory.home };
  creep.memory = newMemory;
  return true;
}
