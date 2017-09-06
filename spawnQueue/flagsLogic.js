module.exports = function () {
  for(var flagName in Game.flags){
    var flag = Game.flags[flagName];
    if(!flag.memory.sourceRooms){
      flag.memory.sourceRooms = [
        {
          name:"[roomName]",
          builders:0, 
          harvesters:0,
          collectors:0,
          scouts:0,
          reservers:0,
          claimers:0,
          healers:0,
          assaulters:0
        }
      ];
    }
    
    
  }
}
