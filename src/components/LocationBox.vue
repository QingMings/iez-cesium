<template>
    <div id="LocationBox">{{locationInfo}}</div>
</template>

<script>
export default {
  props: ['locationInfo'],
  name: 'LocationBox'
}
</script>

<style scoped>
#LocationBox {
  left: 2px;
  bottom: 2px;
  position: absolute;
  z-index: 99;
  padding: 3px 10px;
  font-size: 13px;
  color: #fff;
  text-shadow: 5px 2px 6px #000;
}
</style>
