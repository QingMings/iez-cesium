function IviewUtil () {
}
IviewUtil.err = function (message) {
  return {
    content: message,
    duration: 10,
    closable: true
  }
}
IviewUtil.info = function (message) {
  return {
    content: message,
    duration: 5,
    closable: true
  }
}
export default IviewUtil
