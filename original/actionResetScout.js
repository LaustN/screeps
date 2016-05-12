module.exports = function(creep){
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }
  var newMemory = { role: creep.memory.role, focus: null, home: creep.memory.home, harvest: true, scoutFlag: creep.memory.scoutFlag, scavengeRange: creep.memory.scavengeRange };
  creep.memory = newMemory;
  return true;
}
