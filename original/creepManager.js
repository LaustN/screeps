module.exports = function (spawn) {
  var roomName = spawn.room.name;
  var capacity = spawn.room.energyCapacityAvailable;
  var extensionsInRoom = spawn.room.find(FIND_MY_STRUCTURES, {filter: function(structure){ return structure.structureType == STRUCTURE_EXTENSION && structure.isActive(); }});
  switch (spawn.room.controller.level) {
    case 7:
      capacity = extensionsInRoom.length * 100 + 300;
      break;
    case 8:
      capacity = extensionsInRoom.length * 200 + 300;
      break;
    default:
      capacity = extensionsInRoom.length * 50 + 300;
      break;
  }

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
  var fnBodyBuild = function(bodyParts, maxPrice){
    var priceMap = {};
    priceMap[MOVE] = 50;
    priceMap[WORK] = 100;
    priceMap[CARRY] = 50;
    priceMap[ATTACK] = 80;
    priceMap[RANGED_ATTACK] = 150;
    priceMap[TOUGH] = 10;
    priceMap[HEAL] = 250;
    priceMap[CLAIM] = 600;
    var remainingCapacity = capacity;
    if(maxPrice){
      remainingCapacity = maxPrice;
    }
    var resultingBody  =[];
    while (true) {
      for (var assaultPartsIterator = 0; assaultPartsIterator < bodyParts.length; assaultPartsIterator++) {
        if(remainingCapacity < 50 || resultingBody.length == 50){
          resultingBody.sort(function(a,b){ return priceMap[a] - priceMap[b]; });
          return resultingBody;
        }
        var nextPart =  bodyParts[assaultPartsIterator];
        if (priceMap[nextPart] <= remainingCapacity) {
          resultingBody.unshift(nextPart)
          remainingCapacity-=priceMap[nextPart];
        }
      }
    }
  }

  var storedEnergyInRoom = function(room){
    var energySum = 0;
    var myStructures = room.find(FIND_STRUCTURES);
    for (var structureName in myStructures) {
      var structure = myStructures[structureName];
      if (structure.energy > 0) {
        energySum +=  structure.energy;
      }
      if(structure.store && structure.store[RESOURCE_ENERGY] > 0){
        energySum += structure.store[RESOURCE_ENERGY];
      }
    }
    return energySum;
  }

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

  var maxWorkerPrice = Math.min(capacity, 1500); //harvesters costing more than 1500 seem inefficient
  var harvestBody = fnBodyBuild([MOVE,CARRY,WORK,WORK],maxWorkerPrice);
  var truckBody = fnBodyBuild([MOVE,CARRY],maxWorkerPrice);;
  var workerPartsPerWorker = 0;
  for (var partIndex in harvestBody) {
    if(harvestBody[partIndex] == WORK){
      workerPartsPerWorker++;
    }
  }

  var scoutBody = fnBodyBuild([MOVE,CARRY,MOVE,WORK], Math.min(capacity,2000));
  var remotetruckBody = fnBodyBuild([MOVE,CARRY], Math.min(capacity,2000));
  var defenderBody = fnBodyBuild([MOVE,RANGED_ATTACK]);

  var workerCountBasedOnWorkerParts = Math.floor( sourcesCount * 5 / workerPartsPerWorker) + 1; //have 1 harvester team to spare
  var maxWorkerCount = Math.min(harvestPoints, workerCountBasedOnWorkerParts);
  maxWorkerCount = Math.max(maxWorkerCount, sourcesCount); //at least 1 team per source

  var maxReserveLayers = Math.floor(capacity/700);
  var reserverBody = fnBodyBuild([CLAIM,MOVE,MOVE]);

  var fnCreateCreep = function(name, body, memory){
    var existingCreep = Game.creeps[name];

    if(!existingCreep) {
      var createMessage = spawn.createCreep(body,name,memory);
      if(createMessage == name){
        spawn.memory.state = "OK";
        console.log("Respawning " + name);
      }
      else {
        switch (createMessage) {
          case ERR_NOT_ENOUGH_RESOURCES:
          case ERR_NOT_ENOUGH_ENERGY:
            if(spawn.memory.state != "SaveEnergy"){
              console.log(spawn.name + " saving up for " + name);
            }
            spawn.memory.state = "SaveEnergy";
            break;
          case ERR_BUSY:
          case -4:
            break;
          default:
            console.log("unexpected spawn message: " + createMessage + " body was " + JSON.stringify(body));
            break;
        }
      }
      return true;
    }
    return false;
  }

  var livingHarvesters = spawn.room.find(FIND_MY_CREEPS, {filter: function(maybeAHarvester){
    return maybeAHarvester.memory.role == "harvester";
  }});

  if(livingHarvesters.length == 0){
    //only keep a tiny harvester around when no proper ones exist here
    if(fnCreateCreep(roomName + "TinyHarvest", [WORK,CARRY,CARRY,MOVE,MOVE], {role: "harvester", scavengeRange: 3})){
      return;
    }
  }

  if(fnCreateCreep(roomName + "TinyRedistributor", [CARRY,CARRY,MOVE,MOVE], {role: "redistributor", scavengeRange: 3})){
    return;
  }

  if(fnCreateCreep(roomName + "Refiller", [CARRY,CARRY,MOVE,MOVE], {role: "refiller", scavengeRange: 3 })){
    return;
  }

  if(spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS)){
    console.log(spawn.name + " is spawning defenders");
    var defenderIndex = 1;
    var aDefenderWasCreated = false;
    while (!aDefenderWasCreated) {
      var defenderName = roomName + "Defender" + defenderIndex;
      aDefenderWasCreated =  fnCreateCreep(defenderName,defenderBody,{role:"defender"});
      defenderIndex++;
    }
    console.log(spawn.name + " creep management quitting after reaching defenderIndex=" + defenderIndex);
    return;
  }

  var i = 1;
  for (; i <= maxWorkerCount; i++) {
    var newHarvesterName = roomName +  "Harvest" + i;
    var harvesterMemory = {role:"harvester"};
    if ( i<= sources.length) {
      harvesterMemory["focus"] = sources[i-1].id;
    }
    if(fnCreateCreep(newHarvesterName,harvestBody,harvesterMemory)){
      return;
    }

    if ( i<= sources.length) {
      var sourceToFocusOn = sources[i-1];
      if(sourceToFocusOn.pos.findInRange(FIND_MY_STRUCTURES,4,{filter:function(structure){
        return structure.structureType == "link";
      }}) != null){
        continue;
      }
    }

    var newTruckName = roomName + "Truck" + i;
    if(fnCreateCreep(newTruckName, truckBody, { role: "harvestTruck", scavengeRange: 3, focus: newHarvesterName})){
      return;
    }
  }

  for (var i = 0; i < maxWorkerCount && i < sources.length; i++) {
    var harvesterName = roomName +  "Harvest" + (i+1);
    var harvester = Game.creeps[harvesterName];
    if(harvester){
      harvester.memory.focus = sources[i].id;
    }
  }

  var creepsToMaintain = [
    {
      body: remotetruckBody,
      name: "Redistributor",
      memory: {
        role: "redistributor",
        scavengeRange: 50
      }
    },
    {
      body: scoutBody,
      name: "Fortifier",
      memory: {
        role: "fortifier"
      }
    },
    {
      body: scoutBody,
      name: "Builder",
      memory: {
        role: "builder"
      }
    },
  ];

  if(!spawn.memory.workerLayers){
    spawn.memory.workerLayers = 1;
  }

  var storedValue = storedEnergyInRoom(spawn.room);
  var maxMiscCount = Math.ceil(storedValue / 1000) + 1;

  var spawnCount = 0;

  for (var workerLayersIterator = 1; workerLayersIterator <= spawn.memory.workerLayers; workerLayersIterator++) {
    for(var creepNumber in creepsToMaintain){
      var creepDefinition = creepsToMaintain[creepNumber];
      var newCreepName = roomName +  creepDefinition.name + workerLayersIterator;
      if(spawnCount > maxMiscCount){
        break;
      }
      if(fnCreateCreep(newCreepName,creepDefinition.body,creepDefinition.memory)){
        return;
      }
      spawnCount++;
    }
  }

  if(!spawn.memory.assaultOrders){
    spawn.memory.assaultOrders = [{flagName: "null", assaultCount: 0, rangerCount: 0, healCount: 0, maxPrice: 1500}];
  }

  if(spawn.memory.assaultOrders.length > 0){

    var assaultParts = [MOVE,ATTACK,MOVE,RANGED_ATTACK,MOVE,HEAL];
    var assaultRangerParts = [MOVE,RANGED_ATTACK];
    var healParts = [MOVE,HEAL];


    for (var assaultOrderIndex in spawn.memory.assaultOrders) {
      var assaultOrder =  spawn.memory.assaultOrders[assaultOrderIndex];
      var assaultMaxPrice = capacity;
      if (assaultOrder.maxPrice > 0) {
        assaultMaxPrice = assaultOrder.maxPrice;
      }
      var assaultBody = fnBodyBuild(assaultParts, assaultMaxPrice);
      i=1;
      for (; i <= assaultOrder.assaultCount; i++) {
        var newAssaultName = roomName + assaultOrder.flagName  +  "Assault" + i;
        if(fnCreateCreep(newAssaultName,assaultBody,{role:"assault", assault:assaultOrder.flagName})){
          return;
        }
      }
      var rangerBody = fnBodyBuild(assaultRangerParts, assaultMaxPrice);
      i=1;
      for (; i <= assaultOrder.rangerCount; i++) {
        var newAssaultName = roomName + assaultOrder.flagName  +  "Ranger" + i;
        if(fnCreateCreep(newAssaultName,rangerBody,{role:"assaultRanger", assault:assaultOrder.flagName})){
          return;
        }
      }
      var healBody = fnBodyBuild(healParts, assaultMaxPrice);
      i=1;
      for (; i <= assaultOrder.healCount; i++) {
        var newHealName = roomName + assaultOrder.flagName  +  "Healer" + i;
        if(fnCreateCreep(newHealName,healBody,{role:"healer", assault:assaultOrder.flagName})){
          return;
        }
      }
    }
  }

  if(!spawn.memory.scoutTargets){
    spawn.memory.scoutTargets = [{flagName:"[FlagName]",razeRange:-1, scoutCount:0,remoteTruckCount:0, reserve: false}];
  }

  if(spawn.memory.scoutTargets){
    for(var scoutTargetsIterator = 0 ; scoutTargetsIterator<spawn.memory.scoutTargets.length ; scoutTargetsIterator++){
      var scoutTarget = spawn.memory.scoutTargets[scoutTargetsIterator];
      var scoutTargetFlag = Game.flags[scoutTarget.flagName];
      if(scoutTargetFlag){
        var distantTarget = null;
        try {
          distantTarget = scoutTargetFlag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        } catch (e) {

        }

        if(distantTarget){
          console.log(spawn.name + " is spawning defenders for " + scoutTargetFlag.name);
          var defenderIndex = 1;
          var aDefenderWasCreated = false;
          while (!aDefenderWasCreated) {
            var defenderName = scoutTargetFlag.name + "Defender" + defenderIndex;
            aDefenderWasCreated =  fnCreateCreep(defenderName,defenderBody,{role:"defender", defendFlag: scoutTargetFlag.name});
          }
          console.log(spawn.name + " creep management quitting after reaching defenderIndex=" + defenderIndex);
          return;
        }

        var newScoutMemory = {scoutFlag: scoutTargetFlag.name, role:"scout", scavengeRange: 3};
        if(scoutTarget.razeRange > -1 && scoutTarget.razeTarget){
          newScoutMemory.razeTarget = scoutTarget.razeTarget;
          newScoutMemory.razeRange = scoutTarget.razeRange;
        }

        i = 1;
        for (; i <= scoutTarget.scoutCount; i++) {
          var newScoutName = roomName + scoutTarget.flagName +  "Scout" + i;
          if(fnCreateCreep(newScoutName,scoutBody,newScoutMemory)){
            return;
          }
        }

        i = 1;
        for (; i <= scoutTarget.remoteTruckCount; i++) {
          var remoteTruckName = roomName + scoutTarget.flagName +  "RemoteTruck" + i;
          if(fnCreateCreep(remoteTruckName,remotetruckBody,{role:"remoteTruck", focus: scoutTarget.flagName, scavengeRange: 3})){
            return;
          }
        }

        if(!scoutTarget.reserve){
          continue;
        }

        if (!scoutTargetFlag.room) {
          continue; //skip ahead when we cannot see a controller in the flagged room. Might be caused by not having any other creep in the room
        }
        if (!scoutTargetFlag.room.controller) {
          continue; //skip ahead when we cannot see a controller in the flagged room. Might be caused by not having any other creep in the room
        }

        if (scoutTargetFlag.room.controller.owner && scoutTargetFlag.room.controller.my == false) {
          if(fnCreateCreep(roomName + "Reserver" + scoutTargetFlag.name, reserverBody, {role:"reserver",focus:scoutTargetFlag.name})){
            console.log("Trying to create " + roomName + "Reserver" + scoutTargetFlag.name);
            return;
          }
        }

        if (scoutTargetFlag.room.controller.reservation && scoutTargetFlag.room.controller.reservation.ticksToEnd > 1000 ) {
          continue;
        }

        if(fnCreateCreep(roomName + "Reserver" + scoutTargetFlag.name, reserverBody, {role:"reserver",focus:scoutTargetFlag.name})){
          return;
        }

      }
    }
  }

  spawn.memory.state = "OK";
}
