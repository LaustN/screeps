module.exports = function (room) {

    var getRoomPositionsAtRange = function(roomPosition, range, filter){
        var result = [];
        for(var i= -range; i<=range;i++){
            result.push(new RoomPosition(roomPosition.y-range,roomPosition.x+i,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.y+range,roomPosition.x+i,roomPosition.roomName));
        }
        for(var i= -(range-1); i<=(range-1);i++){
            result.push(new RoomPosition(roomPosition.y-i,roomPosition.x+range,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.y+i,roomPosition.x-range,roomPosition.roomName));
        }
        if(typeof(filter) != "undefined") {
            return _.filter(result,filter);
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

    var positions = getRoomPositionsAtRange(spawns[0].pos,6, function(position){
                var directions = [];
                directions.push(new RoomPosition(position.x, position.y-1, position.roomName));
                directions.push(new RoomPosition(position.x, position.y+1, position.roomName));
                directions.push(new RoomPosition(position.x-1, position.y, position.roomName));
                directions.push(new RoomPosition(position.x+1, position.y, position.roomName));

                var positionIsOk = true;
                directions.forEach(function(neighbour){
                    var neighbourIsOk = true;
                    neighbour.look.forEach(function(lookObject){
                        if(lookObject.type == "structure"){ //also try with "terrain"
                        console.log("failing because of " + JSON.stringify(lookObject));
                            neighbourIsOk = false;
                        }
                    });
                    if(!neighbourIsOk){
                        positionIsOk = false;
                    }
                });
                return positionIsOk;
            }
        );
    for(var positionIndex in positions){
        var position = positions[positionIndex];
        room.visual.text(positionIndex,position);
    }

    if(!storage && (containers.length == 0)){

    }

    for(var spawnkey in spawns) {
        var spawn  = spawns[spawnkey];
    }
}
