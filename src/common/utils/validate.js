/* 正则 */
const patterns = {
  username: /^\w+$/, /* 数字、英文字母或者下划线 */
  passwordS: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/, /* 密码-强（字母+数字+特殊字符） */
  passwordM: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/, /* 密码-中（字母+数字，字母+特殊字符，数字+特殊字符） */
  passwordW: /^\w+$/, /* 密码-弱（数字，字母，下划线） */
  idCardCode: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, /* 身份证校验码 */
  idCardDate: /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/, /* 身份证日期码 */
  idCardProv: /^[1-9][0-9]/, /* 身份证地区码 */
  mobileNo: /^1([34578])\d{9}$/, /* 手机号码 */
  telNo: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, /* 固定电话、传真 */
  qqNo: /^[1-9][0-9]{4,10}$/, /* qq号 5至11位数字*/
  wxNo: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, /* 微信号 6至20位，以字母开头，字母，数字，减号，下划线*/
  cCarNo: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/, /* 普通汽车 */
  xCarNo: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/ /* 新能源汽车 */
}

// ^\\d+$ //非负整数（正整数 + 0）
// ^[0-9]*[1-9][0-9]*$ //正整数
// ^((-\\d+)|(0+))$ //非正整数（负整数 + 0）
// ^-[0-9]*[1-9][0-9]*$ //负整数
// ^-?\\d+$ //整数
// ^\\d+(\\.\\d+)?$ //非负浮点数（正浮点数 + 0）
//   ^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$ //正浮点数
// ^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$ //非正浮点数（负浮点数 + 0）
// ^(-?\\d+)(\\.\\d+)?$ //浮点数

/* 用户名 */
function username (value, name = '') {
  const valid = patterns.username.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || '用户名'}只能由数字、英文字母或者下划线组成`)
  }
}

/* 密码 */
function password (value, name = '', intensity = 'W') {
  const valid = patterns[`password${intensity}`].test(value)
  const tips = intensity === 'S' ? '必须由字母、数字和特殊字符组成' : intensity === 'M' ? '必须包含字母、数字、特殊字符中2种字符' : '只能由数字、字母、下划线组成'
  return {
    valid,
    error: valid ? null : new Error(`${name || '密码'}${tips}`)
  }
}

/* 身份证格式校验 */
function idCardNo (value, name = '') {
  /* 检验身份证校验码 */
  function _checkCode (val) {
    const factor = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2']
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    const code = val.substring(17)
    if (patterns.idCardCode.test(val)) {
      let sum = 0
      for (let i = 0; i < 17; i++) {
        sum += val[i] * factor[i]
      }
      if (parity[sum % 11] === code.toUpperCase()) {
        return true
      }
    }
    return false
  }

  /* 检验身份证日期码 */
  function _checkBirthday (val) {
    if (patterns.idCardDate.test(val)) {
      const year = val.substring(0, 4)
      const month = val.substring(4, 6)
      const date = val.substring(6, 8)
      const date2 = new Date(`${year}-${month}-${date}`)
      if (date2 && date2.getMonth() === (parseInt(month) - 1)) {
        return true
      }
    }
    return false
  }

  /* 检验身份证地区码 */
  function _checkProvince (val) {
    const provinceMap = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江 ',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北 ',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏 ',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门'
    }
    if (patterns.idCardProv.test(val)) {
      if (provinceMap[val]) {
        return true
      }
    }
    return false
  }

  /* 验证 */
  const valid = _checkCode(value) && _checkBirthday(value.substring(6, 14)) && _checkProvince(value.substring(0, 2))
  return {
    valid,
    error: valid ? null : new Error(`${name || '身份证号码'}格式错误`)
  }
}

/* 手机号码 */
function mobileNo (value, name = '') {
  const valid = patterns.mobileNo.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || '手机号码'}格式错误`)
  }
}

/* 座机、传真 */
function telNo (value, name = '') {
  const valid = patterns.telNo.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || '号码'}格式错误`)
  }
}

/* 联系方式 */
function contactNo (value, name = '') {
  const valid = patterns.mobileNo.test(value) || patterns.telNo.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || '号码'}格式错误`)
  }
}

/* qq */
function qqNo (value, name = '') {
  const valid = patterns.qqNo.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || 'QQ号'}格式错误`)
  }
}

/* 微信号*/
function wxNo (value, name = '') {
  const valid = patterns.wxNo.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || '微信号'}格式错误`)
  }
}

/* 车牌号 */
function carNo (value, name = '') {
  const valid = patterns.cCarNo.test(value) || patterns.xCarNo.test(value)
  return {
    valid,
    error: valid ? null : new Error(`${name || '车牌号'}格式错误`)
  }
}

/* 一致 */
function equateTo (value, name = '', validValue = '', validName = '') {
  const valid = value === validValue
  const tips = !name || !validName ? '两次输入不一致' : `${name}必须与${validName}一致`
  return {
    valid,
    error: valid ? null : new Error(tips)
  }
}

/* 生成验证器 */
function validator (type, name = '', ...args) {
  return (rule, value, callback) => {
    const res = validateUtil[type](value, name, ...args)
    res.valid ? callback() : callback(res.error)
  }
}

const validateUtil = {
  username,
  password,
  idCardNo,
  mobileNo,
  telNo,
  contactNo,
  qqNo,
  wxNo,
  carNo,
  equateTo,
  validator
}

export default validateUtil
