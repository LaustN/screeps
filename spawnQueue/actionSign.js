module.exports = function(creep){
  var sign ="(╯°□°）╯︵ ┻━┻";
  if(creep.room.controller && (creep.room.controller.sign.text != sign)){
    if(creep.pos.isNearTo(creep.room.controller)){
      creep.signController(creep.room.controller,sign);
    }
    else{
      creep.moveTo(creep.room.controller);
    }
    return true;
  }
  return false;  
}
  