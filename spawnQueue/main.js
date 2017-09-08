var actionEnsureHome = require("actionEnsureHome");
var runTowers = require("runTowers");
var runLinks = require("runLinks");
var roomLogic = require("roomLogic")


var roleActions = {
  "harvester": ["actionSetGivesEnergy","actionHarvest","actionDump"],
  "harvestWithReturn" : ["actionSetGivesEnergy","actionHarvest","actionUnload"],
  "builder": ["actionSetWantsEnergy","actionBuild"],
  "controlUpgrader": ["actionSetWantsEnergy","actionUpgradeController"],
  "fortifier": ["actionSetWantsEnergy","actionFortify"],
  "repairer": ["actionSetWantsEnergy","actionRepair"],
  
  "harvestTruck": ["actionUnload","actionHarvestCollection"],
  "resupplyBuildings":["actionDistributeToBuildings","actionFetchFromStorage"],
  "stockpile":["actionSetGivesEnergy","actionCollectRemote","actionFillStorage"],
  "resupplyWorkers":["actionSetMovesEnergy","actionDistributeToWorkers","actionFetchFromStorage"],
  "looter" :["actionMigrate","actionFetchRemote", "actionFetchDroppedEnergy", "actionUnload"],
  "scavenger" :["actionFetchDroppedEnergy", "actionUnload"],

  "scout":["actionMigrate"], //needs a lot of brains for switching roles on the fly between work and move roles

  "reserver":["actionReserve","actionSign"],

  "defender": ["actionDefend","actionHold","actionRecycle"],

  "healer": ["actionHealCreeps","actionHealerMove"],
  "recycler": ["actionRecycle"],
  "scout": ["actionTravel"],
  "remoteHarvester":["actionSetGivesEnergy","actionEnsureDropPoint","actionHarvest","actionDump"],
  "remoteCollector":["actionReturnOnFull","actionRoamOnEmpty","actionUnload","actionHarvestCollection"],
  "pausedWorker":["actionSetGivesEnergy"],
  "pausedMover":["actionSetGivesEnergy"]
};

var actions={};
for (var roleName in  roleActions) {
  var role = roleActions[roleName];
  for (var i = 0; i < role.length; i++) {
    var actionName = role[i];
    if(typeof(actions[actionName])=="undefined") {
      actions[actionName] = require(actionName);
    }
  }
}

var roomStates = [
  "Frontier", //many buildings still needed, ControllerLevel likely too low
  "Flush", //Ready to help neighbours
  "Defending", //this room is being attacked or has been attacked recently
  "Attacking" //this room participates in aggressivley spawning assault creeps
];

var bodyTypes = [
  "work", 
  //has very little storage. 
  //Will determine job, move to location, do the job, take any energy that happens to be around. 
  //Storage is only minimal buffer to permit move some latency 
  "move",
  //collects from harvesters, provides energy to workers, distributes from storage to energy spending buildings
  "mix",
  //will perform nearly any role, likely inefficiently, but not relying on any but itself
  "claim",
  //only used when expanding. Has the claim body part. If the room decides to be an owned room, will claim it - otherwise reserved.
  "heal",
  //has HEAL
  "bite",
  //has ATTACK
  "shoot"
  //has ATTACK_RANGED
];


module.exports.loop = function () {
  Memory.workingLinks = {};
  console.log("============= " + Game.time + " ==============");
  var profilingData = {};
  var lastTick = Game.cpu.getUsed();
  profilingData["aStart"] = lastTick;

  
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing memory:', name);
    }
  }

  for(var name in Memory.spawns) {
    if(!Game.spawns[name]) {
        delete Memory.spawns[name];
        console.log('Clearing memory:', name);
    }
  }
  for(var name in Memory.rooms) {
    if(!Game.rooms[name]) {
        delete Memory.rooms[name];
        console.log('Clearing memory:', name);
    }
  }

  roomLogic();
  runTowers();
  runLinks();

  creepLoop:
  for(var creepName in Game.creeps){
    var creep = Game.creeps[creepName];
    actionEnsureHome(creep);

    var actionsToTake = roleActions[creep.memory.role];
    if (actionsToTake) {
      actionLoop:
      for (var actionName in actionsToTake) {
        var action = actions[actionsToTake[actionName]];
        if (action) {
          var actionResult = action(creep);
          if(actionResult){
            break actionLoop;
          }
        }
        else {
          console.log("no action called " + actionsToTake[actionName] + " was found for role " + creep.memory.role);
        }
      }
    }
    else {
      console.log("no actions found for " + creep.name + " in role " + creep.memory.role);
    }

    if(creep.memory.focus){
      var focusObject = Game.getObjectById(creep.memory.focus);
      if(focusObject)
        creep.room.visual.line(creep.pos, focusObject.pos);
    }

    var usedCpu = Game.cpu.getUsed();
    if(usedCpu > (Game.cpu.limit)){
      console.log("Quitting creep execution since used cpu time is " + usedCpu + " of " + Game.cpu.limit);
      break;
    }
  }
  lastTick = Game.cpu.getUsed();


}
