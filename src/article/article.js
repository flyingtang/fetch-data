const request = require('superagent')
const cheerio = require('cheerio')
const {sleep}  = require("../utils/util")
const connection = require("../index")

/**
 * 
 * 获取一个页面下所有文章url
 */
exports.getUrls = async function (url) {
    const res = await request.get(url)
    // console.log(res, "res")
    const $ = cheerio.load(res.text)
    const urls = new Set()
    $('.new-list div').each(function (i, elem) {
        $(this).find("li").each((i, item) => {
            // console.log(i, item);
            $(this).find("a").each((i, aitem) => {
                const href = aitem.attribs && aitem.attribs.href
                urls.add(href)
            })
        })
    })
    return urls;
}

/**
 * 根据一篇文章的地址获取每一篇文章
 *
 * @param {*} url
 * @returns
 */
async function getOneArticle(url) {
    const res = await request.get(url)
    const options = {
        decodeEntities: false
    }
    // var headers = {
    //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
    //   }
    const $ = cheerio.load(res.text, options)
    const title = $(".post_title h1").text()
    const created_at = $("#pubtime_baidu").text()
    const source = $("#source_baidu a").text()
    const author = $("#author_baidu strong").text()
    const content = $("#paragraph").html()
    // 获取一张图片做主图
    const main_pic = getMainPic(content)
    return {
        title,
        created_at,
        source,
        author,
        content,
        main_pic,
        description: ""
    }
}

/**
 *根据内容获取第一张图片用来做主图
 *
 * @param {*} content
 * @returns
 */
function getMainPic(content) {
    if (content && content.length > 0) {
        const pics = content.match(/<img.*?(?:>|\/>)/gi)
        // 获取数组的第一zhan
        if (pics.length > 0) {
            const urls = pics[0].match(/data-original=[\'\"]?([^\'\"]*)[\'\"]?/i)
            if (urls.length == 2) {
                return urls[1]
            }
        }
    }
    return ""
}



/**
 *保存到数据库
 *
 * @param {*} data
 */
async function saveDatabase(data) {
    // TODO 校验数据
    const {
        title,
        created_at,
        source,
        author,
        content,
        main_pic
    } = data
    const category_id = 1;
    if (title && created_at && content) {
        data.category_id = 12;
        data.markdown = ""
        // data.created_at= data.createdAt
        // const sql = `insert into tb_article (title, content, category_id, main_pic, source, author) values (\`${title}\`, \`${content}\`, ${category_id},\`${mainPic}\`, "${source}", "${author})";`
        const sql = `insert into tb_article set ?`
        connection.query(sql, data, function (error, results, fields) {
            if (!error) {
                console.info("插入成功 :", title)
            } else {
                console.error(error.message)
            }
        })
    }
}

/**
 * 根据文章地址数组获取所有的文章
 */
exports.getAllArticles = async function (urls) {
    urls = Array.from(urls)
    for (let i = 0; i < urls.length; i++) {
        try {
            // 获取
            let data = await getOneArticle(urls[i])
            // 对广告过滤
            // data = filterArticle()
            await saveDatabase(data)  
           
        } catch (err) {

        } finally {
            // 休息5秒
            //    await sleep(1)
        }
    }
    await sleep(10)
    // connection.end();
}

// 文章过滤
// function filterArticle(data){
    
//     if (data.title) {
//         data.title.match(/[0-9]元/)
//     }

//     return undefined
// }