import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import Vue from 'vue'
import {UI_CACHE_DB_DICT_DATA } from "@/store/mutation-types"
import store from '@/store'

//角色管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
const queryall = (params)=>getAction("/sys/role/queryall",params);

//用户管理
const addUser = (params)=>postAction("/sys/user/add",params);
const editUser = (params)=>putAction("/sys/user/edit",params);
const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const getUserList = (params)=>getAction("/sys/user/list",params);
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);
//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/sys/user/checkOnlyUser",params);
//改变密码
const changePassword = (params)=>putAction("/sys/user/changePassword",params);
//权限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
const getSystemMenuList = (params)=>getAction("/sys/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/sys/permission/getSystemSubmenu",params);
const getSystemSubmenuBatch = (params) => getAction('/sys/permission/getSystemSubmenuBatch', params)

const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
const queryPermissionsByUser = ()=>getAction("/sys/permission/getUserPermissionByToken");
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

// 目录树
const documenTreeList = (params)=>getAction("/sys/archivesTree/queryTreeList?relTenantIds="+store.state.user.info.relTenantIds+"&depId="+store.state.user.info.departIds,params);
const documenByDepartId   = (params)=>deleteAction("/sys/archivesTree/delete",params);
// 保存部门id
const documencertigier   = (params)=>postAction("/sys/archivesTreeDepart/save",params);

// 获取已勾选的部门id
const documencertigierID  = (params)=>getAction("/sys/archivesTreeDepart/list",params);

// 生产记录的查询
const productionSearch  = (params)=>getAction("/beamyard/structRecord/list",params);

// 关联记录查询
const relationalrecord  = (params)=>getAction("/beamyard/structLedger/list",params);

// 梁 排序判断
const bridgesort  = (params)=>getAction("/beamyard/structStatus/sortCheck",params);

// 参建单位
const contractor = (params)=>getAction("/contractor/contractor/list",params);

// 参见单位删除

const contractordelete = (params)=>deleteAction("/contractor/contractor/delete",params);
// 隐患列表查询

const danger = (params)=>getAction("/sys/hazardType/list",params);

// 隐患类型删除
const dangerdelete  = (params)=>deleteAction("/sys/hazardType/delete",params);

// 人员管理操作

const personTreeList=(params)=>getAction('/person/person/queryPersonTree',params)
// 部门管理

const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList?relTenantIds="+store.state.user.info.relTenantIds,params);


const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree?relTenantIds="+store.state.user.info.relTenantIds,params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy?relTenantIds="+store.state.user.info.relTenantIds,params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);

//二级部门管理
const queryDepartPermission = (params)=>getAction("/sys/permission/queryDepartPermission",params);
const saveDepartPermission = (params)=>postAction("/sys/permission/saveDepartPermission",params);
const queryTreeListForDeptRole = (params)=>getAction("/sys/sysDepartPermission/queryTreeListForDeptRole",params);
const queryDeptRolePermission = (params)=>getAction("/sys/sysDepartPermission/queryDeptRolePermission",params);
const saveDeptRolePermission = (params)=>postAction("/sys/sysDepartPermission/saveDeptRolePermission",params);
const queryMyDepartTreeList = (params)=>getAction("/sys/sysDepart/queryMyDeptTreeList",params);

//日志管理
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);


// 新添加的接口
const start = (params)=>putAction("/person/person/updatePersonUserStatus",params);

// 首页请求1
 const homestart1 = (params)=>postAction("/materials/weighbridgeBill/countWeighbridgeBill",params);

//数据字典
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);

//人员表查询
const getPersonList = (params)=>getAction("/person/person/list",params);
//特种人员表查询
const getSpecialPersonList = (params)=>getAction("/deviceMaintain/deviceSpecialists/list",params);

//设备类型管理
const getDevTypeTree = (params) => getAction("/deviceMaintain/maintainDeviceType/list",params);                   //查询
const deleteDevType = (params) => deleteAction("/deviceMaintain/maintainDeviceType/delete",params);               //删除
//设备养护-设备管理
const queryById = (params) => getAction("/deviceMaintain/maintainDevice/queryById",params);                                            //id查询设备
const queryList = (params) => getAction("/deviceMaintain/maintainDevice/list",params);                                                 //列表查询
const addDev = (params) => postAction("/deviceMaintain/maintainDevice/add",params);                               //添加
const ediDev = (params) => putAction("/deviceMaintain/maintainDevice/edit",params);                               //编辑
const deleteDev = (params) => deleteAction("/deviceMaintain/maintainDevice/delete",params);                       //删除
const deleteBatchDev = (params) => deleteAction("/deviceMaintain/maintainDevice/deleteBatch",params);             //批量删除


const queryDeviceType = (params) => getAction("/deviceManage/deviceType/list",params);                            //查询
const queryNoPageDeviceType = (params) => getAction("/deviceManage/deviceType/noPageList",params);                //无分页查询
const deviceTypeDelete = (params) => deleteAction("/deviceManage/deviceType/delete",params);                      //删除


//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>{
  if(code.indexOf('rel_tenant_ids')==-1){
    code=code+',rel_tenant_ids='+store.state.user.newValue
  }
  return getAction(`/sys/dict/getDictItems/${code}`,params);
}


//从缓存中获取字典配置
function getDictItemsFromCache(dictCode) {
  if (Vue.ls.get(UI_CACHE_DB_DICT_DATA) && Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]) {
    let dictItems = Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode];
    console.log("-----------getDictItemsFromCache----------dictCode="+dictCode+"---- dictItems=",dictItems)
    return dictItems;
  }
}

//系统通告
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);
// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);
// 重复校验
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",Object.assign(params,{relTenantIds:store.state.user.info.relTenantIds}));
// 加载分类字典
const loadCategoryData = (params)=>getAction("/sys/category/loadAllData",params);
const checkRuleByCode = (params) => getAction('/sys/checkRule/checkByCode', params)
//加载我的通告信息
const getUserNoticeInfo= (params)=>getAction("/sys/sysAnnouncementSend/getMyAnnouncementSend",params);
const getTransitURL = url => `/sys/common/transitRESTful?url=${encodeURIComponent(url)}`
// 中转HTTP请求
export const transitRESTful = {
  get: (url, parameter) => getAction(getTransitURL(url), parameter),
  post: (url, parameter) => postAction(getTransitURL(url), parameter),
  put: (url, parameter) => putAction(getTransitURL(url), parameter),
  http: (url, parameter) => httpAction(getTransitURL(url), parameter),
}

export {
  start,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changePassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  getSystemSubmenuBatch,
  loadCategoryData,
  checkRuleByCode,
  queryDepartPermission,
  saveDepartPermission,
  queryTreeListForDeptRole,
  queryDeptRolePermission,
  saveDeptRolePermission,
  queryMyDepartTreeList,
  getUserNoticeInfo,
  getDictItemsFromCache,
  homestart1,
  documenTreeList,
  documenByDepartId,
  documencertigier,
  documencertigierID,
  productionSearch,
  relationalrecord,
  bridgesort,
  contractor,
  contractordelete,
  danger,
  dangerdelete,
  personTreeList,
  getPersonList,
  getSpecialPersonList,
  getDevTypeTree,
  deleteDevType,
  queryById,
  queryList,
  addDev,
  ediDev,
  deleteDev,
  deleteBatchDev,
  queryDeviceType,
  queryNoPageDeviceType,
  deviceTypeDelete
}



