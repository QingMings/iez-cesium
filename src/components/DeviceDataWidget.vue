<template>
<div id="DeviceDataWidget" >

</div>
</template>

<script>
export default {
  props: ['url', 'regionName', 'show', 'clickShow'],
  name: 'DeviceDataWidget',
  computed: {
    autolayerIndex: function () {
      return this.$store.getters.getAutoLayerIndex
    },
    clicklayerIndex: function () {
      return this.$store.getters.getClickLayerIndex
    }
  },
  watch: {
    show: function (val, oldval) {
      this.showLayer(val)
    },
    clickShow: function (val, oldval) {
      this.showLayerClick(val)
    },
    url: function (val, oldval) {
      this.iframeSrc(val)
    },
    regionName: function (val, oldval) {
      this.iframeTitle(val)
    }
  },
  methods: {
    showLayer: function (isShow) {
      if (isShow) {
        this.showData()
      } else {
        if (this.autolayerIndex !== undefined) {
          this.$layer.close(this.autolayerIndex)
          // this.$layer.closeAll('iframe')
          // console.info('closeALl')
        }
      }
    },
    showLayerClick: function (isShow) {
      if (isShow) {
        this.showData2()
      } else {
        if (this.clicklayerIndex !== undefined) {
          this.$layer.close(this.clicklayerIndex)
          // this.$layer.closeAll('iframe')
          // console.info('closeALl')
        }
      }
    },
    // 更新 URL
    iframeSrc: function (url) {
      this.$layer.iframeSrc(this.$layer.index, url)
    },
    iframeTitle: function (title) {
      this.$layer.title(`设备巡检 - ${title}`, this.$layer.index)
    },
    showData: function () {
      var vm = this
      this.$layer.open({
        type: 2,
        title: `设备巡检 - ${vm.regionName}`,
        shadeClose: false,
        // resize: false,
        zIndex: 90,
        closeBtn: 0,
        offset: ['150px', '10px'], // 弹出层初始位置
        area: ['auto', 'auto'],
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        content: [vm.url, 'no'],
        success: function (layero, index) {
          // vm.layerIndex = layero
          vm.$store.commit('updateAutoLayerIndex', index)
          // console.info('Open ')
        }
      })
    },
    showData2: function () {
      var vm = this
      this.$layer.open({
        type: 2,
        title: `设备巡检 - ${vm.regionName}`,
        shadeClose: false,
        // resize: false,
        zIndex: 90,
        closeBtn: 0,
        offset: ['150px', '10px'], // 弹出层初始位置
        area: ['auto', 'auto'],
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        content: [vm.url, 'no'],
        success: function (layero, index) {
          // vm.layerIndex = layero
          vm.$store.commit('updateClickLayerIndex', index)
          vm.$layer.iframeAuto(index)
          // console.info('Open ')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
