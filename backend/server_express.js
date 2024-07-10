const express = require("express")
const server = express()

server.use(express.static("./public"))

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
/*
server.get("/arrow.png", (req, res)=>
    {
        res.sendFile("/stuff/HTML/pics/arrow.png")
    }
)
server.get("/icon.jpg", (req, res)=>
    {
        res.sendFile("/stuff/HTML/pics/icon.jpg")
    }
)
server.get("/logo.png", (req, res)=>
    {
        res.sendFile("/stuff/HTML/pics/logo.png")
    }
)
server.get("/logo_blue.png", (req, res)=>
    {
        res.sendFile("/stuff/HTML/pics/logo_blue.png")
    }
)
server.get("/headerStyle.css", (req, res)=>
    {
        res.sendFile("/stuff/HTML/styles/headerStyle.css")
    }
)
server.get("/generalStyles.css", (req, res)=>
    {
        res.sendFile("/stuff/HTML/styles/generalStyles.css")
    }
)
    */
server.all("*", (req, res)=>
    {
        res.status(404).send("Page is not found")
    }
)