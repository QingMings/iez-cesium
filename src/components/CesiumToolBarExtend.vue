<template>
    <div id="CesiumToolBarExtend" class="iez-toolbar-right">
     <div class="iez-profile-photo">
       <div class="demo-avatar-badge" @click="showWarning" :title="userinfo.userName">
         <Badge :count="infos"  overflow-count="99">
           <Avatar shape="square" icon="person"  :src="userinfo.userPic" />

         </Badge>
       </div>
     </div>
      <div id="warnContent" style="display: none;">
        <table class="mytable">

          <tr class="header">
            <td>仪表号</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in warnings" :key="index">
            <td>{{item.devCode}}</td>
            <td>
              <a  @click="showWarnPanorama(item.devCode)">查看</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
</template>
<script type="text/javascript">
import Badge from '../../node_modules/iview/src/components/badge/badge.vue'
import Avatar from '../../node_modules/iview/src/components/avatar/avatar.vue'
import Cesium from 'cesium/Cesium'
import $ from '../../static/js/jquery-vendor'
// import Vue from 'vue'
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
    },
    warnings () {
      return this.$store.getters.getWarnings
    }
  },
  mounted () {
    this.requestUesrInfo()
  },
  methods: {
    showWarning: function () {
      var vm = this
      this.$layer.open({
        type: 1,
        title: '仪表报警信息',
        shadeClose: false,
        resize: false,
        offset: 'custom',
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        content: $('#warnContent'),
        success: function (index, layero) {
          console.info(index)
          console.info(layero)
        }
      })
    },
    // 打开报警全景
    showWarnPanorama: function (target) {
      this.$root.eventBus.$emit('showWarnPanorama', target)
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
.mytable  td{
  padding: 0px 13px;
}
</style>
