var actionEnsureHome = require("actionEnsureHome");
var runTowers = require("runTowers");
var runLinks = require("runLinks");
var roomLogic = require("roomLogic")


var roleActions = {
  "harvester": ["actionSetGivesEnergy", "actionHarvest", "actionDump"],
  "harvestWithReturn": ["actionSetGivesEnergy", "actionHarvest", "actionUnload"],
  "builder": ["actionSetWantsEnergy", "actionBuild"],
  "controlUpgrader": ["actionSetWantsEnergy", "actionUpgradeController"],
  "fortifier": ["actionSetWantsEnergy", "actionFortify"],
  "repairer": ["actionSetWantsEnergy", "actionRepair"],

  "harvestTruck": ["actionSetGivesEnergy", "actionUnload", "actionHarvestCollection"],
  "resupplyBuildings": ["actionSetMovesEnergy", "actionDistributeToBuildings", "actionFetchFromStorage"],
  "stockpile": ["actionSetMovesEnergy", "actionCollectRemote", "actionFillStorage"],
  "resupplyWorkers": ["actionSetMovesEnergy", "actionDistributeToWorkers", "actionFetchFromStorage"],
  "looter": ["actionSetGivesEnergy", "actionMigrate", "actionFetchRemote", "actionFetchDroppedEnergy", "actionUnload"],
  "scavenger": ["actionSetGivesEnergy", "actionFetchDroppedEnergy", "actionUnload"],

  "scout": ["actionMigrate", "actionSign", "actionEnsureWatch"],

  "reserver": ["actionMigrate", "actionReserve", "actionSign"],
  "claimer": ["actionMigrate", "actionClaim", "actionSign", "actionRecycle"],

  "defender": ["actionDefend", "actionMigrate", "actionHold", "actionRecycle"],
  "closeAssaulter": ["actionCloseAssault", "actionRally"],
  "assaulter": ["actionRangedAssault", "actionRally"],
  
  "healer": ["actionHealCreeps", "actionHealerMove", "actionRally"],
  "recycler": ["actionRecycle"],

  "remoteResupplyWorkers": ["actionSetMovesEnergy", "actionMigrate", "actionDistributeToWorkers", "actionFetchFromStorage"],
  "remoteBuilder": ["actionMigrate", "actionSetWantsEnergy", "actionBuild", "actionRepair", "actionFortify", "actionFetchFromStorage", "actionDistributeToBuildings"],
  "remoteHarvester": ["actionMigrate", "actionSetGivesEnergy",  "actionEnsureDropPoint", "actionResolveRemoteSourceFocus", "actionHarvest", "actionDump"],
  "remoteCollector": ["actionSetGivesEnergy", "actionReturnOnFull", "actionUnload", "actionMigrate", "actionResolveRemoteSourceFocus", "actionHarvestCollection"],

  "pausedWorker": ["actionSetGivesEnergy", "actionDistributeToBuildings", "actionHold", "actionRecycle"],
  "pausedMover": ["actionSetGivesEnergy", "actionDistributeToBuildings", "actionHold", "actionRecycle"]
};

var actions = {};
for (var roleName in roleActions) {
  var role = roleActions[roleName];
  for (var i = 0; i < role.length; i++) {
    var actionName = role[i];
    if (typeof (actions[actionName]) == "undefined") {
      actions[actionName] = require(actionName);
    }
  }
}

module.exports.loop = function () {
  var logProfilerData = false;
  Memory.workingLinks = {};
  console.log("============= " + Game.time + " ==============");
  console.log("CPU bucket: " + Game.cpu.bucket);
  var profilingData = {};
  var lastTick = Game.cpu.getUsed();
  profilingData["aStart"] = lastTick;


  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing memory:', name);
    }
  }

  for (var name in Memory.spawns) {
    if (!Game.spawns[name]) {
      delete Memory.spawns[name];
      console.log('Clearing memory:', name);
    }
  }
  for (var name in Memory.rooms) {
    if (!Game.rooms[name]) {
      delete Memory.rooms[name];
      console.log('Clearing memory:', name);
    }
  }
  var lastTime = Game.cpu.getUsed();
  if (logProfilerData)
    console.log("before RoomLogic: " + (lastTime));

  if ((Game.time % 10) == 0) { //roomLogic is way expensive, so only run it occasionally
    console.log("Running rooms logic");
    roomLogic();
    var newTime = Game.cpu.getUsed();
    if (logProfilerData)
      console.log("roomlogic: " + (newTime - lastTime));
    lastTime = newTime
  }

  runTowers();
  var newTime = Game.cpu.getUsed();
  if (logProfilerData)
    console.log("runTowers: " + (newTime - lastTime));
  lastTime = newTime

  runLinks();
  var newTime = Game.cpu.getUsed();
  if (logProfilerData)
    console.log("runLinks: " + (newTime - lastTime));
  lastTime = newTime

  creepLoop:
  for (var creepName in Game.creeps) {
    var creep = Game.creeps[creepName];
    actionEnsureHome(creep);

    var actionsToTake = roleActions[creep.memory.role];
    if (actionsToTake) {
      actionLoop:
      for (var actionName in actionsToTake) {
        var action = actions[actionsToTake[actionName]];
        if (action) {
          var actionResult = action(creep);
          if (actionResult) {
            var newTime = Game.cpu.getUsed();
            if (logProfilerData)
              console.log(creep.name + ": " + actionsToTake[actionName] + " took " + (newTime - lastTime));
            lastTime = newTime
            break actionLoop;
          }
        }
        else {
          console.log("no action called " + actionsToTake[actionName] + " was found for role " + creep.memory.role);
          lastTime = Game.cpu.getUsed();
        }
      }
    }
    else {
      console.log("no actions found for " + creep.name + " in role " + creep.memory.role);
      lastTime = Game.cpu.getUsed();
    }

    if (creep.memory.focus) {
      var focusObject = Game.getObjectById(creep.memory.focus);
      if (focusObject)
        creep.room.visual.line(creep.pos, focusObject.pos);
    }
    lastTime = Game.cpu.getUsed();

    if (Game.cpu.bucket < (5 * Game.cpu.limit)) {
      console.log("Quitting creep execution since cpu bucket is less than 5 times the cpu limit");
      break;
    }
  }
  lastTick = Game.cpu.getUsed();


}
