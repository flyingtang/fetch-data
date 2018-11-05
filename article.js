const  {getUrls, getAllArticles}= require("./src/article/article")


// 获取首页面
let url = "https://www.ithome.com/"
async function getArticles() {
    // 第一步，获取最新文章集合
    const  urls  = await getUrls(url)
    // 获取每一篇文章，并存入数据库
    await getAllArticles(urls)
} 

getArticles()