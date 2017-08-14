module.exports = function(creep){
    if(!creep.memory.home){
        var homes = creep.room.find(FIND_MY_SPAWNS);
        if(homes.length>0){
            creep.memory.home = homes[0].id;
        }
        else{
            creep.memory.home = creep.id;
            console.log(creep.name + " failed to find a home");
        }
    }
}
