<template>
  <div id="SoundWarning">
    <audio id="#audio"  muted  autoplay loop>
      <source :src="musicSrc" type="audio/mpeg">
      Your browser does not support the audio tag.
    </audio>
  </div>
</template>

<script>
export default {
  name: 'SoundWarning',
  data () {
    return {
      isPlaying: false
    }
  },
  computed: {
    musicSrc: function () {
      return this.$store.getters.getMusicSrc
    }
  },
  created () {
    this.$root.eventBus.$on('play', this.play)
    // iframe 通信
    this.$root.eventBus.$on('pause', this.stop)
  },
  beforeDestroy () {
  // 防止多次触发
    this.$root.eventBus.$off('play', this.play)
    this.$root.eventBus.$off('pause', this.stop)
  },
  methods: {
    // 播放音乐
    play () {
      var audio = document.querySelector('audio')
      if (!this.isPlaying) {
        audio.play()
        this.isPlaying = true
      }
    },
    // 暂停
    stop () {
      var audio = document.querySelector('#audio')
      if (this.isPlaying) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

}
</script>

<style scoped>

</style>
