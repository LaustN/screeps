var harvester = require("harvester");
var harvestTruck = require("harvestTruck");
var guard = require("guard");
var healer = require("healer");
var builder = require("builder");
var fortifier = require("fortifier");
var controlUpgrader = require("controlUpgrader");
var redistributor = require("redistributor");
var scout = require("scout");
var assault = require("assault");
var claimer = require("claimer");
var remoteTruck = require("remoteTruck");

var creepManager = require("creepManager");
var ensureHome = require("actionEnsureHome");
var runTowers = require("runTowers");
var runLinks = require("runLinks");

module.exports.loop = function () {
  Memory.workingLinks = {};
  console.log("============= " + Game.time + " ==============");
  console.log("Loop start ticks spent: " + Game.cpu.getUsed());

  for(var spawnName in Game.spawns){
    creepManager(Game.spawns[spawnName]);
  }
  console.log("After creepManagers : " + Game.cpu.getUsed());
  runTowers();
  console.log("After towers        : " + Game.cpu.getUsed());
  runLinks();
  console.log("After links         : " + Game.cpu.getUsed());

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
  var profilingData = {};
  for (var i = 0; i < actionsNames.length; i++) {
    actions[actionsNames[i]] = require(actionsNames[i]);
    profilingData[actionsNames[i]]=  {callCount:0, totalCost:0.0, maxCost:0.0};
  }

  var roleActions = {
    "harvester": ["actionFlee", "actionScavenge", "actionUnloadEnergy", "actionHarvest"],
    "harvestTruck": ["actionFlee", "actionScavenge", "actionHarvestCollection", "actionUnloadEnergy"],
    "defender": ["actionAttackRanged","actionRecycle"],
    "healer": ["actionHealCreeps","actionHealerMove"],
    "builder": ["actionFlee", "actionScavenge", "actionCollectEnergy", "actionBuild", "actionFortify", "actionUpgradeControl"],
    "fortifier": ["actionFlee", "actionScavenge", "actionCollectEnergy", "actionFortify", "actionBuild", "actionUpgradeControl"],
    "controlUpgrader" : ["actionFlee", "actionScavenge", "actionCollectEnergy", "actionUpgradeControl"],
    "redistributor" : ["actionFlee", "actionScavenge", "actionRedistribute", "actionRedistributeFillStorage"],
    "scout" : ["actionFlee", "actionScout" , "actionRaze", "actionBuild", "actionFortify",  "actionScavenge", "actionHarvest", "actionUpgradeControl", "actionUnloadEnergy", "actionResetScout"],
    "assault" : ["actionAssaultDestroyFlaggedLocation", "actionAssaultCreeps", "actionAssaultStructures", "actionAssaultMove"],
    "assaultRanger" : ["actionAssaultRanged", "actionProximityHealer", "actionAssaultMove"],
    "claimer" : ["actionScout", "actionClaim"],
    "remoteTruck" : ["actionFlee", "actionScavenge", "actionRemoteCollectEnergy", "actionHomeUnloadEnergy"],
    "reserver" : ["actionReserve"],
    "refiller" : ["actionFlee", "actionRedistributeFillStorage", "actionScavenge"]
  }

  //remember the idea of making rooms override decisions for creeps in defensive situations and such
  //  JSON.stringify(Game.rooms["W2S25"].find(FIND_MY_CREEPS))

  console.log("ticklimit is " + Game.cpu.tickLimit);
  var usedCpu = Game.cpu.getUsed();
  var largestSpenderName = "";
  var largestSpenderRole = "";
  var largestCost = 0;


console.log("Ticks spent before creeps: " + Game.cpu.getUsed());
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
  console.log("Largest creep: " + largestSpenderRole +  " costing " + largestCost + " : " + largestSpenderName );
  console.log("Largest total: " + largestTotalCostName);
  console.log("Largets spike: " +largestSpikeCostName);
  console.log("CPU used this tick:" + Game.cpu.getUsed());
  Memory.profilingData = profilingData;

}
