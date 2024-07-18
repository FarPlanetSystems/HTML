const express = require("express")
const {LoadAllArticles, FindLatestUploadedTitles, SaveArticle, DeleteArticle, UpdateArticle} = require("./db_accesser")

const server = express()
server.use(express.static("./public"))
server.use(express.urlencoded({extended:false}))
server.use(express.json())

function parseIsUploaded(isUploaded)
{
    if (isUploaded === "False")
        {
            return false
        }
    if (isUploaded === "True")
    {
        return  true
    }
    return isUploaded
}

server.listen(4321, ()=>
    {
        console.log("server is listening on port 4321")
    }
)
server.get("/", (req, res)=>
    {
        res.sendFile("/stuff/HTML/index.html")
    }
)
server.get("/about", (req, res)=>
    {
        res.sendFile("/stuff/HTML/aims_page.html")
    }
)
server.get("/contact", (req, res)=>
    {
        res.sendFile("/stuff/HTML/participation_page.html")
    }
)
server.get("/api/lastArticle", (req, res)=>
    {
        res.json({id:3, title:"hello", text:"vfwedrvtbynumi", date:"14.07.2024"})
    }
)
server.post("/api/articles", (req, res)=>
    {
        const article = req.body
        article.isUploaded = parseIsUploaded(article.isUploaded)
        SaveArticle(article).then(value => res.json({success:true, message:article.title, id: value}))
    }
)
//must be encrypted, I suppose(since we don't want to be able to get all articles in browser as a user, but we want to see them in the editor)
server.get("/api/articles", (req, res) =>
    {
        LoadAllArticles(false).then(value =>{
            res.send(value)
        }
    )
    })
server.delete("/api/articles:id", (req, res)=>
    {
        const {id} = req.params
        DeleteArticle(id)
        res.json({success: true, message: ""})
    }
)
server.put("/api/articles:id", (req, res) =>
    {
        const {id} = req.params
        const article = req.body
        article.isUploaded = parseIsUploaded(article.isUploaded)
        
        console.log(article.isUploaded)
        UpdateArticle(article, id)
        res.json({success: true, message: article.title})
    })
server.get("/api/allUploadedArticles", (req, res)=>
    {
        LoadAllArticles(true).then(value => res.send(value))
    })

server.all("*", (req, res)=>
    {
        res.status(404).send("Page is not found")
    }
)