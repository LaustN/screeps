module.exports = function (creep) {
  if (creep.pos.x == 49)
    creep.move(LEFT);
  if (creep.pos.x == 0)
    creep.move(RIGHT);

  if (creep.pos.y == 49)
    creep.move(TOP);
  if (creep.pos.y == 0)
    creep.move(BOTTOM);

  return false;
}