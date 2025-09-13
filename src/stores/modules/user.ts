import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login, queryDeptWardRelation, queryMember, verityApp } from '@/api/login.js'
import { store } from '../index.js'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

export const userStore = defineStore(
  'user',
  () => {
    // 定义token
    const token = ref('')
    // 定义用户信息
    const userInfo = ref({
      corpcode: '', // 用户机构编码
      corpName: '', // 用户机构名称
      corpList: '', // 机构列表
      orgId: '', // 机构id
      orgCode: '', // 机构编码
      orgName: '', // 机构名称
      hospCode: '', // 院区编码
      hospName: '', // 院区名称
      orgUserMapId: '', // 机构用户映射id
      usercode: '', // 用户编码
      id: '282475805660160000',
      username: '', // 用户名
      deptId: '', // 部门id
      deptname: '', // 部门名称
      deptcode: '', // 部门编码
      pdcode: '', // 上级部门编码
      paName: '', // 上级部门名称
      sex: '', // 性别
      belongGroupId: '', // 医疗组id
      belongGroupName: '', // 归属医疗组名称
      antiOverNolimitRight: '', // 越级使用非限制级权 N-不具备 Y-具备 字段为空时，默认=N
      antiOverlimitRight: '', // 越级使用限制级权 N-不具备 Y-具备 字段为空时，默认=N
      antiOverSpecialRight: '', // 越级使用特殊级权权 N-不具备 Y-具备 字段为空时，默认=N
      antiConsultationRight: '', // 抗菌药会诊权 N-不具备 Y-具备 字段为空时，默认=N
      slowExcess: '', // 慢病超量权 N-不具备 Y-具备
      memberTypeName: '', // 人员来源机构名称
      memberTypeCode: '', // 人员来源机构编码
      platId: '', // 平台id 如医共体或HRP系统下发的人员ID
      daySurgeryOpen: '', // 日间手术开立 N-不具备 Y-具备
      herbalMedicine: '', // 中成药处方权 N-不具备 Y-具备
      theRapeutist: '', //治疗师处方权 N-不具备 Y-具备
      canDispensing: '', // 是否可以发药 N-不具备 Y-具备
      endoscopeOpeRight: '', // 内镜手术权限 通用字典明细中code:分类编码: ssdj 分类名称: 手术等级
      interventionOpeRight: '', // 介入手术权限 通用字典明细中code:分类编码: ssdj 分类名称: 手术等级
      openOpeRight: '', // 开放手术权限通用字典明细中code:分类编码: ssdj 分类名称: 手术等级 [几级手术跟几级备案手术属于同级] 1 一级手术 2 二级手术 3 三级手术 4 四级手术 01 备案一级手术 02 备案二级手术 03 备案三级手术 04 备案四级手术
      medicalInsuranceCode: '', // 医保编码
      signUrl: '', // 签名地址
      imgUrl: '', // 照片地址
      zlypLevel: '', // 肿瘤药物级别权限编码 1-普通使用级 2-特殊使用级
      zlypLevelName: '', // 肿瘤药物级别权限名称
      materApply: '', // 物资申领权限
      psyRight: '', // 精神药品处方权限 1-仅开立精一 2-仅开立精二（2级以内） 1,2-可以开立精一、精二
      antiLevel: '', // 抗生素权限编码
      antiLevelName: '', // 抗生素权限名称
      isRefund: '', // 能进行退费操作 N-否 Y-是
      isAudit: '', // 是否审核 N-未审核 Y-已审核
      isGroupLeader: '', // 是否组长 N-否 Y-是
      fromHosp: '', // 归属院区(人员人事关系)
      officeName: '', // 归属科室名称 即人事编制科室名称
      office: '', // 归属科室ID 即人事编制科室ID
      isOnLine: '', // 是否在线预约 N-否 Y-是
      reEmploy: '', // 反聘人员 N-否 Y-是
      onState: '', // 在职状态编码 通用字典明细中code:分类编码: zzzt0001 分类名称:在职状态 0-在编 1-聘用 2-临时 3-退休 4-住陪 5-进修
      onStateName: '', // 在职状态名称
      nurseTitle: '', // 护士级别编码 通用字典明细中code:分类编码: nurse_title 分类名称:护士职称 1-护士 2-护师 3-主管护师 4-副主任护师 5-主任护师
      nurseTitleName: '', // 护士级别名称
      isMaster: '', // 是否是护士长 N-不具备 Y-具备
      poisonous: '', // 毒麻权 N-不具备 Y-具备
      cipherPrescription: '', // 协定处方权 N-不具备 Y-具备
      herbal: '', // 中药处方权 N-不具备 Y-具备
      anesthesia: '', // 麻醉权 N-不具备 Y-具备
      prescribe: '', // 处方权 N-不具备 Y-具备
      prescribeStartDate: '', // 处方权开始日期
      prescribeEndDate: '', // 处方权结束日期
      postNatureCode: '', // 岗位性质编码
      postNatureName: '', // 岗位性质名称
      doctorCode: '', // 执业编号 职业证书编号(医保编号)
      specialField: '', // 擅长领域
      description: '', // 个人描述
      email: '', // 电子邮件
      homePhone: '', // 家庭电话
      homeAddress: '', // 家庭住址
      remarks: '', // 备注信息
      status: '', // 有效状态
      name: '', // 姓名
      pyCode: '', // 拼音码
      wbCode: '', // 五笔码
      idCard: '', // 身份证号
      birthday: '', // 出生日期
      phone: '', // 手机号
      code: '', // 人员代码(人员工号)
      nationCode: '', // 民族代码
      nationName: '', // 民族名称
      memberRole: '', // 人员类型编码 通用字典明细中code:分类编码: TD_00013 分类名称:人员类别代码 1-医生 2-护士 3-医技 4-药剂 5-行政 6-收费 9-其他
      titleCode: '', // 医生职称编码
      titleName: '', // 医生职称名称
      signLevel: '', // 对应签署级别，需要手动根据职称换算
      wardId: '', // 病区id
      wardName: '', // 病区名称
    })
    const data = ref({
      rm: true,
      usercode: '5004331',
      password: '1',
      orgId: '224460964526714880',
      orgCode: 'BLJZXCSHJ',
      orgName: '堡垒机主线测试环境',
      loading: true,
      remarkid: 'ssss',
      isEncryption: 0,
      loginAuthWay: '01',
    })

    const setUserWardId = async ({ orgCode, deptId }) => {
      const res = await queryDeptWardRelation({
        orgCode,
        deptIds: [deptId],
        token: token.value,
      })
      if (res.Code == 200) {
        if (res.data?.list?.length > 0) {
          const wardId = res.data.list[0].wardId
          if (wardId) {
            userInfo.value.wardId = res.data.list[0].wardId
            userInfo.value.wardName = res.data.list[0].wardName
          }
        }
      }
    }

    async function getVerityApp() {
      const res = await verityApp()
      const verityData = res.rows?.[0] || {}
      const { parameterValue } = verityData
      const sessionObj = JSON.parse(parameterValue)
      Object.keys(sessionObj).forEach((key) => {
        sessionStorage.setItem(key, sessionObj[key])
      })
    }

    const userLogin = async (globalUserInfo) => {
      await getVerityApp()
      console.log('qiankunWindow.__POWERED_BY_QIANKUN__', qiankunWindow.__POWERED_BY_QIANKUN__)
      // 设置token
      let res
      if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
        res = await login(data.value)
        token.value = res.message.split('token=')[1]
      }
      else {
        token.value = localStorage.getItem('token')
        res = {
          object: globalUserInfo || {},
          statusCode: 200,
          message: 'success',
        }
      }
      if (res.statusCode == 200) {
        // 设置用户信息
        userInfo.value = res.object
        userInfo.value.deptId = userInfo.value.workDeptId || userInfo.value.deptId
        userInfo.value.deptname = userInfo.value.workDeptName || userInfo.value.deptname
        console.log(`${new Date().getTime()}============`, userInfo.value)
        // 查询用户数据
        const member = await queryMember(userInfo.value.id, token.value)
        console.log('member', member)
        if (member.Code == 200) {
          console.log(new Date().getTime(), 11)
          if (member.data?.list?.length > 0) {
            // 更新用户信息
            Object.keys(member.data.list[0]).forEach((item) => {
              userInfo.value[item] = member.data.list[0]?.[item]
                ? member.data.list[0]?.[item]
                : userInfo.value[item]
            })
            // 职称换算签署级别
            const transf = {
              4: '1',
              3: '2',
              2: '3',
              1: '3',
            }
            userInfo.value.signLevel = transf[userInfo.value.titleCode]
            console.log('userInfo', { ...userInfo.value })
            await setUserWardId(userInfo.value)
          }
        }
      }
    }
    const getToken = () => {
      return token.value
    }
    const getUserInfo = computed(() => {
      return userInfo.value
    })

    return { userInfo, getUserInfo, getToken, userLogin }
  },
  {
    persist: true,
  },
)

export function useUserStore() {
  return userStore(store)
}
