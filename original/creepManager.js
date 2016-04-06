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

  var harvestBody = [CARRY,MOVE];
  var truckBody = [CARRY,MOVE];
  var workerPartsPerWorker = 0;
  var remainingCapacity = capacity - 100;
  if(capacity > 400){
    harvestBody = [CARRY,CARRY,MOVE,MOVE];
    truckBody = [CARRY,CARRY,MOVE,MOVE];
    remainingCapacity = capacity - 200;
  }
  while (remainingCapacity>=100) {
    remainingCapacity -= 100;
    harvestBody.unshift(WORK);
    workerPartsPerWorker++;
    truckBody.unshift(CARRY,MOVE);
  }

  var maxWorkerCount = harvestPoints;
  if(harvestPoints * workerPartsPerWorker / sourcesCount > 25){
    maxWorkerCount = Math.ceil(sourcesCount * 20 / workerPartsPerWorker);
  }

  var fnCreateCreep = function(name, body, memory){
    var existingCreep = Game.creeps[name];

    if(existingCreep.body.length < body.length){
      existingCreep.suicide();
      existingCreep = null;
    }

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

  for (var i = 1; i <= maxWorkerCount; i++) {
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
  ];
  for(var creepNumber in creepsToMaintain){
    var creepDefinition = creepsToMaintain[creepNumber];
    var newCreepName = spawn.name +  creepDefinition.name;
    if(fnCreateCreep(newCreepName,harvestBody,creepDefinition.memory)){
      return;
    }
  }

  spawn.memory.state = "OK";
}
