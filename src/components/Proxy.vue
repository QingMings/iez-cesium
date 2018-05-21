<template>
  <div>{{message}}</div>
</template>

<script>
import Porthole from 'porthole-proxy/lib/porthole.min'
// 监听全景传来的消息，这里是代理页面
export default {
  name: 'Proxy',
  data () {
    return {
      message: 'proxy page'
    }
  },
  mounted () {
    Porthole.WindowProxyDispatcher.start()
  }
}
</script>

<style scoped>

</style>
