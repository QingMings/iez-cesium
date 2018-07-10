<template>
  <div id="Warn" class="iez-warn-left">
    <div class="iez-warn-photo">
    <!--用户头像-->
    <div class="demo-avatar-badge" @click="showWarning" title="报警">
      <Badge :count="infos"  overflow-count="99" v-show="infos>0">
        <Avatar shape="square" icon="person"  src="static/jingbao.gif" />

      </Badge>
    </div>
    </div>
    <div id="warnContent" style="display: none;">
      <table class="mytable">

        <tr class="header">
          <!--<td>仪表号</td>-->
          <!--<td>报警内容</td>-->
          <!--<td>报警时间</td>-->
          <!--<td>操作</td>-->
          <td>仪表号</td>
          <td>仪表读数</td>
          <td>时间</td>
          <td>操作</td>
        </tr>
        <tr v-for="(item, index) in warnings" :key="index">
          <td>{{item.devCode}}</td>
          <td>{{item.warnContent}}</td>
          <td>{{item.warnTime}}</td>
          <td>
            <a  @click="showWarnPanorama(item.devCode)">查看</a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Badge from '../../node_modules/iview/src/components/badge/badge.vue'
import Avatar from '../../node_modules/iview/src/components/avatar/avatar.vue'
import Cesium from 'cesium/Cesium'
import Icon from '../../node_modules/iview/src/components/icon/icon.vue'
import $ from '../../static/js/jquery-vendor'

export default {
  components: {
    Icon,
    Badge,
    Avatar
  },
  name: 'Warn',
  computed: {
    // 获得的报警信息
    infos () {
      return this.$store.getters.getWarningSize
    },
    warnings () {
      return this.$store.getters.getWarnings
    }
  },
  methods: {
    showWarning: function () {
      var vm = this
      this.$layer.open({
        type: 1,
        // title: '仪表报警信息',
        title: '仪表读数信息',
        shadeClose: false,
        // resize: false,
        // offset: 'custom',
        offset: ['50px', '10px'], // 弹出层初始位置
        area: ['auto', 'auto'],
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        content: $('#warnContent'),
        success: function (index, layero) {
          // console.info(index)
          // console.info(layero)
        }
      })
    },
    // 打开报警全景
    showWarnPanorama: function (target) {
      this.$root.eventBus.$emit('showWarnPanorama', target)
    }
  }
}
</script>

<style >
  @import '../assets/iez-warn.css';
  .mytable  td{
    padding: 0px 13px;
  }
</style>
