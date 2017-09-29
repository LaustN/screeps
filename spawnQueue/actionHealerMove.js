module.exports = function (creep) {

  var target = resolveAssaultTarget(creep);
  if (target && ( creep.pos.getRangeTo(target) > 5)) {
    creep.moveTo(target);
    return true;
  }

  return false;
}
