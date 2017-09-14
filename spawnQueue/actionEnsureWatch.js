module.exports = function (creep) {
  if (creep.pos.x == 49)
    creep.move(LEFT);
  if (creep.pos.x == 0)
    creep.move(RIGHT);

  if (creep.pos.y == 49)
    creep.move(UP);
  if (creep.pos.y == 0)
    creep.move(DOWN);

  return false;
}