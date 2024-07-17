const express = require("express")
const {config} = require("./database_config")

const server = express()
server.use(express.static("./public"))

server.listen(4321, ()=>
    {
        console.log("server is listening on port 4321")
    }
)
server.get("/", (req, res)=>
    {
        //res.sendFile("/stuff/HTML/index.html")
        res.json(config)
        console.log(config)
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
server.get("/lastArticle", (req, res)=>
    {
        res.json({id:3, title:"hello", text:"vfwedrvtbynumi", date:"14.07.2024"})
    }
)
server.all("*", (req, res)=>
    {
        res.status(404).send("Page is not found")
    }
)