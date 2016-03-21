var rally = require("rally");
module.exports = function(creep){
    var woundedCreeps = creep.room.find(FIND_MY_CREEPS, {filter:
        function(filteredCreep){
            return filteredCreep.hits < filteredCreep.hitsMax;
        }});
    if(woundedCreeps.length>0){
        if(creep.heal(woundedCreeps[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(woundedCreeps[0]);
        }
    }
    else{
        rally(creep);
    }

}
