var getRoomPositionsAtRange = function (roomPosition, range, filter) {
    var result = [];
    for (var i = -range; i <= range; i++) {
        result.push(new RoomPosition(roomPosition.x - range, roomPosition.y + i, roomPosition.roomName));
    }
    for (var i = (range - 1); i >= -(range - 1); i--) {
        result.push(new RoomPosition(roomPosition.x - i, roomPosition.y + range, roomPosition.roomName));
    }
    for (var i = range; i >= -range; i--) {
        result.push(new RoomPosition(roomPosition.x + range, roomPosition.y + i, roomPosition.roomName));
    }
    for (var i = (range - 1); i >= -(range - 1); i--) {
        result.push(new RoomPosition(roomPosition.x + i, roomPosition.y - range, roomPosition.roomName));
    }
    if (typeof (filter) != "undefined") {
        return _.filter(result, filter);
    }
    return result;
}

var spacyFilter = function (position) {
    try {
        if ((position.x < 2) || (position.y < 2) || (position.x > 48) || (position.y > 48))
            return false;
        var directions = [];
        directions.push(new RoomPosition(position.x, position.y - 1, position.roomName));
        directions.push(new RoomPosition(position.x, position.y + 1, position.roomName));
        directions.push(new RoomPosition(position.x - 1, position.y, position.roomName));
        directions.push(new RoomPosition(position.x + 1, position.y, position.roomName));

        var myThings = position.look();
        for (var thingIndex in myThings) {
            var myThing = myThings[thingIndex];
            if (myThing
                && (
                    ((myThing.type == LOOK_STRUCTURES) && (myThing.structure.structureType != STRUCTURE_ROAD)) ||
                    myThing.type == LOOK_CONSTRUCTION_SITES ||
                    (myThing.type == LOOK_TERRAIN && myThing.terrain == 'wall')
                )
            ) {
                return false; // this space is blocked
            }
        }


        var positionIsOk = true;
        directions.forEach(function (neighbour) {
            var neighbourIsOk = true;
            var neighbourThings = neighbour.look();
            for (var thingIndex in neighbourThings) {
                var neighbourThing = neighbourThings[thingIndex];
                if (neighbourThing
                    && (
                        (neighbourThing.type == LOOK_STRUCTURES && (neighbourThing[LOOK_STRUCTURES].structureType != STRUCTURE_ROAD)) ||
                        neighbourThing.type == LOOK_CONSTRUCTION_SITES
                    )

                ) {
                    neighbourIsOk = false
                }
            }

            if (!neighbourIsOk) {
                positionIsOk = false;
            }
        });
        return positionIsOk;
    }
    catch (exception) {
        console.log(exception);
        return false;
    }
};

module.exports = function (room) {
    if (!room.controller)
        return;
    if (!room.controller.my)
        return;

    //do not waste ages demolishing ramparts
    var hostileRamparts = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_RAMPART } });
    for(var rampartIndex in hostileRamparts){
        hostileRamparts[rampartIndex].destroy();
    }

    room.visual.clear();
    var spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
    var containers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
    var storage = room.storage;

    //// this commented sections prints the numers of found locations. Might be needed for further debugging later, not right now
    //
    // var positions = getRoomPositionsAtRange(spawns[0].pos,6, spacyFilter );
    // for(var positionIndex in positions){
    //     var position = positions[positionIndex];
    //     room.visual.text(positionIndex,position);
    // }

    if (room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: function (structure) {
            if (structure.structureType == STRUCTURE_WALL)
                return false;
            if (structure.structureType == STRUCTURE_RAMPART)
                return false;
            return true;
        }
    }).length > 0)
        return; //do not autobuild when projects are in scope

    if (spawns.length == 0) { //no spawns == do not autobuild here
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0)
            return;
        var flags = room.find(FIND_FLAGS);
        if (flags.length == 0)
            return;

        if (containers.length == 0) {
            var containerPositions = getRoomPositionsAtRange(flags[0].pos, 2, spacyFilter);
            if (containerPositions.length > 0) {
                containerPositions[0].createConstructionSite(STRUCTURE_CONTAINER);
                return;
            }
        }

        if (typeof (room.controller) != "undefined" && room.controller.my) {
            flags[0].pos.createConstructionSite(STRUCTURE_SPAWN);
            return;
        }

        return;
    }
    else {

        if (typeof (storage) == "undefined" && (containers.length == 0)) {
            var containerPositions = getRoomPositionsAtRange(spawns[0].pos, 2, spacyFilter);
            if (containerPositions.length > 0) {
                containerPositions[0].createConstructionSite(STRUCTURE_CONTAINER);
                return;
            }
        }

        for (var rangeIterator = 3; rangeIterator < 10; rangeIterator++) {
            var extensionPositions = getRoomPositionsAtRange(spawns[0].pos, rangeIterator, spacyFilter);
            for (var extensionPositionIndex in extensionPositions) {
                var buildExtensionResult = extensionPositions[extensionPositionIndex].createConstructionSite(STRUCTURE_EXTENSION);
                if (buildExtensionResult == OK)
                    return;
            }
        }

        for (var rangeIterator = 1; rangeIterator < 3; rangeIterator++) {
            var innerCircle = getRoomPositionsAtRange(spawns[0].pos, rangeIterator, spacyFilter);
            var innerCircleQueue = [STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_SPAWN];
            for (var innerCircleQueueIndex in innerCircleQueue) {
                for (var innerCircleIndex in innerCircle) {
                    var innerCircleResult = innerCircle[innerCircleIndex].createConstructionSite(innerCircleQueue[innerCircleIndex]);
                    if (innerCircleResult == OK)
                        return;
                }
            }
        }
    }
}
