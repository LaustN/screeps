var harvester = require("harvester");
var harvestTruck = require("harvestTruck");
var guard = require("guard");
var healer = require("healer");
var builder = require("builder");
var fortifier = require("fortifier");
var controlUpgrader = require("controlUpgrader");
var roadie = require("roadie");
var redistributor = require("redistributor");
var scout = require("scout");
var assault = require("assault");
var claimer = require("claimer");
var remoteTruck = require("remoteTruck");

var creepManager = require("creepManager");
var ensureHome = require("actionEnsureHome");
var runTowers = require("runTowers");

module.exports.loop = function () {
  for(var spawnName in Game.spawns){
    creepManager(Game.spawns[spawnName]);
  }
  runTowers();
  var roleNames = [
    "harvester","harvestTruck","guard","healer","builder","fortifier",
    "controlUpgrader","roadie","redistributor","scout","assault","claimer",
    "remoteTruck"];
  var roles = {};

  for (var i = 0; i < rolenames.length; i++) {
     roles[rolenames[i]] = require(rolenames[i]);
  }



  //remember the idea of making rooms override decisions for creeps in defensive situations and such
  //  JSON.stringify(Game.rooms["W2S25"].find(FIND_MY_CREEPS))

  for(var creepName in Game.creeps){
    var creep = Game.creeps[creepName];
    ensureHome(creep);
    if(creep.memory.role == 'harvester'){
      harvester(creep);
    }
    if(creep.memory.role == 'harvestTruck'){
      harvestTruck(creep);
    }
    if(creep.memory.role == 'builder'){
      builder(creep);
    }
    if(creep.memory.role == 'fortifier'){
      fortifier(creep);
    }
    if(creep.memory.role == 'guard') {
      guard(creep);
    }
    if(creep.memory.role == 'healer') {
      healer(creep);
    }
    if(creep.memory.role == 'controlUpgrader') {
      controlUpgrader(creep);
    }
    if(creep.memory.role == 'roadie') {
      roadie(creep);
    }
    if(creep.memory.role == 'redistributor') {
      redistributor(creep);
    }
    if(creep.memory.role == 'scout') {
      scout(creep);
    }
    if(creep.memory.role == 'assault') {
      assault(creep);
    }
    if(creep.memory.role == 'claimer') {
      claimer(creep);
    }
    if(creep.memory.role == 'remoteTruck') {
      remoteTruck(creep);
    }
  }
}
