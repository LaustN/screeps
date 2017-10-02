var buildWall = function (room, x, y, isRampart) {
  var terrainLook = room.lookForAt(LOOK_TERRAIN, x, y)[0];
  var structureLook = room.lookForAt(LOOK_STRUCTURE, x, y);
  var constructionLook = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);

  if(terrainLook == "wall"){return false;}
  if(structureLook.length>0){return false;} //TODO: might permit presence of road?


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
    room.visual.text(borderTerrain,x,y);
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
        anythingHasBeenBuild |= buildWall(room, innerX + 2 * wallDirection[0], innerY +  2 * wallDirection[1], false);
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
  if (_.size(Game.constructionSites) > 50) { return; }

  for (var scanOrderIndex in scanOrders) {
    var scanOrder = scanOrders[scanOrderIndex];
    if (buildWalls(room, scanOrder.scanStart, scanOrder.scanDirection, scanOrder.wallDirection)) {
      return true;
    }
  }
}  