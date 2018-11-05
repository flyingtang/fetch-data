
const md5 = require("md5")
const uuidv1 = require('uuid/v1');

exports.sleep =  (second = 1)=>{
    return new Promise((resolve) => {
        setTimeout(() => resolve(), second * 1000)
    })
}


// 用MD5 产生随机字符
exports.randomString = function() {
    let str = (new Date()).valueOf() + uuidv1()
    return md5(str);
}