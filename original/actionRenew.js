module.exports = function(creep){
  var spawn = Game.getObjectById(creep.memory.home);
  var lifetimeThatTriggersRenew = 100;
  if(creep.pos.roomName != spawn.pos.roomName){
    lifetimeThatTriggersRenew = 200;
  }
  if(creep.ticksToLive < lifetimeThatTriggersRenew || creep.memory.renewing){
    creep.memory.renewing = true;
    var renewMessage = spawn.renewCreep(creep);
    if( renewMessage == OK){
      if(creep.memory.lastTicksToLive){
        if(creep.ticksToLive < creep.memory.lastTicksToLive){
          //flee because we did not actually get renewed
          creep.memory.renewing = false;
        }
      }
      creep.memory.lastTicksToLive = creep.ticksToLive;
      return true;
    }
    if( renewMessage == ERR_NOT_IN_RANGE){
        creep.moveTo(spawn);
        return true;
    }
    else if(renewMessage == ERR_FULL){
        console.log(creep.name + " has been renewed");
        creep.memory.renewing = false;
    }
    else if(renewMessage == ERR_NOT_ENOUGH_RESOURCES){
        console.log(creep.name + " stopped renewing because spawn did not have energy for it");
        creep.memory.renewing = false;
    }
    else{
        return false;
        console.log("renewing did something unexpected:" + renewMessage);
    }

  }
  return false;
}
