// 用户相关请求模块
import request from '@/utils/request'
import store from '@/store'

export const login = data => {
    return request({
        method: "POST",
        url: '/app/v1_0/authorizations',
        data
    })
}
// 发送验证码 每分钟每个手机一次
export const sendSms = mobile => {
    return request({
        method: "GET",
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

// 获取用户自己的信息
export const getUserInfo = () => {
    return request({
        method: "GET",
        url: '/app/v1_0/user'
        // 发送请求头数据
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

// 获取频道列表数据
export const getUserChannels = () => {
    return request({
        method: "GET",
        url: '/app/v1_0/user/channels'
    })
}

// 关注用户
export const addFollow = target => {
    return request({
        method: "POST",
        url: '/app/v1_0/user/followings',
        data: {
            target
        }
    })
}

// 取消关注用户
export const deleteFollow = target => {
    return request({
        method: "DELETE",
        url: `/app/v1_0/user/followings/${target}`
    })
}
