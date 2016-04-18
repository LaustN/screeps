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

  var harvestBody = [CARRY,MOVE];
  var truckBody = [CARRY,MOVE];
  var workerPartsPerWorker = 0;
  var remainingCapacity = capacity - 100;

  if(capacity > 400){
    harvestBody = [CARRY,CARRY,MOVE,MOVE];
    truckBody = [CARRY,CARRY,MOVE,MOVE];
    remainingCapacity = capacity - 200;
  }
  var keepAddingParts = true;
  while (remainingCapacity>=100 && keepAddingParts) {
    remainingCapacity -= 100;
    workerPartsPerWorker++;
    if(workerPartsPerWorker>=5){
      keepAddingParts = false;
    }
    harvestBody.unshift(WORK);
    truckBody.unshift(CARRY,MOVE);
  }

  var workerCountBasedOnWorkerParts = Math.floor( sourcesCount * 5 / workerPartsPerWorker) + 1; //have 1 harvester team to spare
  var maxWorkerCount = Math.min(harvestPoints, workerCountBasedOnWorkerParts);
  maxWorkerCount = Math.max(maxWorkerCount, sourcesCount); //at least 1 team per source

  var fnCullCreep = function(name, body){
    var existingCreep = Game.creeps[name];

    if(existingCreep && existingCreep.body.length < body.length){
      console.log("Suiciding " + existingCreep.name + " since it is smaller than I want it to be");
      existingCreep.suicide();
      existingCreep = null;
      return true;
    }
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

  var fnSuicideNamedCreep = function(creepName){
    var suicidingCreep = Game.creeps[creepName];
    if(suicidingCreep){
      console.log("Suiciding " + creepName);
      suicidingCreep.suicide();
    }
  }

  for (; i <= maxWorkerCount+10; i++) {
    var newHarvesterName = spawn.name +  "Harvest" + i;
    fnSuicideNamedCreep(newHarvesterName);
    var newTruckName = spawn.name + "Truck" + i;
    fnSuicideNamedCreep(newTruckName);
  }

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
      name: "BuilderAssistant",
      memory: {
        role: "builder"
      }
    },
    {
      body: harvestBody,
      name: "Fortifier",
      memory: {
        role: "fortifier"
      }
    },
    {
      body: harvestBody,
      name: "FortifierAssistant",
      memory: {
        role: "fortifier"
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
    {
      body: harvestBody,
      name: "Scout1",
      memory: {
        role: "scout",
        focus: "571140dfa51212a07686b0e3"
      }
    },
    {
      body: truckBody,
      name: "remoteTruck",
      memory: {
        role: "remoteTruck",
        focus: "RunsHouse"
      }
    },
    {
      body: truckBody,
      name: "remoteTruck2",
      memory: {
        role: "remoteTruck",
        focus: "RunsHouse"
      }
    },
  ];


  for(var creepNumber in creepsToMaintain){
    var creepDefinition = creepsToMaintain[creepNumber];
    var newCreepName = spawn.name +  creepDefinition.name;
    if(fnCreateCreep(newCreepName,creepDefinition.body,creepDefinition.memory)){
      return;
    }
  }

  for(var creepNumber in creepsToMaintain){
    var creepDefinition = creepsToMaintain[creepNumber];
    var newCreepName = spawn.name +  creepDefinition.name;
    if(fnCullCreep(newCreepName,creepDefinition.body)){
      return;
    }
  }

  if(spawn.memory.assaultCount){
    var assaultBody = [TOUGH,TOUGH,ATTACK,ATTACK,RANGED_ATTACK,MOVE,MOVE];
    i=1;
    for (; i <= spawn.memory.assaultCount; i++) {
      var newAssaultName = spawn.name +  "Assault" + i;
      if(fnCreateCreep(newAssaultName,assaultBody,{role:"assault", assault:"AssaultFlag"})){
        return;
      }
    }

  }

  spawn.memory.state = "OK";
}
