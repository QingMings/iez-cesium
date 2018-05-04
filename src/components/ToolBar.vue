<template>
  <div id="ToolBar.vue" class="iez-toolbar">
   <div class="iez-buttons">
     <Button shape="circle" @click="layerManagerTrigger"  title="图层管理" class="  ivu-btn-circle ivu-btn-icon-only iez-toolbar-btn">
       <Icon type="ios-settings-strong"></Icon>
     </Button>
    <Button shape="circle" title="工具" @click="toolsTrigger" class="ivu-btn-circle ivu-btn-icon-only iez-toolbar-btn">
      <Icon type="android-menu"></Icon>
    </Button>
     <Dropdown trigger="custom" :visible="visible" placement="bottom-start">
       <Button shape="circle" title="常用工具" @click="dropDownCustomHandler" class="ivu-btn-circle ivu-btn-icon-only iez-toolbar-btn">
         <Icon type="android-menu"></Icon>
       </Button>
       <DropdownMenu slot="list" class="iez-dropmenu" v-for="data in test" v-bind:key="data">
         <DropdownItem>{{data}}</DropdownItem>
         <!--<DropdownItem>炸酱面</DropdownItem>-->
         <!--<DropdownItem>豆汁儿</DropdownItem>-->
         <!--<DropdownItem>冰糖葫芦</DropdownItem>-->
         <!--<DropdownItem>北京烤鸭</DropdownItem>-->
       </DropdownMenu>
     </Dropdown>
     <Button shape="circle" title="全景" @click="panorama"  class="ivu-btn-circle ivu-btn-icon-only iez-toolbar-btn" >
       <Icon type="ios-eye-outline"></Icon>
     </Button>
   </div>
  </div>
</template>
<script type="text/javascript">
import Button from '../../node_modules/iview/src/components/button/button.vue'
import Icon from '../../node_modules/iview/src/components/icon/icon.vue'
import Dropdown from '../../node_modules/iview/src/components/dropdown/dropdown.vue'
import DropdownMenu from '../../node_modules/iview/src/components/dropdown/dropdown-menu.vue'
import DropdownItem from '../../node_modules/iview/src/components/dropdown/dropdown-item.vue'

export default {
  components: {
    DropdownItem,
    DropdownMenu,
    Dropdown,
    Icon,
    Button
  },
  name: 'ToolBar',
  data () {
    return {
      test: ['标绘', '测量', '盒子'],
      visible: false
    }
  },
  methods: {
    layerManagerTrigger: function () {
      var vm = this
      this.$Message.info('图层管理')
      this.$layer.open({
        title: '图层管理',
        content: '<div>图层管理</div>',
        shadeClose: false, // 关闭点击遮罩关闭弹出层
        offset: ['50px', '10px'], // 弹出层初始位置
        shade: 0, // 关闭遮罩
        btn: [], // 不显示按钮
        success: function (index, layero) {

        }
      })
    },
    toolsTrigger: function () {
      this.$Message.info('常用工具')
    },
    // 拉列表自定义关闭
    dropDownCustomHandler: function () {
      this.visible = !this.visible
    },
    panorama: function (event) {
      this.$root.eventBus.$emit('showPanorama', event.target)
    }
  }
}
</script>
<style>
@import "../assets/iez-toolbar.css";
</style>
