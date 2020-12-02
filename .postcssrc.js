// PostCSS配置文件
module.exports = {
    // 配置要是用的 PostCSS插件
    plugins: {
        // 'autoprefixer': {
        //     //配置要兼容的浏览器
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },
        'postcss-pxtorem': {
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // rootValue: 37.5,
            propList: ['*'],
            // 配置不要转换的样式资源
            exclude: 'github-markdown'
        }
    }
}