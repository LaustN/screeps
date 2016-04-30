module.exports = function(creep){
  if(creep.reserveController(creep.room.controller)!= OK){
    creep.moveTo(creep.room.controller);
  }
}
