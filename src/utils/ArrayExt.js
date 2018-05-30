/* eslint-disable no-extend-native */
// 用来获取vuex 中数组中的下标
Array.prototype.myindexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].devCode === val) return i
  }
  return -1
}
Array.prototype.remove = function (val) {
  var index = this.myindexOf(val.devCode)
  if (index > -1) {
    this.splice(index, 1)
  }
}
