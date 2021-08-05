import Vue from 'vue'
import {getAction} from '@/api/manage'

const enhance = {
  state: {
    enhanceJs: {},
    selectOn: 0,
    menuList: JSON.parse(sessionStorage.getItem('menu')) || []
  },
  mutations: {
    ADD_TABLE_ENHANCE: (state, record) => {
      if (!state.enhanceJs) {
        let obj = {}
        let arr = []
        arr.push({...record})
        obj[record.code] = arr
        state.enhanceJs = obj
      } else {
        if (!state.enhanceJs[record.code]) {
          let arr = []
          arr.push({...record})
          state.enhanceJs[record.code] = arr
        }
        state.enhanceJs[record.code].push({...record})
      }
      let arr = state.enhanceJs[record.code]
      while (arr.length > 16) {
        arr.shift()
      }
      Vue.ls.set('enhance_' + record['code'], arr)
    },
    dsHeadIndex: (state, idx) => {
      state.selectOn = idx
    },
    getMenuList: (state, menus) => {
      state.menuList = menus
      // menus.forEach(item=>{
      //   state.menuList.push(item)
      // })
      window.sessionStorage.setItem('menu', JSON.stringify(state.menuList))
      // state.menuList = menus
    }
  },
  actions: {
    addEhanceRecord({commit}, record) {
      commit('ADD_TABLE_ENHANCE', record)
    },
    setMenuList({commit}, param) {
      return new Promise((resolve, reject) => {
        getAction("/sys/permission/queryBSPermission", param).then(response => {
          // console.log(response)
          const result = response.result
          if (result.length > 0) {
            const list = [];
            result.forEach((value, index) => {
              list.push({
                index: index,
                name: value.bigScreenName,
                url: value.bigScreenUrl
              })
            })
            commit('getMenuList', list)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // setHeadIndex(context,list){
    //   context.commit('getHeadIndex',list)
    // }
  }
}
export default enhance