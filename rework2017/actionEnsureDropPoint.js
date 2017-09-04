module.exports = function (creep) {
  var focus = Game.getObjectById(creep.memory.focus);
  if (focus) {
    var isNextToFocus = focus.pos.isNearTo(creep);
    if (isNextToFocus) {
      var nearbyContainers = focus.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTAINER } });
      if (nearbyContainers.length == 0) {
        var nearbyConstructionSites = focus.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);

        if (nearbyConstructionSites.length > 0 && creep.carry[RESOURCE_ENERGY] > 0) {
          creep.build(nearbyConstructionSites[0]);
          return true;
        }

        if (nearbyContainers.length == 0) {
          creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
        }
      }
    }
  }
}
