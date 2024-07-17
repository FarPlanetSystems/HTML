

function fetchArticle(ServerAdress, id)
{
    return fetch(ServerAdress).then(response => response.json())
}
function fetchLastArticle(ServerAdress)
{
    return fetch(ServerAdress + "/" + "lastArticle").then(response => response.json())
}


const localServer = "http://localhost:4321"
fetchLastArticle(localServer).then(value => console.log(value))
//const PreviousArticleJson = fetchArticle(localServer, LastArticleJson.id - 1)