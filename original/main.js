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

  for(var spawnName in Game.spawns){
    creepManager(Game.spawns[spawnName]);
  }
  runTowers();
  runLinks();

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
  for (var i = 0; i < actionsNames.length; i++) {
    actions[actionsNames[i]] = require(actionsNames[i]);
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
    "assault" : ["actionAssaultDestroyFlaggedLocations", "actionAssaultCreeps", "actionAssaultStructures", "actionAssaultMove"],
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
  for(var creepName in Game.creeps){
    var creep = Game.creeps[creepName];
    ensureHome(creep);

    var actionsToTake = roleActions[creep.memory.role];
    if (actionsToTake) {
      for (var actionName in actionsToTake) {
        var action = actions[actionsToTake[actionName]];
        if (action) {
          var actionResult = action(creep);
          if(actionResult){
            continue;
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
  console.log("Most expensive creep was a " + largestSpenderRole +  " costing " + largestCost + " : " + largestSpenderName );
}
