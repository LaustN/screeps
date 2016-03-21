//Just pushing a comment

var harvester = require("harvester");
var guard = require("guard");
var healer = require("healer");
var builder = require("builder");
var fortifier = require("fortifier");
var controlUpgrader = require("controlUpgrader");
var roadie = require("roadie");

var creepManager = require("creepManager");
var ensureHome = require("actionEnsureHome");
var runTowers = require("runTowers");

module.exports.loop = function () {
    creepManager(Game.spawns.Spawn1);
    runTowers();

    for(var creepName in Game.creeps){
        var creep = Game.creeps[creepName];
        ensureHome(creep);
        if(creep.memory.role == 'harvester'){
            harvester(creep);
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
    }
}
