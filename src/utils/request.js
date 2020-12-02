// 封装axios请求模块
import axios from "axios"
import store from '@/store/index.js'
import JSONBig from 'json-bigint'

// 使用json-bigint 测试用的
// const jsonStr = '{"art_id":1187563220387233792}'
// console.log(JSON.parse(jsonStr));
// // JSON.stringify()

// // JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// console.log(JSONBig.parse(jsonStr));//把 JSON格式的字符串准尉JavaScript 对象
// // 使用的时候需要将BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString())

// console.log(JSON.stringify(JSONBig.parse(jsonStr)));
// console.log(JSONBig.stringify(JSONBig.parse(jsonStr))); //把 JavaScript 对象转为 JSON 格式的字符串
// 在这测试结束


const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/",//接口的基准路径
    // 可以让用户自定义后台返回的原始数据（axios）
    transformResponse: [function (data) {
        //  data 就是后端返回的原始数据 就是JSON格式的字符串
        try {
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }
        // axios默认会在内部这样来处理后台返回的数据
        // return JSON.parse(data)
    }]
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求发起会经过这里 config    本次请求的请求配置对象
    console.log(config);
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里要返回config配置对象，否则请求就停在这里出不去
    return config
}, function (error) {
    // Do something with request error
    // 如果请求出错了（还没有发出去） 会进入这里
    return Promise.reject(error)
});

// 响应拦截器
export default request