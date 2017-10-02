var buildWall = function (room, x, y, isRampart) {
  var terrainLook = room.lookForAt(LOOK_TERRAIN, x, y)[0];
  var structureLook = room.lookForAt(LOOK_STRUCTURES, x, y);
  var constructionLook = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);

  if (terrainLook == "wall") { return false; }
  if (structureLook.length > 0) {
    if (structureLook.structureType != STRUCTURE_ROAD) { return false; }
    else {
      isRampart = true;
    }
  }
  if (constructionLook.length > 0) {
    return false; //cannot have 2 construction sites on top of each other
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
  return true;
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

  for (var scanOrderIndex in scanOrders) {
    var scanOrder = scanOrders[scanOrderIndex];
    if (buildWalls(room, scanOrder.scanStart, scanOrder.scanDirection, scanOrder.wallDirection)) {
      return true;
    }
  }
  return false;
}  