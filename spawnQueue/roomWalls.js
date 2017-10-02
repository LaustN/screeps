var buildWall = function (room, x, y, isRampart) {
  var lookResult = room.lookForAt(LOOK_TERRAIN, x, y)[0];
  console.log(room.name + ":" + x + "," + y + "=" + JSON.stringify(lookResult));
  var style = {
  }
  if(isRampart){
    style.fill="#FF0000";
  }
  room.visual.circle(x,y,style);
  return false; //keep this running like crazy, start returning true once constructions sites might be placed WHEN they are placed
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
      if ((borderTerrain != "plain") || (borderTerrain != "swamp")) {
        openingEndX = x;
        openingEndY = y;
        openingFound = false;

        var innerX = openingStartX;
        var innerY = openingStartY;

        console.log("beginCap start");
        anythingHasBeenBuild |= buildWall(room, innerX - 2 * scanDirection[0] + wallDirection[0], innerY - 2 * scanDirection[1] + wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX - 2 * scanDirection[0] + 2 * wallDirection[0], innerY - 2 * scanDirection[1] + 2 * wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX - scanDirection[0] + 2 * wallDirection[0], innerY - scanDirection[1] + 2 * wallDirection[1], false);
        console.log("beginCap end");

        var middleSectionCount = 0;
        var middleX = Math.floor((openingStartX + openingEndX) / 2);
        var middleY = Math.floor((openingStartY + openingEndY) / 2);

        console.log("center start");
        while (!((innerX == openingEndX) && (innerY == openingEndY))) {
          console.log(innerX + ", " + innerY + ", " + openingEndX + ", " + openingEndY)

          if ((innerX == middleX) && (innerY == middleY)) {
            middleSectionCount = 2;
          }

          var buildRampart = (middleSectionCount > 0);

          anythingHasBeenBuild |= buildWall(room, innerX + 2 * wallDirection[0], innerY + 2 * wallDirection[1], buildRampart);


          innerX += scanDirection[0];
          innerY += scanDirection[1];
          middleSectionCount--;
        }
        console.log("center end");

        console.log("endCap start")
        anythingHasBeenBuild |= buildWall(room, innerX + 2 * scanDirection[0] + wallDirection[0], innerY + 2 * scanDirection[1] + wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX + 2 * scanDirection[0] + 2 * wallDirection[0], innerY + 2 * scanDirection[1] + 2 * wallDirection[1], false);
        anythingHasBeenBuild |= buildWall(room, innerX + scanDirection[0] + 2 * wallDirection[0], innerY + scanDirection[1] + 2 * wallDirection[1], false);
        console.log("endCap end")
      }

    } else {
      if (borderTerrain == "plain" || borderTerrain == "swamp") {
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
    scanStart: [50, 0],
    wallDirection: [-1, 0]
  },
  {
    scanDirection: [-1, 0],
    scanStart: [50, 50],
    wallDirection: [-1, 0]
  },
  {
    scanDirection: [0, -1],
    scanStart: [0, 50],
    wallDirection: [1, 0]
  },
];

module.exports = function (room) {
  if (!room.controller) { return; }
  if (!room.controller.my) { return; }
  if (room.controller.level < 3) { return; }
  if (_.size(Game.constructionSites) > 50) { return; }

  for (var scanOrderIndex in scanOrders) {
    var scanOrder = scanOrders[scanOrderIndex];
    if (buildWalls(room, scanOrder.scanStart, scanOrder.scanDirection, scanOrder.wallDirection)) {
      return true;
    }
  }
}  