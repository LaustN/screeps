module.exports = function (creep) {
  var actionProximityHealer = require("actionProximityHealer");
  var actionAssaultRanged = require("actionAssaultRanged");
  var actionAssaultMove = require("actionAssaultMove");

  actionProximityHealer(creep); //never returns false;
  if(actionAssaultRanged(creep))
    return;
  if(actionAssaultMove(creep))
    return;
}
