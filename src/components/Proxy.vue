<template>
  <div>{{message}}</div>
</template>

<script>
import Porthole from 'porthole-proxy/lib/porthole.min'

export default {
  name: 'Proxy',
  data () {
    return {
      message: 'hello'
    }
  },
  mounted () {
    Porthole.WindowProxyDispatcher.start()
  }
}
</script>

<style scoped>

</style>
