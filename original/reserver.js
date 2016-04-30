module.exports = function (creep) {
  var actionScout = require("actionScout");
  var actionReserve = require("actionReserve");

  if(actionScout(creep))
    return;
  if(actionReserve(creep))
    return;
}
