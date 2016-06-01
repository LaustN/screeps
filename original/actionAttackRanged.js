module.exports = function(creep, target){
  if(!target) {
    //find a creep to attack
    target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  }
  if (target) {
    if(target.pos.roomName != creep.pos.roomName){
      creep.moveTo(target);
      return true;
    }

    var rangeToTarget = creep.pos.getRangeTo(target);
    if (rangeToTarget>3) {
      creep.moveTo(target);
    }
    if (rangeToTarget<3) {
      //look for a good spot 3 times the distance away
      var lookMultiplier = 3;
      var vectorXfromTarget = (creep.pos.x > target.pos.x) ? 1 : ((creep.pos.x < target.pos.x) ? -1 : 0) ;
      var vectorYfromTarget = (creep.pos.y > target.pos.y) ? 1 : ((creep.pos.y < target.pos.y) ? -1 : 0) ;

      var bestPosition = creep.pos;
      var terrainQualityAtBestPos = 0;
      var directnessAwayAtBestPos = 5;

      for(var deltaX = -2 ; deltaX <=2; deltaX ++){
        var xDirection = deltaX + vectorXfromTarget;
        if (Math.abs(xDirection)>1) {
          continue;
        }
        for(var deltaY = -2 ; deltaY <=2; deltaY ++){
          var yDirection = deltaY + vectorYfromTarget;
          if (Math.abs(yDirection)>1) {
            continue;
          }

          var newPos = new RoomPosition(creep.pos.x + xDirection * lookMultiplier, creep.pos.y + yDirection * lookMultiplier, creep.pos.roomName);
          var terrainAtNewPos = newPos.lookFor(LOOK_TERRAIN);
          var terrainQualityAtNewPos = terrainAtNewPos == "plain"? 0 : terrainAtNewPos == "swamp" ? 1 : 10;
          var directnessAwayAtNewPos = Math.abs(deltaX) + Math.abs(deltaX);

          if(terrainQualityAtNewPos + directnessAwayAtNewPos < terrainQualityAtBestPos + directnessAwayAtBestPos)
          {
            bestPosition = newPos;
            terrainQualityAtBestPos = terrainQualityAtNewPos;
            directnessAwayAtBestPos = directnessAwayAtNewPos
          }
        }
      }
      creep.moveTo(bestPosition);
    }

    var nearbyHostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
    var attackMessage = null;
    if (nearbyHostileCreeps) {
      if (nearbyHostileCreeps.length>1) {
        attackMessage = creep.rangedMassAttack();
        return true;
      }
      if (nearbyHostileCreeps.length=1) {
        attackMessage = creep.rangedAttack(nearbyHostileCreeps[0]);
        return true;
      }
    }
    attackMessage = creep.rangedAttack(target);
    return true;
  }
  return false;
}
