const maxRecentNews = 3;
const recentNewsList = document.getElementById("NewsList");

fetchRecentArticles().then((value) => {
  if (value === "error") {
    const div = document.getElementById("articles-div1");
    const h3 = document.createElement("h3");
    h3.textContent =
      "Es gibt aktuell keine neuen Nachrichten von uns. Hier werden wir alle wichtigen Information unserer Gesellschaft veroeffentlichen";
    h3.className = "article-header text-xl";
    div.append(h3);
  } else placeRecentArticles(value);
});

function AddNewEmptyListItem() {
  const NewsItem = document.createElement("li");
  const ArticlesList = document.getElementById("NewsList");
  ArticlesList.append(NewsItem);
}
function AddNewListItem(title, text, imageName) {
  // creating the DOM list item where the article elements will be placed
  const NewsItem = document.createElement("li");
  const ArticlesList = document.getElementById("NewsList");
  ArticlesList.append(NewsItem);

  // creating the DOM reference to the article page
  const Article_ref = document.createElement("a");
  Article_ref.href = "/";
  NewsItem.append(Article_ref);

  const article_box_div = document.createElement("div");
  article_box_div.className = "article-box";
  Article_ref.append(article_box_div);

  //creating the DOM element for the image of our article if one is given
  const articleImage = document.createElement("img");
  articleImage.className = "NewsItemImage";
  articleImage.src = "uploads/" + imageName;
  article_box_div.append(articleImage);

  // creating the DOM article header element
  const ArticleHeader = document.createElement("h3");
  ArticleHeader.className = "article-header text-xl";
  ArticleHeader.textContent = title;
  article_box_div.append(ArticleHeader);

  //creating the DOM element for the description of our article
  const articleDescription = document.createElement("p");
  articleDescription.className = "article-text";
  articleDescription.textContent = text;
  article_box_div.append(articleDescription);
}

async function fetchRecentArticles() {
  try {
    const articles = await axios.get(
      "http://localhost:4321/api/lastArticles" + maxRecentNews
    );
    return articles.data;
  } catch {
    return "error";
  }
}

function placeRecentArticles(articles) {
  // we want to place maxRecentNews number of articles
  for (let i = 0; i < maxRecentNews; i++) {
    // here we check whether the number of fetched articles is less then maxRecentNews
    if (articles.length - i <= 0) {
      //if it is, we create an empty item
      AddNewEmptyListItem();
    } else {
      console.log("yes");
      AddNewListItem(
        articles[i].title,
        articles[i].text,
        articles[i].imageName
      );
    }
  }
}
