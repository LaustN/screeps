module.exports = function (creep) {
  var focus = Game.getObjectById(creep.memory.focus);
  if (focus) {
    var isNextToFocus = focus.pos.isNearTo(creep);
    if (isNextToFocus) {
      var nearbyContainers = focus.pos.findInRange(FIND_STRUCTURES, 2, { filter: { structureType: STRUCTURE_CONTAINER } });
      var nearbyConstructionSites = focus.pos.findInRange(FIND_CONSTRUCTION_SITES, 2);
      if ((nearbyConstructionSites.length > 0) && (creep.carry[RESOURCE_ENERGY] > 0)) {
        creep.build(nearbyConstructionSites[0]);
        return true;
      }
      if (nearbyContainers.length == 0) {
        if ((nearbyContainers.length == 0) && (nearbyConstructionSites.length == 0)) {
          creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
        }
      }
      var containersInNeedOfRepair = _.filter(nearbyContainers, function (container) {
        return (container.hits < container.hitsMax);
      });
      if (containersInNeedOfRepair.length > 0 && (creep.carry[RESOURCE_ENERGY] > 0)) {
        creep.repair(containersInNeedOfRepair[0]);
        return true;
      }
    }
  }

  return false;
}
