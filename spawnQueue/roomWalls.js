var buildWalls = function (room, scanStart, scanDirection, wallDirection) {
  var x = scanStart[0];
  var y = scanStart[1];
  var openingFound = false;

  var openingStartX = 0;
  var openingStartY = 0;
  var openingEndX = 0;
  var openingEndY = 0;

  for (var iterator = 0; iterator < 50; iterator++) {
    var borderTerrain = room.lookForAt(LOOK_TERRAIN, x, y)
    if (openingFound) {
      if(borderTerrain != "plain" || borderTerrain != "swamp" ){
        openingEndX = x;
        openingEndY = y;
        openingFound = false;

        //TODO: begin cap by -2scan + wallDirection, -2scan + 2wallDirection, -scan + 2wallDirection
        
        //TODO: center of wall is rampart 

        //TODO: plain wall
        
        //TODO: end cap mimics begin cap

      }        
      
    } else {
      if(borderTerrain == "plain" || borderTerrain == "swamp" ){
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


  for (var scanOrderIndex in scanOrders) {
    var scanOrder = scanOrders[scanOrderIndex];
    if (buildWalls(room, scanOrder.scanDirection, scanOrder.scanStart, scanOrder.wallDirection)) {
      return;
    }
  }
}  