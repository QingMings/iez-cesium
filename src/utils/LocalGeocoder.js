/* eslint-disable no-unused-vars */
import Cesium from 'cesium/Cesium'

function LocalGeocoder () {

}
LocalGeocoder.prototype.geocode = function (entityid) {
  console.info(entityid)
  var matcharr = arrGrep(entityid, arr)
  var result = matcharr.map(function (resultObject) {
    return {
      displayName: resultObject.name,
      destination: resultObject.position.getValue(viewer.clock.currentTime)
    }
  })
  var deferred = Cesium.when.defer()
  return deferred.resolve(result)
}
// 搜索
function arrGrep (literalString, targetArr) {
  var matchBin = []
  var oRegex = new RegExp(literalString)
  for (var i = 0; i < targetArr.length; i++) {
    var test = String(targetArr[i].name).search(oRegex)
    if (test > -1) {
      matchBin.push(targetArr[i])
    }
  }
  return matchBin
}
LocalGeocoder.prototype.updateArr = function (vm) {
  arr = vm.entities
  viewer = vm.viewer
}
var viewer
var arr = [
]
export default LocalGeocoder
