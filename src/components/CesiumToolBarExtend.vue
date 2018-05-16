<template>
    <div id="CesiumToolBarExtend" class="iez-toolbar-right">
     <div class="iez-profile-photo">
       <div class="demo-avatar-badge" @click="showWarning">
         <Badge :count="infos"  overflow-count="99">
           <Avatar shape="square" icon="person"  :src="profilePhotoSrc" />

         </Badge>
       </div>
     </div>
    </div>
</template>
<script type="text/javascript">
import Badge from '../../node_modules/iview/src/components/badge/badge.vue'
import Avatar from '../../node_modules/iview/src/components/avatar/avatar.vue'
import Cesium from 'cesium/Cesium'

export default {
  components: {
    Badge,
    Avatar
  },
  name: 'CesiumToolBarExtend',
  data () {
    return {
      infos: 0, // 消息数量
      profilePhotoSrc: 'https://i.loli.net/2017/08/21/599a521472424.jpg' // 头像信息
    }
  },
  mounted () {
    this.requestUesrInfo()
  },
  methods: {
    showWarning: function () {
      this.infos = 100
      console.info(this.infos)
    },
    // 请求用户信息
    requestUesrInfo: function (target) {
      var identity = this.$route.query.uid
      if (Cesium.defined(identity)) {
        this.$Message.info(identity)
      } else {
        this.$Message.info('uid not exists')
      }
    }
  }
}
</script>
<style>
@import '../assets/iez-profie-photo.css';
</style>
