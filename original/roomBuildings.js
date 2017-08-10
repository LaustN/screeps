module.exports = function (room) {

    var getRoomPositionsAtRange = function(roomPosition, range, filter){
        var result = [];
        for(var i= -range; i<=range;i++){
            result.push(new RoomPosition(roomPosition.y-range+1,roomPosition.x+i,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.y+range+1,roomPosition.x+i,roomPosition.roomName));
        }
        // for(var i= -(range-1); i<=(range-1);i++){
        //     result.push(new RoomPosition(roomPosition.y-i,roomPosition.x+range,roomPosition.roomName));
        //     result.push(new RoomPosition(roomPosition.y+i,roomPosition.x-range,roomPosition.roomName));
        // }
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
                console.log(JSON.stringify(directions));

                var myThings = position.look();
                for(var thingIndex in myThings){
                    var myThing = myThings[thingIndex];
                    if(myThing 
                        && (
                            myThing.type == LOOK_STRUCTURES || 
                            myThing.type == LOOK_CONSTRUCTION_SITES ||
                            (myThing.type == LOOK_TERRAIN && myThing.terrain == 'wall')
                        )
                    ){
                        return false; // this space is blocked
                    }
                }


                var positionIsOk = true;
                directions.forEach(function(neighbour){
                    var neighbourIsOk = true;
                    var neighbourThings = neighbour.look();
                    for(var thingIndex in neighbourThings){
                        var neighbourThing = neighbourThings[thingIndex];
                        if(neighbourThing 
                            && (
                                neighbourThing.type == LOOK_STRUCTURES || 
                                neighbourThing.type == LOOK_CONSTRUCTION_SITES                            
                            )

                        ){
                            neighbourIsOk = false
                        }
                    }

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
