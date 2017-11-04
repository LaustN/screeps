module.exports = function (creep) {
  var flag = Game.flags[creep.memory.flag];
  if (flag) {
    return true;
  }
  return false;
}
