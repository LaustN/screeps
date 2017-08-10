module.exports = function (room) {

    var getRoomPositionsAtRange = function(roomPosition, range){
        var result = [];
        for(var i= -range; i<=range;i++){
            result.push(new RoomPosition(roomPosition.y-range,roomPosition.x+i,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.y+range,roomPosition.x+i,roomPosition.roomName));
        }
        for(var i= -(range-1); i<=(range-1);i++){
            result.push(new RoomPosition(roomPosition.y-i,roomPosition.x+range,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.y+i,roomPosition.x-range,roomPosition.roomName));
        }
        return result;
        //Line
        //left + right
        //line
    }
    room.visual.clear();
    var spawns  = room.find(FIND_MY_STRUCTURES, {filter:{ structureType: STRUCTURE_SPAWN}});
    var containers  = room.find(FIND_MY_STRUCTURES, {filter:{ structureType: STRUCTURE_CONTAINER}});
    var storage  = room.storage;

    console.log(JSON.stringify(getRoomPositionsAtRange(room.pos,1)));

    if(!storage && (containers.length == 0)){

    }

    for(var spawnkey in spawns) {
        var spawn  = spawns[spawnkey];
    }
}
