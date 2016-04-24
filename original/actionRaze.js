module.exports = function(creep){
  if(creep.memory.razeTarget){
console.log("Razing");
    if(creep.carryCapacity > 0 && _.sum(creep.carry)  == creep.carryCapacity){
console.log("Too full");
      return false; //do not raze on a full stomach
    }
    var razeFlag = Game.flags[creep.memory.razeTarget];
    console.log(razeFlag);
    if(razeFlag != null){
      console.log("found a flag");
      var razeRange = 0;
      if(creep.memory.razeRange){
        razeRange = creep.memory.razeRange;
      }
      else {
        creep.memory.razeRange = 0;
      }
      console.log("Raze range is " + razeRange);
      var razeTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure){
        if (structure.my) {
          return false;
        }
        if (creep.pos.getRangeTo(structure) <=razeRange) {
          return true;
        }
        return false;
      }});
      if(razeTarget){
        creep.moveTo(razeTarget);
        creep.dismantle(razeTarget);
        creep.attack(razeTarget);
        return true;
      }
    }
  }
  else {
    creep.memory.razeTarget = "[Name of a flag]";
  }
}
