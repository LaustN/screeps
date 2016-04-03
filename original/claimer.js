module.exports = function (creep) {
  var actionScout = require("actionScout");
  var actionClaim = require("actionClaim");

  if(actionscout(creep))
    return;
  if(actionClaim(creep))
    return;
}
