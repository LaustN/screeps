module.exports = function (creep) {
  var actionProximityHealer = require("actionProximityHealer");
  var actionAssaultRanged = require("actionAssaultRanged");
  var actionAssaultMove = require("actionAssaultMove");

  if(actionAssaultRanged(creep))
    return;
  if (actionProximityHealer(creep))
    return; 
  if(actionAssaultMove(creep))
    return;
}
