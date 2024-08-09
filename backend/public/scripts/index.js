const maxRecentNews = 3;
const recentNewsList = document.getElementById("NewsList");

let isFormOpened = false;

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
function closeMembershipForm() {
  activateScrollbar();
  window.location.href = "/";
}
function showMembershipForm() {
  disableScrollbar();
  if (!isFormOpened) {
    //removing the whole description
    const mainContainer = document.getElementById("hero-container-small");
    const desc = document.getElementById("hero-desc");
    mainContainer.removeChild(desc);
    //repalcing it with the form
    const signUp = document.createElement("div");
    signUp.className = "sign-up";
    //form header
    const formHeader = document.createElement("h3");
    formHeader.className = "form-heading";
    formHeader.textContent = "Erzaehl uns ueber dich!";
    signUp.append(formHeader);
    //form
    const form = document.createElement("form");
    form.action = "/submit_membership";
    form.method = "POST";
    form.className = "sign-up-form";
    //div for name entrances
    const nameGroup = document.createElement("div");
    nameGroup.className = "name-group";
    //first input
    const prename = document.createElement("input");
    prename.type = "text";
    prename.id = "prename";
    prename.name = "prename";
    prename.className = "name-input";
    prename.placeholder = "Vorname";
    prename.minLength = 3;
    prename.maxLength = 20;
    //second input
    const familyName = document.createElement("input");
    familyName.type = "text";
    familyName.id = "familyName";
    familyName.name = "familyName";
    familyName.className = "name-input";
    familyName.placeholder = "Nachname";
    familyName.minLength = 3;
    //appending the two inputs
    nameGroup.append(prename);
    nameGroup.append(familyName);

    form.append(nameGroup);
    //textarea
    const membDesc = document.createElement("textarea");
    membDesc.name = "membDesc";
    membDesc.className = "member-desc";
    membDesc.placeholder =
      "schreib, was du bei uns leisten koenntest/moechtest";
    nameGroup.append(membDesc);
    //scholling group
    const school = document.createElement("div");
    school.className = "scholing-group";

    const schoolHeader = document.createElement("h4");
    schoolHeader.className = "form-heading";
    schoolHeader.textContent = "Wie ist deine Schullform?";
    school.append(schoolHeader);

    //scholing subgroup
    const school_sub = document.createElement("div");
    school_sub.className = "schooling-subgroup";
    //level input
    const level = document.createElement("input");
    level.id = "quantity";
    level.name = "level";
    level.type = "number";
    level.placeholder = "Stufe";
    level.max = "13";
    level.min = "7";
    level.className = "class-level";

    school_sub.append(level);
    //schoolform selector
    const schoolform = document.createElement("select");
    schoolform.className = "schoolform-selector";
    schoolform.name = "schoolForm";

    const opt1 = document.createElement("option");
    opt1.textContent = "Gymnasium";
    const opt2 = document.createElement("option");
    opt2.textContent = "Realschule";
    const opt3 = document.createElement("option");
    opt3.textContent = "Hauptschule";

    schoolform.append(opt1);
    schoolform.append(opt2);
    schoolform.append(opt3);

    school_sub.append(schoolform);

    school.append(school_sub);

    form.append(school);
    //buttons
    const btn_div = document.createElement("div");
    btn_div.className = "form-buttons";

    const submit = document.createElement("input");
    submit.className = "submit-button";
    submit.type = "submit";
    submit.onclick = closeMembershipForm;

    const close = document.createElement("button");
    close.className = "submit-button";
    close.type = "button";
    close.textContent = "Schliessen";
    close.onclick = closeMembershipForm;

    btn_div.append(submit);
    btn_div.append(close);

    form.append(btn_div);
    signUp.append(form);
    mainContainer.append(signUp);
  }
}

function disableScrollbar() {
  document.body.style.overflowY = "hidden";
}
function activateScrollbar() {
  document.body.style.overflowY = "visible";
}
