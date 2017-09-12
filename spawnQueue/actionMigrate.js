module.exports = function(creep){
  var focusObject = Game.getObjectById(creep.memory.focus)
  if(focusObject){
    if(creep.pos.room != focusObject.room){
      creep.moveTo(focusObject);
      return true;
    }
  }
  else{
    console.log("failed to find focus")
  }
  return false;
}
  