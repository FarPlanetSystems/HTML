let articles_list = [];
fetchArticles().then((value) => {
  articles_list = value;
  buildArticles(value);
});
async function fetchArticles() {
  try {
    const articles = await axios.get("http://localhost:4321/api/articles");
    return articles.data;
  } catch {
    return "error";
  }
}
function fetchArticleById(id) {
  for (let i = 0; i < articles_list.length; i++) {
    if (articles_list[i].id === id) {
      return articles_list[i];
    }
  }
}
function createArticleDOM(articleJson) {
  const articles = document.getElementById("articles-list");
  //creating an empty list item
  const article_item = document.createElement("li");

  const article_box = document.createElement("div");
  article_box.className = "article-box";
  //article header
  const article_header_cont = document.createElement("div");
  article_header_cont.className = "article-header";

  const article_header = document.createElement("h3");
  article_header.textContent = articleJson.title;
  article_header_cont.append(article_header);

  const article_date = document.createElement("h4");
  article_date.textContent = articleJson.date;
  article_header_cont.append(article_date);

  article_box.append(article_header_cont);
  //article contents
  const article_contents = document.createElement("div");
  article_contents.className = "article-contents";
  //image
  const image = document.createElement("img");
  image.src = "uploads/" + articleJson.imageName;
  article_contents.append(image);
  //text
  const article_text = document.createElement("p");
  article_text.textContent = articleJson.title;
  article_contents.append(article_text);
  //button
  const a = document.createElement("a");
  a.textContent = "lesen";
  a.onclick = function () {
    openSingleArticle(articleJson.id);
  };
  article_contents.append(a);

  article_box.append(article_contents);
  article_item.append(article_box);
  articles.append(article_item);
}
function buildArticles(articles) {
  if (articles != "error") {
    for (let i = 0; i < articles.length; i++) {
      createArticleDOM(articles[i]);
    }
  }
}

function openSingleArticle(article_id) {
  console.log(article_id);
  const article = fetchArticleById(article_id);
  console.log(article);

  const news_section = document.getElementById("news");

  const container = document.getElementById("news-container-small");
  news_section.removeChild(container);

  const container_new = document.createElement("div");
  container_new.className = "container-small";

  const sub_container = document.createElement("div");
  sub_container.className = "single-a-container";

  const image = document.createElement("img");
  image.src = "/uploads/" + article.imageName;

  sub_container.append(image);

  const header = document.createElement("h2");
  header.className = "single-a-header";
  header.textContent = article.title;

  sub_container.append(header);

  const text = document.createElement("p");
  text.className = "single-a-text";
  text.textContent = article.text;

  sub_container.append(text);

  container_new.append(sub_container);

  container_new.append(document.createElement("hr"));

  const date = document.createElement("p");
  date.className = "single-a-date";
  date.textContent = article.date;
  container_new.append(date);

  news_section.append(container_new);
}
