/* eslint-disable no-unused-vars,one-var */

const IframePost = (function () {
  var setFrame = function (oFrm) {
      if (!oFrm.name || oFrm.name === '') {
        oFrm.name = oFrm.id
      }
    },
    createForm = function (obj) {
      var oForm = document.createElement('form')
      oForm.id = 'forPost'
      oForm.method = 'post'
      // oForm.enctype = 'application/x-www-form-urlencoded'
      oForm.action = obj.Url
      oForm.target = obj.Target.name
      var oIpt, arrParams
      arrParams = obj.PostParams
      for (var tmpName in arrParams) {
        oIpt = document.createElement('input')
        oIpt.type = 'hidden'
        oIpt.name = tmpName
        oIpt.value = arrParams[tmpName]
        oForm.appendChild(oIpt)
      }
      return oForm
    },
    deleteForm = function () {
      var oOldFrm = document.getElementById('forPost')
      if (oOldFrm) {
        document.getElementsByClassName('cd-modal')[0].removeChild(oOldFrm)
      }
    }

  return {
    // 功能：给嵌套的Iframe界面Post值
    // 参数：obj - 传递对象
    //     {Url - 页面地址, Target - Iframe对象, PostParams - Post参数,{ 参数名1 : 值1, 参数名2 : 值2 } }
    // 例：{ Url: "ProjPlan_DcRate_Dept_Main.aspx?YearMonth=2012-01", Target: appIframe, PostParams: { DeptGUID: document.all["txt_DeptGUID"].value} }
    doPost: function (obj) {
      setFrame(obj.Target)
      deleteForm()
      var oForm = createForm(obj)
      document.getElementsByClassName('cd-modal')[0].appendChild(oForm)
      oForm.submit()
      deleteForm()
    }
  }
}())

export default IframePost
