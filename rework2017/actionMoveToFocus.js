module.exports = function(creep){
  var focusObject = Game.getObjectById(creep.memory.focus);
  if(focusObject){
    creep.moveTo(focusObject);
    return true;
  }
  return false;
}
  