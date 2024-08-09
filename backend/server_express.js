const express = require("express");
const {
  LoadAllArticles,
  FindLatestUploadedTitles,
  SaveArticle,
  DeleteArticle,
  UpdateArticle,
  addImage,
  SaveMember,
} = require("./db_accesser");
const multer = require("multer");
const bp = require("body-parser");
const path = require("path");
const fs = require("node:fs");
const { readFile } = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public", "uploads")); // here we specify the destination . in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname); // here we specify the file saving name . in this case i specified the original file name
  },
});

const upload = multer({ storage: storage });

const server = express();
server.use(express.static("./public"));
server.use(bp.urlencoded({ extended: false }));
server.use(bp.json());
server.use(express.urlencoded({ extended: false }));

set_uploads_dir();

server.listen(4321, () => {
  console.log("server is listening on port 4321");
});
//index page
server.get("/", (req, res) => {
  const index_absolute = path.resolve(
    getSuperFolderPath(),
    "frontend",
    "index.html"
  );
  res.sendFile(index_absolute);
});
//about page
server.get("/about", (req, res) => {
  const about_absolute = path.resolve(
    getSuperFolderPath(),
    "frontend",
    "aims_page.html"
  );
  res.sendFile(about_absolute);
});
//contact page
server.get("/contact", (req, res) => {
  const contact_absolute = path.resolve(
    getSuperFolderPath(),
    "frontend",
    "participation_page.html"
  );
  res.sendFile(contact_absolute);
});
//submiting the membership form
server.post("/submit_membership", (req, res) => {
  const response = req.body;
  SaveMember(response);
  res
    .status(200)
    .sendFile(
      path.resolve(
        getSuperFolderPath(),
        "frontend",
        "confirmed_membership.html"
      )
    );
});
//manifest page
server.get("/manifest", (req, res) => {
  const manifest_absolute = path.resolve(
    getSuperFolderPath(),
    "frontend",
    "manifest.html"
  );
  res.sendFile(manifest_absolute);
});
//the text of the manifest
server.get("/api/manifest_text", (req, res) => {
  text = readFile(
    path.resolve(
      getSuperFolderPath(),
      "backend",
      "public",
      "manifest_text.txt"
    ),
    "utf-8",
    (err, result) => {
      if (err) {
        res.send("");
      } else {
        res.send(result);
      }
    }
  );
});
//sending last id published articles
server.get("/api/lastArticles:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  FindLatestUploadedTitles(id)
    .then((value) => {
      console.log(value);
      res.status(200).send(value);
    })
    .catch(() =>
      res
        .status(404)
        .send({ success: false, message: "articles are not found" })
    );
});
//saving an article(from python editor)
server.post("/api/articles", (req, res) => {
  const article = req.body;
  article.isUploaded = parseIsUploaded(article.isUploaded);
  SaveArticle(article).then((value) =>
    res.json({ success: true, message: article.title, id: value })
  );
});
//must be encrypted, I suppose(since we don't want to be able to get all articles in browser as a user, but we want to see them in the editor)
//sending all articles
server.get("/api/articles", (req, res) => {
  LoadAllArticles(false).then((value) => {
    res.send(value);
  });
});
//delete an article by id
server.delete("/api/articles:id", (req, res) => {
  const { id } = req.params;
  DeleteArticle(id);
  res.json({ success: true, message: "" });
});
//change article by id
server.put("/api/articles:id", (req, res) => {
  const { id } = req.params;
  const article = req.body;
  article.isUploaded = parseIsUploaded(article.isUploaded);

  UpdateArticle(article, id);
  res.json({ success: true, message: article.title });
});
// all published articles
server.get("/api/allUploadedArticles", (req, res) => {
  LoadAllArticles(true).then((value) => res.send(value));
});
// upload the image of a published article
server.post("/api/images:id", upload.single("article_image"), (req, res) => {
  const { id } = req.params;
  addImage(id, req.file.filename);

  res.status(200).send("file disk upload success");
});
server.all("*", (req, res) => {
  res.status(404).send({ success: false, message: "resource is not found" });
});

//fucntions

function parseIsUploaded(isUploaded) {
  if (isUploaded === "False") {
    return false;
  }
  if (isUploaded === "True") {
    return true;
  }
  return isUploaded;
}

function getSuperFolderPath() {
  const current_folder_string_length = path.basename(__dirname).length;
  const current_dir_string_length = __dirname.length;

  return __dirname.slice(
    0,
    current_dir_string_length - current_folder_string_length - 1
  );
}

function set_uploads_dir() {
  const supposedDirPath = path.join(__dirname, "public", "uploads");
  fs.mkdir(supposedDirPath, { recursive: true }, (err) => {
    console.log(err);
  });
  /*
    fs.access(supposedDirPath, fs.constants.F_OK, (err) => {
        console.log(supposedDirPath)
        fs.mkdir(supposedDirPath)
      });*/
}
