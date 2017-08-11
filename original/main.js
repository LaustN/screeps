//var spawnStrategy = require("./spawn/spawnStrategy");

var creepManager = require("creepManager");
var ensureHome = require("actionEnsureHome");
var runTowers = require("runTowers");
var runLinks = require("runLinks");

var roomBuildings = require("roomBuildings")

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
    creepManager(Game.spawns[spawnName]);
  }
  profilingData["bCreepManagers"] = Game.cpu.getUsed() - lastTick;
  lastTick = Game.cpu.getUsed();

  runTowers();
  profilingData["cTowers"] = Game.cpu.getUsed() - lastTick;
  lastTick = Game.cpu.getUsed();
  runLinks();
  profilingData["dLinks"] = Game.cpu.getUsed() - lastTick;
  lastTick = Game.cpu.getUsed();

  var rolenames = [
    "harvester","harvestTruck","guard","defender","healer","builder","fortifier",
    "controlUpgrader","redistributor","scout","assault","assaultRanger","claimer",
    "remoteTruck", "reserver","refiller"];
  var roles = {};

  for (var i = 0; i < rolenames.length; i++) {
    roles[rolenames[i]] = require(rolenames[i]);
  }

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
    "actionEnsureHome",
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
    profilingData[actionsNames[i]]=  {callCount:0, totalCost:0.0, maxCost:0.0};
  }

  var roleActions = {
    "harvester": ["actionFlee", "actionUnloadEnergy", "actionHarvest"],
    "harvestTruck": ["actionFlee", "actionHarvestCollection", "actionUnloadEnergy"],
    "defender": ["actionDefend","actionHold","actionRecycle"],
    "healer": ["actionHealCreeps","actionHealerMove"],
    "builder": ["actionFlee", "actionCollectEnergy", "actionScavenge", "actionBuild", "actionFortify", "actionUpgradeControl"],
    "fortifier": ["actionFlee", "actionCollectEnergy", "actionScavenge", "actionFortify", "actionBuild", "actionUpgradeControl"],
    "controlUpgrader" : ["actionFlee", "actionCollectEnergy", "actionScavenge", "actionUpgradeControl"],
    "redistributor" : ["actionFlee", "actionScavenge", "actionRedistribute", "actionRedistributeFillStorage"],
    "scout" : ["actionFlee", "actionScout" , "actionRaze", "actionBuild", "actionFortify",  "actionScavenge", "actionHarvest", "actionUpgradeControl", "actionUnloadEnergy", "actionResetScout"],
    "assault" : ["actionAssaultDestroyFlaggedLocation", "actionAssaultCreeps", "actionAssaultStructures", "actionAssaultMove"],
    "assaultRanger" : ["actionAssaultRanged", "actionProximityHealer", "actionAssaultMove"],
    "claimer" : ["actionScout", "actionClaim"],
    "remoteTruck" : ["actionFlee", "actionScavenge", "actionRemoteCollectEnergy", "actionHomeUnloadEnergy"],
    "reserver" : ["actionReserve"],
    "refiller" : ["actionFlee", "actionRedistributeFillStorage", "actionScavenge"]
  }
  profilingData["eSetupRoles"] = Game.cpu.getUsed() - lastTick;
  lastTick = Game.cpu.getUsed();

  //remember the idea of making rooms override decisions for creeps in defensive situations and such
  //  JSON.stringify(Game.rooms["W2S25"].find(FIND_MY_CREEPS))

  var usedCpu = Game.cpu.getUsed();
  var largestSpenderName = "";
  var largestSpenderRole = "";
  var largestCost = 0;

  creepLoop:
  for(var creepName in Game.creeps){
    var creep = Game.creeps[creepName];
    ensureHome(creep);

    var actionsToTake = roleActions[creep.memory.role];
    if (actionsToTake) {
      for (var actionName in actionsToTake) {
        var action = actions[actionsToTake[actionName]];
        if (action) {
          var preActionTick = Game.cpu.getUsed();
          var actionResult = action(creep);
          var postActionTick = Game.cpu.getUsed();

          var actionProfile = profilingData[actionsToTake[actionName]];
          actionProfile.callCount++;
          var callCost = (postActionTick - preActionTick);
          actionProfile.totalCost += callCost;
          actionProfile.maxCost = Math.max(callCost, actionProfile.maxCost);
          if(actionResult){
            continue creepLoop;
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

    /*
    var role = roles[creep.memory.role];
    if(role){
      role(creep);
    }
    else {
      console.log("No role called \"" + creep.memory.role + "\" found for " + creep.name);
    }
    */

    var afterCreepUsedCpu = Game.cpu.getUsed();
    var deltaCPU = afterCreepUsedCpu - usedCpu;
    usedCpu = afterCreepUsedCpu;
    if(usedCpu > Game.cpu.tickLimit-2){
      console.log("Quitting creep execution since used cpu time is " + usedCpu + " of " + Game.cpu.tickLimit);
      break;
    }
    if(deltaCPU > largestCost){
      largestSpenderName = creep.name;
      largestCost = deltaCPU;
      largestSpenderRole = creep.memory.role;
    }
  }
  profilingData["fCreeps"] = Game.cpu.getUsed() - lastTick;
  lastTick = Game.cpu.getUsed();

  //console.log( "profiling data:" + JSON.stringify(profilingData));
  var largestTotalCost = 0.0;
  var largestTotalCostName = "";
  var largestTotalCostData = null;
  var largestSpikeCost = 0.0;
  var largestSpikeCostName = "";
  var largestSpikeCostData = null;
  for (var profilePointName in profilingData) {
    if (profilingData[profilePointName].totalCost > largestTotalCost) {
      largestTotalCostName = profilePointName;
      largestTotalCostData = profilingData[profilePointName];
      largestTotalCost = profilingData[profilePointName].totalCost;
    }
    if (profilingData[profilePointName].maxCost > largestSpikeCost) {
      largestSpikeCostName = profilePointName;
      largestSpikeCostData = profilingData[profilePointName];
      largestSpikeCost = profilingData[profilePointName].maxCost;
    }
  }
  profilingData["gSumProfiling"] = Game.cpu.getUsed() - lastTick;
  profilingData["total"] = Game.cpu.getUsed();
  Memory.profilingData = profilingData;

}
