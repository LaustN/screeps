var spawnLogic = require("spawnLogic");
var actionEnsureHome = require("actionEnsureHome");
var runTowers = require("runTowers");
var runLinks = require("runLinks");
var roomBuildings = require("roomBuildings")


var actionsNames = [
  "actionAssaultCreeps",
  "actionAssaultDestroyFlaggedLocation",
  "actionAssaultMove",
  "actionAssaultRanged",
  "actionAssaultStructures",
  "actionAttackRanged",
  "actionBuild",
  "actionClaim",
  "actionCollectEnergy",
  "actionDefend",
  "actionFlee",
  "actionFortify",
  "actionHarvest",
  "actionHarvestCollection",
  "actionHealCreeps",
  "actionHealerMove",
  "actionHold",
  "actionHomeUnloadEnergy",
  "actionProximityHealer",
  "actionRaze",
  "actionRecycle",
  "actionRedistribute",
  "actionRedistributeFillStorage",
  "actionRemoteCollectEnergy",
  "actionRenew",
  "actionReserve",
  "actionResetScout",
  "actionScavenge",
  "actionScout",
  "actionUnloadEnergy",
  "actionUpgradeControl"];

var actions={};
for (var i = 0; i < actionsNames.length; i++) {
  actions[actionsNames[i]] = require(actionsNames[i]);
}

var roleActions = {
  "harvester": ["actionSetGivesEnergy","actionHarvest","actionDump","actionMoveToFocus"],
  "builder": ["actionSetWantsEnergy","actionResolveBuildTarget","actionBuild","actionMoveToFocus"],
  "controlUpgrader": ["actionSetWantsEnergy","actionUpgradeController","actionMoveToFocus"],
  "fortifier": ["actionSetWantsEnergy","actionFortify","actionResolveFortifyTarget","actionMoveToFocus"],
  "repairer": ["actionSetWantsEnergy","actionRepair","actionResolveRepairTarget","actionMoveToFocus"],
  
  "harvestTruck": ["actionUnload","actionHarvestCollection"],
  "resupplyBuildings":["actionDistributeToBuildings","actionFetchFromStorage"],
  "stockpile":["actionCollectRemote","actionFillStorage"],
  "resupplyWorkers":["actionFetchFromStorage","actionDistributeToWorkers"],
  "looter" :["actionMigrate","actionFetchRemote", "actionFindDroppedEnergy", "actionFetchDroppedEnergy", "actionUnload"],
  "scavenger" :["actionFindDroppedEnergy", "actionFetchDroppedEnergy", "actionUnload"],

  "scout":["actionMigrate"], //needs a lot of brains for switching roles on the fly between work and move roles

  "reserver":["actionReserve","actionSign"],

  "defender": ["actionDefend","actionHold","actionRecycle"],

  "healer": ["actionHealCreeps","actionHealerMove"],
  "recycler": ["actionRecycle"]
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

  for(var roomName in Game.rooms){
    roomBuildings(Game.rooms[roomName]);
  }

  for(var spawnName in Game.spawns){
    spawnLogic(Game.spawns[spawnName]);
  }

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
      console.log("no actions found for " + role);
    }

    var usedCpu = Game.cpu.getUsed();
    if(usedCpu > (Game.cpu.limit)){
      console.log("Quitting creep execution since used cpu time is " + usedCpu + " of " + Game.cpu.limit);
      break;
    }
  }
  lastTick = Game.cpu.getUsed();


}
