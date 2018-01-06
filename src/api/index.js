import * as encrypt from './encrypt'
// 网易 API 请求路径前缀
const API_PREFIX = 'https://music.163.com/weapi'

const requester = createRequester()

// 手机登录
export function cellphoneLogin (phone, password) {
  const data = {
    phone: phone,
    password: encrypt.hashPasswd(password),
    rememberLogin: 'true'
  }
  return requester.cellphoneLogin(data)
}

// 获取歌单
export function getUserPlaylist (uid) {
  const data = {
    offset: 0,
    uid,
    limit: 1000,
    csrf_token: ''
  }
  return requester.getUserPlaylist(data)
}

// 获取歌单详情
export function getPlaylistDetail (id) {
  const data = {
    id,
    offset: 0,
    total: true,
    limit: 1000,
    n: 1000,
    csrf_token: ''
  }
  return requester.getPlaylistDetail(data)
}


// 获取每日推荐歌曲
export function getRecommendSongs () {
  const data = {
    offset: 0,
    total: true,
    limit: 20,
    csrf_token: ''
  }
  return requester.getRecommendSongs(data)
}

// 获取歌曲详情
export function getSongDetail (ids) {
  let idsHash = ids.map(id => ({id}))
  let idsStringify = JSON.stringify(ids)
  const data = {
    c: JSON.stringify(idsHash),
    ids: idsStringify,
    csrf_token: ''
  }
  return requester.getSongDetail(data)
}


// 获取音乐 url
export function getSongUrls (ids) {
  const data = {
    ids,
    br: 999000,
    csrf_token: ''
  }
  return requester.getSongUrls(data)
}

function createRequester () {
  function createRequest(reqInfo) {
    let {
      method = 'post',
      baseURL = API_PREFIX,
      url,
      data
    } = reqInfo
    let queryParams = encodeQueryParams(createQueryParams(data))
    url = baseURL + url + '?' + queryParams
    return fetch(url, {
      method,
    }).then(res => {
      return res.json()
    })
  }

  return {
    cellphoneLogin: (data) => {
      return createRequest({
        url: '/login/cellphone',
        data
      })
    },
    getUserPlaylist: (data) => {
      return createRequest({
        url: '/user/playlist',
        data
      })
    },
    getPlaylistDetail: (data) => {
      return createRequest({
        url: '/v3/playlist/detail',
        data
      })
    },
    getRecommendSongs: (data) => {
      return createRequest({
        url: '/v1/discovery/recommend/songs',
        data
      })
    },
    getSongDetail: (data) => {
      return createRequest({
        url: '/v3/song/detail',
        data
      })
    },
    getSongUrls: (data) => {
      return createRequest({
        url: '/song/enhance/player/url',
        data
      })
    }
  }
}

function createQueryParams (data) {
  const cryptoReq = encrypt.encryptData(data)
  return {
    params: cryptoReq.params,
    encSecKey: cryptoReq.encSecKey
  }
}

function encodeQueryParams (params) {
  let esc = encodeURIComponent
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&')
}
