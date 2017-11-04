module.exports = function (target, roomObject) {
  if (target) {
    if (target.my)
      return false;

    if (!roomObject)
      return false;

    if (target.pos.roomName != roomObject.pos.roomName)
      return false;

    return true;
  }
  return false;
}
