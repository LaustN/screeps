module.exports = function (creep) {

  var existingFocus = Game.getObjectById(creep.memory.focus);
  if (existingFocus && existingFocus.energy > 0) {
    return false; //escape and continue processing
  }

  var targetFullness = 1;

  var noneLikeMeFilter = function (source) {
    var similarCreeps = source.pos.findInRange(FIND_MY_CREEPS, 2, {
      filter: function (similarCreep) {
        if (similarCreep.id == creep.id) {
          return false;
        }
        return (creep.memory.role == similarCreep.memory.role);
      }
    });
    var fullness = source.energy / source.energyCapacity;

    return (similarCreeps.length == 0) && (fullness >= targetFullness);
  }

  var foundSource = creep.pos.findClosestByRange(FIND_SOURCES, { filter: noneLikeMeFilter });

  if (!foundSource) {
    targetFullness = 0.5;
    foundSource = creep.pos.findClosestByRange(FIND_SOURCES, { filter: noneLikeMeFilter });
  }

  if (!foundSource) {
    targetFullness = 0.0;
    foundSource = creep.pos.findClosestByRange(FIND_SOURCES, { filter: noneLikeMeFilter });
  }

  if (!foundSource) {
    foundSource = creep.pos.findClosestByRange(FIND_SOURCES);
  }

  if (foundSource) {
    creep.memory.focus = foundSource.id;
  }

  return false;
}  