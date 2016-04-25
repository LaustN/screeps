module.exports = function (spawn) {
  var capacity = spawn.room.energyCapacityAvailable;
  var harvestPoints = 0;
  var sources = spawn.room.find(FIND_SOURCES);
  var sourcesCount = sources.length;
  var offsets = [
    {x: -1,y: -1},
    {x:0, y:-1},
    {x:1,y:-1},
    {x:-1,y:0},
    {x:1,y:0},
    {x:-1,y:1},
    {x:0,y:1},
    {x:1,y:1},
  ];

  for(var sourceKey in sources){
    var source = sources[sourceKey];
    var initial = source.pos;
    for (var offsetKey in offsets) {
      var offset = offsets[offsetKey];
      var newPos = new RoomPosition(initial.x + offset.x, initial.y + offset.y,initial.roomName);
      var terrain = newPos.lookFor("terrain");
      if (terrain == "plain") {
        harvestPoints++;
      }
      if (terrain == "swamp") {
        harvestPoints++;
      }
    }
  }

  //we seemingly need 5 worker parts per source
  //3000 energy in a source every 300 ticks = 10 energy generated per tick
  //each worker part harvests 2 energy per tick
  // -> 5 worker parts should be enough to drain a source between each regenerate

  var harvestBody = [];
  var truckBody = [];
  var workerPartsPerWorker = 0;
  var remainingCapacity = capacity;

  while (remainingCapacity>=300) {
    remainingCapacity -= 300;
    harvestBody.unshift(WORK,WORK,CARRY,MOVE);
    truckBody.unshift(CARRY,MOVE,CARRY,MOVE,CARRY,MOVE);
    workerPartsPerWorker += 2;
  }

  var workerCountBasedOnWorkerParts = Math.floor( sourcesCount * 5 / workerPartsPerWorker) + 1; //have 1 harvester team to spare
  var maxWorkerCount = Math.min(harvestPoints, workerCountBasedOnWorkerParts);
  maxWorkerCount = Math.max(maxWorkerCount, sourcesCount); //at least 1 team per source

  var fnCullCreep = function(name, body){
    var existingCreep = Game.creeps[name];

    if(existingCreep && existingCreep.spawning){
      return false;
    }

    var extensionsBeingBuilt = spawn.room.find(FIND_MY_CONSTRUCTION_SITES,{filter:function(structure){
      if(structure.structureType == "extension"){
        return true;
      }
      return false;
    }});
    if(extensionsBeingBuilt.length>0){
      //not culling anything while extensions are being built;
      return;
    }

    if(existingCreep && existingCreep.body.length != body.length){
      console.log("Suiciding " + existingCreep.name + " since it is differently sized than I want it to be");
      existingCreep.suicide();
      existingCreep = null;
      return true;
    }

    for(var bodyIterator = 0; bodyIterator < body.length; bodyIterator++ ){
      if(existingCreep.body[bodyIterator].type != body[bodyIterator]){
        console.log("Suiciding " + existingCreep.name + " since it does not have the parts I want it to have");
        existingCreep.suicide();
        existingCreep = null;
        return true;
      }
    }
    return false;
  }

  var fnCreateCreep = function(name, body, memory){
    var existingCreep = Game.creeps[name];

    if(!existingCreep) {
      var createMessage = spawn.createCreep(body,name,memory);
      if(createMessage == name){
        spawn.memory.state = "OK";
        console.log("Respawning " + name);
      }
      else if(createMessage == ERR_NOT_ENOUGH_RESOURCES){
        spawn.memory.state = "SaveEnergy";
        console.log(spawn.name + " saving up for " + name);
      }
      return true;
    }
    return false;
  }

  if(fnCreateCreep(
    spawn.name + "Tiny",
    [CARRY,CARRY,MOVE,MOVE],
    {
      role: "redistributor",
      scavengeRange: 50
    })){
    return;
  }



  var i = 1;
  for (; i <= maxWorkerCount; i++) {
    var newHarvesterName = spawn.name +  "Harvest" + i;
    if(fnCreateCreep(newHarvesterName,harvestBody,{role:"harvester"})){
      return;
    }
    var newTruckName = spawn.name + "Truck" + i;
    if(fnCreateCreep(
      newTruckName,
      truckBody,
      {
        role: "harvestTruck",
        scavengeRange: 3,
        focus: newHarvesterName
      })){
      return;
    }
  }

  i = 1;
  for (; i <= maxWorkerCount; i++) {
    var newHarvesterName = spawn.name +  "Harvest" + i;
    if(fnCullCreep(newHarvesterName,harvestBody)){
      return;
    }
    var newTruckName = spawn.name + "Truck" + i;
    if(fnCullCreep(newTruckName, truckBody)){
      return;
    }
  }

  // var fnSuicideNamedCreep = function(creepName){
  //   var suicidingCreep = Game.creeps[creepName];
  //   if(suicidingCreep){
  //     console.log("Suiciding " + creepName);
  //     suicidingCreep.suicide();
  //   }
  // }
  //
  // for (; i <= maxWorkerCount+10; i++) {
  //   var newHarvesterName = spawn.name +  "Harvest" + i;
  //   fnSuicideNamedCreep(newHarvesterName);
  //   var newTruckName = spawn.name + "Truck" + i;
  //   fnSuicideNamedCreep(newTruckName);
  // }

  for (var i = 0; i < maxWorkerCount && i < sources.length; i++) {
    var harvesterName = spawn.name +  "Harvest" + (i+1);
    var harvester = Game.creeps[harvesterName];
    if(harvester){
      harvester.memory.focus = sources[i].id;
    }
  }

  var creepsToMaintain = [
    {
      body: harvestBody,
      name: "Builder",
      memory: {
        role: "builder"
      }
    },
    {
      body: harvestBody,
      name: "Fortifier",
      memory: {
        role: "fortifier",
        scavengeRange: 50
      }
    },
    {
      body: harvestBody,
      name: "ControlUpgrader",
      memory: {
        role: "controlUpgrader"
      }
    },
    {
      body: truckBody,
      name: "Redistributor",
      memory: {
        role: "redistributor"
      }
    },
  ];

  for (var sourceCountIterator = 1; sourceCountIterator <= sourcesCount; sourceCountIterator++) {
    for(var creepNumber in creepsToMaintain){
      var creepDefinition = creepsToMaintain[creepNumber];
      var newCreepName = spawn.name +  creepDefinition.name + sourceCountIterator;
      if(fnCreateCreep(newCreepName,creepDefinition.body,creepDefinition.memory)){
        return;
      }
    }

    for(var creepNumber in creepsToMaintain){
      var creepDefinition = creepsToMaintain[creepNumber];
      var newCreepName = spawn.name +  creepDefinition.name + sourceCountIterator;
      if(fnCullCreep(newCreepName,creepDefinition.body)){
        return;
      }
    }
  }

  if(!spawn.memory.scoutTargets){
    spawn.memory.scoutTargets = [{flagName:"[FlagName]", scoutCount:0,remoteTruckCount:0}]
  }

  if(spawn.memory.scoutTargets){
    for(var scoutTargetsIterator = 0 ; scoutTargetsIterator<spawn.memory.scoutTargets.length ; scoutTargetsIterator++){
      var scoutTarget = spawn.memory.scoutTargets[scoutTargetsIterator];
      var scoutTargetFlag = Game.flags[scoutTarget.flagName];

      i = 1;
      for (; i <= scoutTarget.scoutCount; i++) {
        var newScoutName = spawn.name + scoutTarget.flagName +  "Scout" + i;
        if(fnCreateCreep(newScoutName,harvestBody,{focus: scoutTargetFlag.id,role:"scout"})){
          return;
        }
      }

      i = 1;
      for (; i <= scoutTarget.remoteTruckCount; i++) {
        var remoteTruckName = spawn.name + scoutTarget.flagName +  "RemoteTruck" + i;
        if(fnCreateCreep(remoteTruckName,truckBody,{role:"remoteTruck", focus: scoutTarget.flagName, scavengeRange: 20})){
          return;
        }
      }
    }
  }

  if(spawn.memory.assaultCount){

    var fnAssaultBodyBuild = function(){
      var remainingAssaultBodyCapacity = capacity;
      var assaultParts = [
        {cost:50, part: MOVE},
        {cost:80, part: ATTACK},
        {cost:50, part: MOVE},
        {cost:80, part: ATTACK},
        {cost:50, part: MOVE},
        {cost:150, part: RANGED_ATTACK},
        {cost:50, part: MOVE},
        {cost:80, part: ATTACK},
        {cost:50, part: MOVE},
        {cost:150, part: RANGED_ATTACK},
        {cost:50, part: MOVE},
        {cost:250, part: HEAL}
      ];
      var resultingBody  =[];
      while (true) {
        for (var assaultPartsIterator = 0; assaultPartsIterator < assaultParts.length; assaultPartsIterator++) {
          if(remainingCapacity < 50){
            return resultingBody;
          }
          var nextPart =  assaultParts[assaultPartsIterator];
          if (nextPart.cost <= remainingCapacity) {
            resultingBody.unshift(nextPart.part)
            remainingCapacity-=nextPart.cost;
          }
        }
      }
    }

    var assaultBody = fnAssaultBodyBuild();
    console.log("assaultBody is " + JSON.stringify(assaultBody));

    i=1;
    for (; i <= spawn.memory.assaultCount; i++) {
      var newAssaultName = spawn.name +  "Assault" + i;
      if(fnCreateCreep(newAssaultName,assaultBody,{role:"assault", assault:"AssaultFlag"})){
        return;
      }
      if(fnCullCreep(newAssaultName,assaultBody)){
        return;
      }
    }

  }

  spawn.memory.state = "OK";
}
