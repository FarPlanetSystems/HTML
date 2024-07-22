const maxRecentNews = 2
const recentNewsList = document.getElementById("NewsList")

fetchRecentArticles()
.then(value => placeRecentArticles(value))

function AddNewListItem()
{

}
function AddNewListItem(title, text, imageName)
{
    
}
recentNewsList.appendChild

async function fetchRecentArticles()
{
    try
    {
        const articles = await axios.get("http://localhost:4321/api/lastArticles" + toString(maxRecentNews))
        return articles
    }catch
    {
        return ["error"]
    }
}

function placeRecentArticles(articles)
{
    // we want to place maxRecentNews number of articles
    let a = []
    for(let i = 0; i < maxRecentNews; i++)
        {
            // here we check whether the number of fetched articles is less then maxRecentNews
            if(articles.length - 1 < i)
                {
                    //if it is, we create an empty item
                    AddNewListItem()
                }
            else
        }
}