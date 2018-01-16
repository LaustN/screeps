var buildWall = function (room, x, y, isRampart) {

  if (x < 1 || x > 48 || y < 1 || y > 48)
    return false; //cannot build on 1 outermost fields in any direction

  if ((x < 2 || x > 47) && (y < 2 || y > 47))
    return false; //cannot build on 2 outermost fields in corners

  var structureLook = room.lookForAt(LOOK_STRUCTURES, x, y);
  if (structureLook.length > 0) {
    if (structureLook.structureType != STRUCTURE_ROAD) { return false; }
    else {
      isRampart = true;
    }
  }
  var terrainLook = room.lookForAt(LOOK_TERRAIN, x, y)[0];
  if (terrainLook == "wall") {
    return false;
  }

  var constructionLook = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
  if (constructionLook.length > 0) {
    return false; //cannot have 2 construction sites on top of each other
  }

  var terrainLook2 = room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true);
  var anyWallNearThisLocation = typeof (_.find(terrainLook2,
    function (terrainObject) {
      return terrainObject.terrain == "wall";
    })) != "undefined";
  if (anyWallNearThisLocation) {
    isRampart = true;
  }


  var position = new RoomPosition(x, y, room.name);

  var creationResult = position.createConstructionSite(isRampart ? STRUCTURE_RAMPART : STRUCTURE_WALL);
  console.log(position + " construction result: " + creationResult);

  var style = {
  }
  if (isRampart) {
    style.fill = "#FF0000";
  }
  room.visual.circle(x, y, style);
  return (creationResult == OK);
};

var buildWalls = function (room, scanStart, scanDirection, wallDirection) {
  var x = scanStart[0];
  var y = scanStart[1];
  var openingFound = false;

  var openingStartX = 0;
  var openingStartY = 0;
  var openingEndX = 0;
  var openingEndY = 0;

  var anythingHasBeenBuild = false;

  for (var iterator = 0; iterator < 50; iterator++) {
    var borderTerrain = room.lookForAt(LOOK_TERRAIN, x, y)[0];
    if (openingFound) {
      if ((borderTerrain == "wall")) {
        openingEndX = x;
        openingEndY = y;
        openingFound = false;

        var innerX = openingStartX;
        var innerY = openingStartY;

        anythingHasBeenBuild |= buildWall(room, innerX - 2 * scanDirection[0] + wallDirection[0], innerY - 2 * scanDirection[1] + wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX - 2 * scanDirection[0] + 2 * wallDirection[0], innerY - 2 * scanDirection[1] + 2 * wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX - scanDirection[0] + 2 * wallDirection[0], innerY - scanDirection[1] + 2 * wallDirection[1], false);

        var middleSectionCount = 0;
        var middleX = Math.floor((openingStartX + openingEndX) / 2);
        var middleY = Math.floor((openingStartY + openingEndY) / 2);

        while (!((innerX == openingEndX) && (innerY == openingEndY))) {

          if ((innerX == middleX) && (innerY == middleY)) {
            middleSectionCount = 2;
          }

          var buildRampart = (middleSectionCount > 0);

          anythingHasBeenBuild |= buildWall(room, innerX + 2 * wallDirection[0], innerY + 2 * wallDirection[1], buildRampart);


          innerX += scanDirection[0];
          innerY += scanDirection[1];
          middleSectionCount--;
        }

        anythingHasBeenBuild |= buildWall(room, innerX + scanDirection[0] + wallDirection[0], innerY + scanDirection[1] + wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX + scanDirection[0] + 2 * wallDirection[0], innerY + scanDirection[1] + 2 * wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX + 2 * wallDirection[0], innerY + 2 * wallDirection[1], false);
      }

    } else {
      if (borderTerrain != "wall") {
        openingStartX = x;
        openingStartY = y;
        openingFound = true;
      }
    }

    x += scanDirection[0];
    y += scanDirection[1];

  }

}

var scanOrders = [
  {
    scanDirection: [1, 0],
    scanStart: [0, 0],
    wallDirection: [0, 1]
  },
  {
    scanDirection: [0, 1],
    scanStart: [49, 0],
    wallDirection: [-1, 0]
  },
  {
    scanDirection: [-1, 0],
    scanStart: [49, 49],
    wallDirection: [0, -1]
  },
  {
    scanDirection: [0, -1],
    scanStart: [0, 49],
    wallDirection: [1, 0]
  },
];

module.exports = function (room) {
  if (!room.controller) { return; }
  if (!room.controller.my) { return; }
  if (room.controller.level < 3) { return; }
  if (_.size(Game.constructionSites) > 50) {
    console.log("roomWalls not adding more construction sites just now");
    return;
  }

  if (room.memory.lastWallCheckTime) {
    console.log("lastWallCheckTime in " + room.name + " is " + room.memory.lastWallCheckTime)
  } else {
    room.memory.lastWallCheckTime = Game.time;
  }

  if (room.memory.wallReliability) {
    console.log("wallReliability in " + room.name + " is " + room.memory.wallReliability)
  } else {
    room.memory.wallReliability = 1;
  }

  if (Game.time > (room.memory.lastWallCheckTime + room.memory.wallReliability)) {
    console.log("checking walls in " + room.name);

    for (var scanOrderIndex in scanOrders) {
      var scanOrder = scanOrders[scanOrderIndex];
      if (buildWalls(room, scanOrder.scanStart, scanOrder.scanDirection, scanOrder.wallDirection)) {
        room.memory.wallReliability = 1;
        console.log("some fortification work done in " + room.name + ", resetting wallReliability");
        return;
      }
    }
    room.memory.wallReliability += 10;
    room.memory.lastWallCheckTime = Game.time;
  }
  else{
    console.log("skipping walls check in " + room.name);
  }
}  