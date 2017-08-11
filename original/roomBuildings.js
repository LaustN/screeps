module.exports = function (room) {
    if(room.find(FIND_MY_CONSTRUCTION_SITES).length>0)
        return; //do not autobuild when projects are in scope

    var getRoomPositionsAtRange = function(roomPosition, range, filter){
        var result = [];
        for(var i= -range; i<=range;i++){
            result.push(new RoomPosition(roomPosition.x-range,roomPosition.y+i,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.x+range,roomPosition.y+i,roomPosition.roomName));
        }
        for(var i= -(range-1); i<=(range-1);i++){
            result.push(new RoomPosition(roomPosition.x-i,roomPosition.y+range,roomPosition.roomName));
            result.push(new RoomPosition(roomPosition.x+i,roomPosition.y-range,roomPosition.roomName));
        }
        if(typeof(filter) != "undefined") {
            return _.filter(result,filter);
        }
        return result;
    }

    var spacyFilter = function(position){
        var directions = [];
        directions.push(new RoomPosition(position.x, position.y-1, position.roomName));
        directions.push(new RoomPosition(position.x, position.y+1, position.roomName));
        directions.push(new RoomPosition(position.x-1, position.y, position.roomName));
        directions.push(new RoomPosition(position.x+1, position.y, position.roomName));

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
    };

    room.visual.clear();
    var spawns  = room.find(FIND_MY_STRUCTURES, {filter:{ structureType: STRUCTURE_SPAWN}});
    var containers  = room.find(FIND_STRUCTURES, {filter:{ structureType: STRUCTURE_CONTAINER}});
    var storage  = room.storage;

    var positions = getRoomPositionsAtRange(spawns[0].pos,6, spacyFilter );
    for(var positionIndex in positions){
        var position = positions[positionIndex];
        room.visual.text(positionIndex,position);
    }

    if(typeof(storage) == "undefined" && (containers.length == 0)){
        console.log("No containers in " + room.name );
        var containerPositions = getRoomPositionsAtRange(spawns[0].pos,2, spacyFilter );
        if(containerPositions.length>0){
            containerPositions[0].createConstructionSite(STRUCTURE_CONTAINER);
            return;
        }
    }

    for(var rangeIterator = 3; rangeIterator < 10; rangeIterator++){
        var extensionPositions = getRoomPositionsAtRange(spawns[0].pos, rangeIterator, spacyFilter );
        for (var extensionPositionIndex in extensionPositions){
            var buildExtensionResult = extensionPositions[extensionPositionIndex].createConstructionSite(STRUCTURE_EXTENSION);
            if(buildExtensionResult == OK)
                return;
        }
    }
}
