module.exports = function(creep){
  if(!creep.memory.waypoints || creep.memory.waypoints.length == 0) {
    creep.memory.waypoints = [];
    creep.memory.waypoints.push(creep.memory.home);

    var localFlags = creep.room.find(FIND_FLAGS);
    for(var flagName in localFlags){
      var flag = localFlags[flagName].id;
      creep.memory.waypoints.push(flag);
      creep.memory.waypoints.push(creep.memory.home);
    }
  }
  creep.pos.look().foreach(function(elementAtPostion){
    console.log("FooBar");
  });

  var roadFound = false;
  var lookResult = creep.pos.look();
  if(lookResult) {
    console.log("roadie has a lookResult");
    for(var lookItemName in lookResult){
      var lookItem = lookResult[lookItemName];
      console.log("Type looked at:" + lookItem.type);
      if(lookItem.type == "structure" && lookItem.structure.structureType == STRUCTURE_ROAD){
        console.log("Road Found");
        roadFound = true;
      }
    }
  }
  var nearbySites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES,0)
  if(nearbySites && nearbySites.length>0 ){
    for (var sitename in nearbySites) {
      var site = nearbySites[sitename];
      console.log(site);
    }
    roadFound = true;
  }
  if(!roadFound){
    creep.pos.createConstructionSite(STRUCTURE_ROAD);
    console.log(creep.name + " creating road here");
  }

  var waypoint = Game.getObjectById(creep.memory.waypoints[0]);
  while(waypoint == null && creep.memory.waypoints.length>0){
    creep.memory.waypoints.shift();
    waypoint = Game.getObjectById(creep.memory.waypoints[0]);
  }
  creep.moveTo(waypoint);
  if(creep.pos.getRangeTo(waypoint) <= 1){
    creep.memory.waypoints.shift();
  }
}
