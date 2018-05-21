<template>
    <div id="CesiumToolBarExtend" class="iez-toolbar-right">
     <div class="iez-profile-photo">
       <div class="demo-avatar-badge" @click="showWarning" :title="userinfo.userName">
         <Badge :count="infos"  overflow-count="99">
           <Avatar shape="square" icon="person"  :src="userinfo.userPic" />

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
    }
  },
  computed: {
    // 获取用户信息url
    userApi () {
      return this.$store.getters.getUserInfoUrl
    },
    // 获得的用户信息
    userinfo () {
      return this.$store.getters.getUser
    },
    // 获得的报警信息
    infos () {
      return this.$store.getters.getWarningSize
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
      var vm = this
      var identity = this.$route.query.uid
      if (Cesium.defined(identity)) {
        this.$http.get(this.userApi, {params: { uid: identity }})
          .then(function (res) {
            if (res.data.result === '0') {
              vm.$store.commit('updateUser', res.data.resultMess)
            } else {
              vm.$Message.warn(res.data.resultMess)
              console.warn(res.data.resultMess)
            }
          }).catch(function (err) {
            vm.$Message.error(`获取用户信息失败：${err}`)
            console.error(`获取用户信息失败：${err}`)
          })
      } else {
        this.$Message.info('uid 参数不存在')
        console.error('uid 参数不存在')
      }
    }
  }
}
</script>
<style>
@import '../assets/iez-profie-photo.css';
</style>
