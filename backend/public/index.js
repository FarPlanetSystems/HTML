const maxRecentNews = 2
const recentNewsList = document.getElementById("NewsList")

fetchRecentArticles()
.then(value => placeRecentArticles(value))

function AddNewEmptyListItem()
{
    const NewsItem = document.createElement("li")
    const ArticlesList = document.getElementById("NewsList")
    ArticlesList.append(NewsItem)

}
function AddNewListItem(title, text, imageName)
{
    // creating the DOM list item where the article elements will be placed
    const NewsItem = document.createElement("li")
    const ArticlesList = document.getElementById("NewsList")
    ArticlesList.append(NewsItem)

    // creating the DOM article header element
    const ArticleHeader = document.createElement("h4")
    ArticleHeader.className = "newsTitle"
    ArticleHeader.textContent = title
    NewsItem.append(ArticleHeader)

    //creating the DOM element for the description of our article
    const articleDescription = document.createElement("p")
    articleDescription.className = "newsDescr"
    articleDescription.textContent = text
    NewsItem.append(articleDescription)

    //creating the DOM element for the image of our article if one is given
    const articleImage = document.createElement("img")
    articleImage.className = "NewsItemImage"
    //articleImage.src = "uploads/" + imageName 
    articleImage.src = "uploads/" + imageName
    NewsItem.append(articleImage)

}

async function fetchRecentArticles()
{
    try
    {
        const articles = await axios.get("http://localhost:4321/api/lastArticles" + maxRecentNews)
        return articles.data
    }catch
    {
        return ["error"]
    }
}

function placeRecentArticles(articles)
{
    // we want to place maxRecentNews number of articles
    for(let i = 0; i < maxRecentNews; i++)
        {
            // here we check whether the number of fetched articles is less then maxRecentNews
            if(articles.length - i <= 0 )
                {
                    //if it is, we create an empty item
                    AddNewEmptyListItem()
                }
            else
            {
                console.log("yes")
                AddNewListItem(articles[i].title, articles[i].text, articles[i].imageName)
            }
        }
}