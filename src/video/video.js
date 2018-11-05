const fs = require("fs")
const request = require('superagent')
const Nightmare = require('nightmare')
const path = require("path")
const constant  =require("../config/config.json") 
const {sleep, randomString}  = require("../utils/util")
const connection = require("../index")
/**
 * 简单视频过滤
 * @param {Object} res 
 */
function filterVideo(res = {}){
    const {contentUrl, title} = res
    if (contentUrl &&  title){
        // 是否是广告
        let isAD = title.match(/(买|送)[1-9]\d*/ig);
        if (isAD && isAD.length > 0) {
            console.log(isAD)
            return undefined
        }
        return res;
    }
    return undefined
}

/** 
 * 获取视频并存储
 */
exports.fetchVideos = async function fetchVideos() {
    try {
        const nightmare = Nightmare({
            show: false,
        })
        const nh = nightmare.goto('https://kuaiyinshi.com/#search-form').wait('body')
        while (true) {
            await nh.evaluate(function () {
                const obj = {};
                obj.title = document.querySelector("p.desc").innerText
                obj.contentUrl = document.querySelector("source").src
                return obj;
            }).then(async (res) => {
                if (res) {
                    // 简单过滤
                    let fv = filterVideo(res)
                    if (fv){
                        // 存入下载视频，并存入数据库
                        console.log("数据有效，准备入库", fv.title)
                        await videoSaveDatabase(fv)
                        console.warn("开始下一个")
                    }else{
                        console.error("数据无效或有广告嫌疑 ",fv && fv.title)
                    }
                }
            })
            nh.click('.play-next')
            await sleep(5) // 等待5s
        }
        nh.end()
    } catch (err) {
        console.log(err, "卧槽出错了")
        // getVideoInfomation()
    }
}

/**
 *视频入库
 *
 * @param {*} [data={}]
 * @returns
 */
function videoSaveDatabase(data = {}) {
    return new Promise((resolve) => {
        const {contentUrl, title} = data;
        if (contentUrl && title) {
            // 文件名
            fileName = randomString()
            const fp = path.join(constant.videoDir, fileName);
            console.log(fp, "文件路径")
            request(contentUrl).on('error', function (err) {
                console.log("出错了")
                resolve()
            }).pipe(fs.createWriteStream(fp, {mode: 0666})).on('finish', () => {
                console.log('视频下载成功：%s', contentUrl);
                // 如果文件名字不祥，就随机取个名字
                let origin_name = path.basename(contentUrl);
                if (origin_name.indexOf("?") > -1) {
                    origin_name = fileName;
                }
                const dbdata = {
                    origin_name: origin_name,
                    url_name: fileName,
                    title: title,
                    description: title
                }
                const sql = "insert into tb_video  set ?"
                connection.query(sql, dbdata, function (error, results, fields) {
                    if (!error) {
                        console.info("插入成功 :", title)
                    } else {
                        console.error(error.message)
                    }
                    resolve()
                })
            })
        }else{
            return resolve()
        }
    })
}