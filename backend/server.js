const http = require("http")
const file_read = require('fs')


const server = http.createServer((req, res)=>
    {
        if(req.url === "/")
        {
            index_file = file_read.readFileSync('D:/stuff/HTML/index.html', "utf-8")
            res.writeHead(200, {"content-type":'text/html'})
            res.end(index_file)
        }
        else if(req.url ==="/about")
        {
            about_file = file_read.readFileSync('D:/stuff/HTML/aims_page.html', "utf-8")
            res.writeHead(200, {"content-type":'text/html'})
            res.end(about_file)
        }
        else if(req.url === "/contact")
            {
                contact_file = file_read.readFileSync('D:/stuff/HTML/participation_page.html', 'utf-8')
                res.writeHead(200, {"content-type":'text/html'})
                res.end(contact_file)
            }
        else
        {
            res.writeHead(404, {"content-type":"text/html"})
            res.end("<h1>Page is not found</h1>")
        }
    }
)
server.listen(4321)