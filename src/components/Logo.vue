<template>
  <div id="Logo">
    <img src="/static/WechatIMG38.png"/>
  </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style >
#Logo {
  left: 2px;
  bottom: 2px;
  position: absolute;
  z-index: 99;
  padding: 3px 10px;
  font-size: 13px;
  color: #fff;
  text-shadow: 5px 2px 6px #000;
}
#Logo img {
  width: 337px;
}
</style>
