<template>
    <div id="PanoramaView" class="cd-section">
      <span class="cd-modal-bg" style=""></span>
      <span class="cd-modal-center"></span>
      <a href="#" @click="closeModel"  @keyup.13="closeModel" class="cd-modal-close"></a>
      <div class="cd-modal">
        <iframe :id="frame" name="rightFrame" ref="rightFrame" style="width:100%;height:100%;overflow:hidden;margin:0" scrolling="no" frameborder="0" ></iframe>
      </div>
    </div>
</template>
<script type="text/javascript">
import $ from '../../static/js/jquery-vendor'
import IFramePost from '../utils/IframePost'
import Porthole from 'porthole-proxy/lib/porthole.min'

export default {
  name: 'PanoramaView',
  data () {
    return {
      frame: 'rightFrame',
      windowProxy: undefined
    }
  },
  created () {
    console.info('panorama created')
    // 监听showPanorama 方法 此方法由 ToolBar.vue 中的按钮触发,此事件在热部署中会多次执行，解决方案往下看
    // https://www.cnblogs.com/xiaochongchong/p/8127148.html
    this.$root.eventBus.$on('showPanorama', this.showPanorama)
    this.$root.eventBus.$on('message', this.message)
  },
  beforeDestroy () {
    // 防止多次触发
    this.$root.eventBus.$off('showPanorama', this.showPanorama)
    this.$root.eventBus.$off('message', this.message)
  },
  mounted () {
    var vm = this
    $(window).on('resize', function () {
      if ($('.cd-section.modal-is-visible').length > 0) {
        window.requestAnimationFrame(vm.updateLayer)
      }
    })
    vm.windowProxy = new Porthole.WindowProxy(
      'http://' + location.host + '/360hot/proxy.html', 'rightFrame')
    // porthole 消息接收函数，直接用vue 函数会报错，不知道为啥子
    vm.windowProxy.addEventListener(function (messageEvent) {
      vm.onMessage(messageEvent)
    })
  },
  computed: {
    framePostUrl () {
      return this.$store.getters.getPanoramaPostUrl
    },
    postParams () {
      return this.$store.getters.getPanoramaPostParams
    },
    localtionReportService () {
      return this.$store.getters.getlocaltionReportUrl
    }
  },
  methods: {
    onMessage: function (messageEvent) {
      var vm = this
      if (messageEvent.data['action'] === 'updatePanoramaParams') {
        // 更新全景参数 用于全景内跳转点的位置上报
        vm.setframeParam(messageEvent.data['data'])
        vm.localtionReport()
      }
    },
    message: function (target) {
      this.$Message.info('message 调用')
      this.windowProxy.post({'action': 'supersizeme'})
    },
    // 加载frame
    loadIframe: function () {
      var vm = this
      // 上报 用户当前场景信息
      vm.localtionReport()
      // 打开全景
      IFramePost.doPost({
        Url: vm.framePostUrl,
        Target: vm.$refs.rightFrame,
        PostParams: vm.postParams
      })
    },
    // 上报 用户当前场景信息
    localtionReport: function () {
      var vm = this
      // 上报 用户当前场景信息
      vm.$http.post(vm.localtionReportService, {data: vm.postParams})
        .then(function () {
        }).catch(function (error) {
          // vm.$Message.warn(`上报用户位置信息出错${error}`)
          console.info(`上报用户位置信息出错${error}`)
        })
    },
    // 设置 post参数
    setframeParam: function (params) {
      this.$store.commit('updatePanoramaParams', params)
    },
    // 显示全景
    showPanorama: function (target) {
      var vm = this
      this.$Message.info('事件调用')
      this.setframeParam(target)
      this.loadIframe()
      var scaleValue = this.retrieveScale($('.cd-modal-bg'))
      $('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        vm.animateLayer($('.cd-modal-bg'), scaleValue, true)
      })
    },
    // 动画缩放效果
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
    // 动画缩放效果
    scaleValue: function (topValue, leftValue, radiusValue, windowW, windowH) {
      var maxDistHor, maxDistVert
      maxDistHor = (leftValue > windowW / 2) ? leftValue : (windowW - leftValue)
      maxDistVert = (topValue > windowH / 2) ? topValue : (windowH - topValue)
      return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue)
    },
    // 动画缩放效果
    animateLayer: function (layer, scaleVal, bool) {
      layer.velocity({ scale: scaleVal }, 400, function () {
        $('body').toggleClass('overflow-hidden', bool);
        (bool)
          ? layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
          : layer.removeClass('is-visible').removeAttr('style').siblings('[data-type="modal-trigger"]').removeClass('to-circle')
      })
    },
    // 动画缩放效果
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
    // 关闭全景显示
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
