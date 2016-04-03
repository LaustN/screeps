module.exports = function(creep){
  if(creep.claimController(creep.room.controller)!= OK){
    creep.moveTo(creep.room.controller);
  }
}
