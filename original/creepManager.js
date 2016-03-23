module.exports = function (spawn) {
    var capacity = spawn.room.energyCapacityAvailable;

    //calculate next body form based on rules + templating
    //calculate how many harvester are needed
    //calculate controller upgrader allowance



    var creepsToMaintain = [
        {
            body: [WORK,MOVE,CARRY],
            name: "Harvest0",
            memory: { role: "harvester"}
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest1",
            memory: { role: "harvester"}
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest2",
            memory: {
                role: "harvester"
            }
        },
        {
            body: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            name: "HarvestTruck1",
            memory: {
                role: "harvestTruck"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest3",
            memory: {
                role: "harvester"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest4",
            memory: {
                role: "harvester"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest5",
            memory: {
                role: "harvester"
            }
        },
        {
            body: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            name: "HarvestTruck2",
            memory: {
                role: "harvestTruck"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest6",
            memory: {
                role: "harvester"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest7",
            memory: {
                role: "harvester",
                harvestNear: "Flag1"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Harvest8",
            memory: {
                role: "harvester",
                harvestNear: "Flag1"
            }
        },
        {
            body: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            name: "HarvestTruck3",
            memory: {
                role: "harvestTruck"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Builder1",
            memory: {
                role: "builder"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "Fortifier1",
            memory: {
                role: "fortifier"
            }
        },
        {
            body: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,MOVE,CARRY],
            name: "ControlUpgrader1",
            memory: {
                role: "controlUpgrader"
            }
        },
        {
            body: [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK],
            name: "Guard1",
            memory: {
                role: "guard"
            }
        },
        {
            body: [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK],
            name: "Guard2",
            memory: {
                role: "guard"
            }
        },
        {
            body: [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK],
            name: "Guard3",
            memory: {
                role: "guard"
            }
        },
        {
            body: [TOUGH,TOUGH,TOUGH,TOUGH,HEAL,HEAL,MOVE,MOVE],
            name: "Healer1",
            memory: {
                role: "guard"
            }
        },
        {
            body: [CARRY,CARRY,MOVE],
            name: "Roadie1",
            memory: {
                role: "roadie"
            }
        },

    ];
    for(var creepNumber in creepsToMaintain){
        var creepDefinition = creepsToMaintain[creepNumber];
        var preExistingCreep =
            spawn.room.find(FIND_MY_CREEPS,
            {filter:
                function(foundCreep){
                    return foundCreep.name == creepDefinition.name;
                }
            });
        if(!preExistingCreep[0]){
            var createMessage = spawn.createCreep(creepDefinition.body,creepDefinition.name,creepDefinition.memory);
            if(createMessage == creepDefinition.name){
                spawn.memory.state = "OK";
                console.log("Respawning " + creepDefinition.name);
            }
            else if(createMessage == ERR_NOT_ENOUGH_RESOURCES){
                spawn.memory.state = "SaveEnergy";
                console.log("Saving up for " + creepDefinition.name);
            }

            return;
        }
        else{
            spawn.memory.state = "OK";
        }

    }

}
