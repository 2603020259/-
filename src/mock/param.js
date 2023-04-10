import Mock from 'mockjs'
// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

let List = []
const count = 200
//var imgArr = ['../images/good1s.jpeg', '../images/good2s.jpeg', '../images/good3s.jpeg', '../images/good4s.jpeg', '../images/good5s.jpeg', '../images/good6s.jpeg', '../images/good7s.jpeg', '../images/good8s.jpeg', '../images/good9s.jpeg'];
var NameArr = ['金渐层', '银渐层', '狸花猫', '斯芬克斯', '印度猫', '布偶猫', '波斯猫', '孟买猫'];
//var goodsColorArr = ['黑色', '灰色', '银色', '金色', '雪白色', '玛奇色'];
var initilesArr=['J','M','X','G','E','U','R','Q','O','L','K','Z'];
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      number:Mock.Random.natural(10,100),
      name:NameArr[Mock.Random.natural(0,7)],
      sorting:Mock.Random.natural(10,100),
      initiles:initilesArr[Mock.Random.natural(0,11)],
      brand:Mock.Random.boolean(),
      isEnab:Mock.Random.boolean(),
      evaluetion:Mock.Random.natural(1000,3000),
      commodity:Mock.Random.natural(1000,3000),
    })
  )
}

export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getParamList: config => {
    console.log(config, 'config')
    const { name, page = 1, limit = 9 } = param2Obj(config.url)
    console.log('name:' + name, 'page:' + page, '分页大小limit:' + limit)
    const mockList = List.filter(user => {
      //console.log('user',user);
      console.log('name', name);
      if (name && user.name.indexOf(name) === -1 && user.addr.indexOf(name) === -1) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 20000,
      count: mockList.length,
      list: pageList
    }
  },
  /**
   * 增加用户
   * @param number,name,initiles,brand,isEnab,evaluetion,commodity,
   * * @return {{code: number, data: {message: string}}}
   */
  createParam: config => {
    const {  number,name,initiles,brand,isEnab,evaluetion,commodity,sorting } = JSON.parse(config.body)
    console.log(JSON.parse(config.body))
    List.unshift({
      id: Mock.Random.guid(),
      number: number,
      name: name,
      initiles: initiles,
      brand: brand,
      evaluetion: evaluetion,
      commodity: commodity,
      isEnab: isEnab,
      sorting:sorting
    })
    return {
      code: 20000,
      data: {
        message: '添加成功'
      }
    }
  },
  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteParam: config => {
    const { id } = JSON.parse(config.body)
    if (!id) {
      return {
        code: -999,
        message: '参数不正确'
      }
    } else {
      List = List.filter(u => u.id !== id)
      return {
        code: 20000,
        message: '删除成功'
      }
    }
  },
  /**
   * 批量删除
   * @param config
   * @return {{code: number, data: {message: string}}}
   */
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 20000,
      data: {
        message: '批量删除成功'
      }
    }
  },
  /**
   * 修改用户
   * @param id, number,name,initiles,brand,isEnab,evaluetion,commodity,
   * @return {{code: number, data: {message: string}}}
   */
  updateParam: config => {
    console.log('updata');
    const { id, number,name,initiles,brand,isEnab,evaluetion,commodity,sorting } = JSON.parse(config.body)
    //const sex_num = (sex)
    List.some(u => {
      if (u.id === id) {
        u.number = number
        u.name = name
        u.initiles = initiles
        u.brand = brand
        u.evaluetion = evaluetion
        u.commodity = commodity
        u.isEnab = isEnab
        u.sorting=sorting
        return true
      }
    })
    return {
      code: 20000,
      data: {
        message: '编辑成功'
      }
    }
  }
}