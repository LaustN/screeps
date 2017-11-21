module.exports = function (bodyParts, maxPrice) {
  var remainingCapacity = 300;
  if (maxPrice) {
    remainingCapacity = maxPrice;
  }
  var resultingBody = [];

  var layerPrice = _.reduce(bodyParts, function (collector, bodyPart) {
    return collector + BODYPART_COST[bodyPart];
  }, 0);

  while (true) {
    if (remainingCapacity < layerPrice || resultingBody.length + bodyParts.length > 50) {
      resultingBody.sort(function (a, b) { return BODYPART_COST[a] - BODYPART_COST[b]; });
      return resultingBody;
    }
    for(var nextBodyPartIndex in bodyParts ){
      resultingBody.unshift(bodyParts[nextBodyPartIndex]);
    }
    remainingCapacity -= layerPrice;
  }
}