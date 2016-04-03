module.exports = function (creep) {
  var actionScout = require("actionScout");
  var actionClaim = require("actionClaim");

  if(actionScout(creep))
    return;
  if(actionClaim(creep))
    return;
}
