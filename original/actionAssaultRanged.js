module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){

      if(targetFlag.pos.roomName != creep.pos.roomName){
        return false;
      }
      var target = null;

      var targetStructure = targetFlag.pos.findInRange(FIND_STRUCTURES,0,{filter:function(structure){ if(structure.my){return false;} return true; }});
      if(targetStructure != null && targetStructure.length > 0){
        target = targetStructure[0];
      }

      if(!target) {
        //find a creep to attack
        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      }
      if(!target){
        target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter : function(structure){ return structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_POWER_BANK && structure.structureType != STRUCTURE_KEEPER_LAIR;}});
      }
      if (target) {

        console.log("target found");

        var rangeToTarget = creep.pos.getRangeTo(target);
        creep.say("range to target="+rangeToTarget)
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

              var newPos = new RoomPostion(creep.pos.x + xDirection * lookMultiplier, creep.pos.y + yDirection * lookMultiplier, creep.pos.roomName);
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
        console.log("hostiles:" + JSON.stringify(nearbyHostileCreeps));
        if (nearbyHostileCreeps) {
          if (nearbyHostileCreeps.length>1) {
            creep.rangedMassAttack();
            return;
          }
          if (nearbyHostileCreeps.length=1) {
            creep.rangedAttack(nearbyHostileCreeps[0]);
            return;
          }
        }
        creep.rangedAttack(target);
        return true;
      }
    }
  }

  //getting here means that creep is not busy doing ranged assault
  return false;
}
