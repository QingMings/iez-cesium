<template>
    <div id="PanoramaView" class="cd-section">
      <span class="cd-modal-bg" style=""></span>
      <span class="cd-modal-center"></span>
      <a href="#" @click="closeModel"  @keyup.13="closeModel" class="cd-modal-close"></a>
      <div class="cd-modal">
        <iframe :id="frame" style="width:100%;height:100%;overflow:hidden;margin:0" scrolling="no" frameborder="0" :src="frameUrl"></iframe>
      </div>
    </div>
</template>
<script type="text/javascript">
import $ from '../../static/js/jquery-vendor'

export default {
  name: 'PanoramaView',
  data () {
    return {
      frame: 'rightFrame'
    }
  },
  created () {
    console.info('panorama created')
    // 监听showPanorama 方法 此方法由 ToolBar.vue 中的按钮触发,此事件在热部署中会多次执行，解决方案往下看
    // https://www.cnblogs.com/xiaochongchong/p/8127148.html
    this.$root.eventBus.$on('showPanorama', this.showPanorama)
  },
  beforeDestroy () {
    // 防止多次触发
    this.$root.eventBus.$off('showPanorama', this.showPanorama)
  },
  mounted () {
    var vm = this
    $(window).on('resize', function () {
      if ($('.cd-section.modal-is-visible').length > 0) {
        window.requestAnimationFrame(vm.updateLayer)
      }
    })
  },
  computed: {
    frameUrl () {
      return this.$store.getters.getPanoramaUrl
    }
  },
  methods: {
    loadIframe: function () {
      var iframe = document.getElementById(this.frame)
      iframe.src = this.frameUrl
      iframe.onload = function () {
        // console.log("iframe cargado...")
      }
    },
    setframeUrl: function (url) {
      this.$store.commit('updatePanoramaUrl', url)
    },
    showPanorama: function (target) {
      var vm = this
      this.$Message.info('事件调用')
      this.setframeUrl(target)
      this.loadIframe()
      var scaleValue = this.retrieveScale($('.cd-modal-bg'))
      $('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        vm.animateLayer($('.cd-modal-bg'), scaleValue, true)
      })
    },
    retrieveScale: function (btn) {
      var btnRadius = btn.width() / 2
      var left = btn.offset().left + btnRadius
      var top = btn.offset().top + btnRadius - $(window).scrollTop()
      var scale = this.scaleValue(top, left, btnRadius, $(window).height(), $(window).width())
      btn.css('position', 'fixed').velocity({
        top: top - btnRadius,
        left: left - btnRadius,
        translateX: 0
      }, 0)
      return scale
    },
    scaleValue: function (topValue, leftValue, radiusValue, windowW, windowH) {
      var maxDistHor, maxDistVert
      maxDistHor = (leftValue > windowW / 2) ? leftValue : (windowW - leftValue)
      maxDistVert = (topValue > windowH / 2) ? topValue : (windowH - topValue)
      return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue)
    },
    animateLayer: function (layer, scaleVal, bool) {
      layer.velocity({ scale: scaleVal }, 400, function () {
        $('body').toggleClass('overflow-hidden', bool);
        (bool)
          ? layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
          : layer.removeClass('is-visible').removeAttr('style').siblings('[data-type="modal-trigger"]').removeClass('to-circle')
      })
    },
    updateLayer: function () {
      var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg')
      var layerRadius = layer.width() / 2
      var layerTop = layer.siblings('.cd-modal-center').offset().top + layerRadius - $(window).scrollTop()
      var layerLeft = layer.siblings('.cd-modal-center').offset().left + layerRadius
      var scale = this.scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width())

      layer.velocity({
        top: layerTop - layerRadius,
        left: layerLeft - layerRadius,
        scale: scale
      }, 0)
    },
    closeModel: function () {
      var vm = this
      var section = $('.cd-section.modal-is-visible')
      section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        vm.animateLayer(section.find('.cd-modal-bg'), 1, false)
      })
      // if browser doesn't support transitions...
      if (section.parents('.no-csstransitions').length > 0) this.animateLayer(section.find('.cd-modal-bg'), 1, false)
    }
  }
}
</script>
<style>
@import "../assets/iez-pannorama.css";
</style>
