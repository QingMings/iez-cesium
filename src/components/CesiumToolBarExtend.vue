<template>
    <div id="CesiumToolBarExtend" class="iez-toolbar-right">
     <div class="iez-profile-photo">
       <!--用户头像-->
       <div class="demo-avatar-badge" @click="showLogined" :title="userinfo.userName">
         <Badge   overflow-count="99">
           <Avatar shape="square" icon="person"  :src="userinfo.userPic" />

         </Badge>
       </div>
       <!--<div class="demo-avatar-badge" @click="showLogined" :title="userinfo.userName">-->
         <!--<Badge   overflow-count="99">-->
           <!--<Avatar shape="square" icon="person"  :src="userinfo.userPic" />-->

         <!--</Badge>-->
       <!--</div>-->
       <!--设置按钮-->
       <div class="demo-avatar-badge"  >
       <Dropdown trigger="custom" :visible="visible" placement="bottom-start">
         <!--<Button  title="常用工具" @click="dropDownCustomHandler" class=" ivu-btn-icon-only ">-->
           <!--<Icon type="android-menu"></Icon>-->
         <!--</Button>-->
         <div @click="dropDownCustomHandler" title="设置">
           <Badge   overflow-count="99" >
             <Avatar shape="square" icon="ios-settings-strong"   />

           </Badge>
         </div>
         <DropdownMenu slot="list" class="iez-dropmenu" v-for="(data,index) in settings" v-bind:key="data">
           <DropdownItem :title="data">
             <span>{{data}}</span>  <ISwitch size="small" :name="data" :value="getSetting(index)" :disabled="getSettingStatus(index)"   @on-change="switchChange(data,$event)" ></ISwitch>
           </DropdownItem>
         </DropdownMenu>
       </Dropdown>
       </div>
     </div>

      <div id="loginedContainer" style="display: none;" >
        <!--<div>-->
          <!--<Input  placeholder="检索过滤"  style="width: 150px">-->
          <!--<Button slot="append"  class="ivu-btn ivu-btn-icon-only">-->
            <!--<Icon type="ios-search"></Icon>-->
          <!--</Button>-->
          <!--</Input>-->
        <!--</div>-->
        <div class="login-list">
          <ul v-for="(data,index) in loginedList" v-bind:key="data.userCode">
            <li class="login-item">
              <Avatar shape="square" size="small" icon="person" :src="data.userPic" />
              <span class="login-name">{{data.userName}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

</template>
<script type="text/javascript">
import Badge from '../../node_modules/iview/src/components/badge/badge.vue'
import Avatar from '../../node_modules/iview/src/components/avatar/avatar.vue'
import Cesium from 'cesium/Cesium'
import Dropdown from '../../node_modules/iview/src/components/dropdown/dropdown.vue'
import DropdownMenu from '../../node_modules/iview/src/components/dropdown/dropdown-menu.vue'
import DropdownItem from '../../node_modules/iview/src/components/dropdown/dropdown-item.vue'
import ISwitch from '../../node_modules/iview/src/components/switch/switch.vue'
import Input from '../../node_modules/iview/src/components/input/input.vue'
import Icon from '../../node_modules/iview/src/components/icon/icon.vue'
import $ from '../../static/js/jquery-vendor'
import iutil from '../utils/iviewUtils'
// import Vue from 'vue'
export default {
  components: {
    DropdownItem,
    DropdownMenu,
    Dropdown,
    ISwitch,
    Input,
    Icon,
    Badge,
    Avatar
  },
  name: 'CesiumToolBarExtend',
  created () {
    if (this.loginListTimer) {
      clearTimeout(this.loginListTimer)
    }
    this.loginListAutoRefresh()
  },
  data () {
    return {
      settings: ['热点标注', '分区标注', '建筑标注', '自动巡检'],
      visible: false,
      loginedList: []
    }
  },
  computed: {
    // 获取用户信息url
    userApi () {
      return this.$store.getters.getUserInfoUrl
    },
    getlocationsService () {
      return this.$store.getters.getLocationsUrl
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
    },
    loginListTimer () {
      return this.$store.getters.getLoginListTimer
    },
    buildingLoaded () {
      return this.$store.getters.getBuildingLoadstatus
    },
    regionLoaded () {
      return this.$store.getters.getRegionLoadstatus
    }
  },
  mounted () {
    this.requestUesrInfo()
  },
  methods: {
    // 拉列表自定义关闭
    dropDownCustomHandler: function () {
      this.visible = !this.visible
    },
    // settings 按钮事件
    switchChange: function (data, status) {
      var vm = this
      switch (data) {
        case vm.settings[0]: vm.$store.commit('showHotPoint', status)
          break
        case vm.settings[1]: vm.$store.commit('showGroupMark', status)
          break
        case vm.settings[2]: vm.$store.commit('showBuildMark', status)
          break
        case vm.settings[3]: vm.$store.commit('autoInspection', status)
          break
      }
    },
    // 根据下标获得 setting
    getSetting: function (index) {
      return this.$store.getters.getSettingByIndex(index)
    },
    getSettingStatus: function (index) {
      console.info(!this.$store.getters.getSettingStatusByIndex(index))
      return !this.$store.getters.getSettingStatusByIndex(index)
    },
    showLogined: function () {
      this.$layer.open({
        type: 1,
        title: '登录人员列表',
        shadeClose: false,
        // resize: false,
        offset: 'custom',
        area: ['auto', 'auto'],
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        content: $('#loginedContainer'),
        success: function (index, layero) {
          console.info(index)
          console.info(layero)
        }
      })
    },
    loginListAutoRefresh: function () {
      var vm = this
      vm.$http.get(vm.getlocationsService).then(function (res) {
        if (res.data.result === 0) {
          vm.loginedList = res.data.resultMess
        }
      })

      vm.$store.commit('updateLoginListTimer', setTimeout(() => {
        vm.loginListAutoRefresh()
      }, 5000))
    },
    showWarning: function () {
      var vm = this
      this.$layer.open({
        type: 1,
        title: '仪表报警信息',
        shadeClose: false,
        // resize: false,
        offset: 'custom',
        area: ['auto', 'auto'],
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        content: $('#warnContent'),
        success: function (index, layero) {
          console.info(index)
          console.info(layero)
        }
      })
    },
    hotPointSwitch: function (target) {

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
            if (res.data.result === 0) {
              vm.$store.commit('updateUser', res.data.resultMess)
            } else {
              // vm.$Message.warn(res.data.resultMess)
              console.warn(res.data.resultMess)
            }
          }).catch(function (err) {
            vm.$Message.error(iutil.err(`获取用户信息失败：${err}`))
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
