<template>
    <div id="cesiumContainer">
      <tool-bar></tool-bar>
      <panorama-view></panorama-view>
    </div>

</template>
<script type="text/javascript">
import ToolBar from './ToolBar.vue'
import PanoramaView from './PanoramaView.vue'

export default {
  components: {
    PanoramaView,
    ToolBar},
  name: 'cesiumViewer'
}
</script>
<style>

</style>
