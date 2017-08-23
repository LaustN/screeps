module.exports = function(bodyParts, maxPrice){
  var remainingCapacity = 300;
  if(maxPrice){
    remainingCapacity = maxPrice;
  }
  var resultingBody  =[];
  while (true) {
    for (var assaultPartsIterator = 0; assaultPartsIterator < bodyParts.length; assaultPartsIterator++) {
      if(remainingCapacity < 50 || resultingBody.length == 50){
        resultingBody.sort(function(a,b){ return BODYPART_COST[a] - BODYPART_COST[b]; });
        return resultingBody;
      }
      var nextPart =  bodyParts[assaultPartsIterator];
      if (priceMap[nextPart] <= remainingCapacity) {
        resultingBody.unshift(nextPart)
        remainingCapacity-=priceMap[nextPart];
      }
    }
  }
}