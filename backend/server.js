const http = require("http")
const file_read = require('fs')


index_file = file_read.readFileSync('D:/stuff/HTML/index.html', "utf-8")
about_file = file_read.readFileSync('D:/stuff/HTML/aims_page.html', "utf-8")
contact_file = file_read.readFileSync('D:/stuff/HTML/participation_page.html', 'utf-8')

arrow = file_read.readFileSync("D:/stuff/HTML/pics/arrow.png")
icon = file_read.readFileSync("D:/stuff/HTML/pics/icon.jpg")
logo = file_read.readFileSync("D:/stuff/HTML/pics/logo.png")
logo_blue = file_read.readFileSync("D:/stuff/HTML/pics/logo_blue.png")

header_styles = file_read.readFileSync("D:/stuff/HTML/styles/headerStyle.css")
general_styles = file_read.readFileSync("D:/stuff/HTML/styles/generalStyles.css")


const server = http.createServer((req, res)=>
    {
        if(req.url === "/")
        {
            res.writeHead(200, {"content-type":'text/html'})
            res.end(index_file)
        }
        else if(req.url ==="/about")
            {
            res.writeHead(200, {"content-type":'text/html'})
            res.end(about_file)
            }
        else if(req.url === "/contact")
            {
                res.writeHead(200, {"content-type":'text/html'})
                res.end(contact_file)
            }
        else if(req.url === "/arrow.png")
            {
                    res.writeHead(200, {"content-type":'image/png'})
                    res.end(arrow)
            }
        else if(req.url === "/icon.jpg")
            {
                        res.writeHead(200, {"content-type":'image/jpg'})
                        res.end(icon)
            }
        else if(req.url === "/logo.png")
            {
                    res.writeHead(200, {"content-type":'image/png'})
                    res.end(logo)
            }
        else if(req.url === "/logo_blue.png")
            {
                    res.writeHead(200, {"content-type":'image/png'})
                    res.end(logo_blue)
            }
        else if(req.url === "/headerStyle.css")
            {
                        res.writeHead(200, {"content-type":'text/css'})
                        res.end(header_styles)
            }
        else if(req.url === "/generalStyles.css")
            {
                        res.writeHead(200, {"content-type":'text/css'})
                        res.end(general_styles)
            }
        else
        {
            res.writeHead(404, {"content-type":"text/html"})
            res.end("<h1>Page is not found</h1>")
        }
    }
)
server.listen(4321)