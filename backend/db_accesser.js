const {Sequelize, Model, DataTypes, where} = require("sequelize");
const {config} = require('./database_config');
const { toInteger } = require("lodash");

//connect to the db
let model 
const seq = ConnectSequelize(config.database, config.user, config.password, config.host, config.dialect)
let isConnected = false
//check connection
try {
    seq.authenticate();
    console.log('Connection has been established successfully.');
    isConnected = true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

if(isConnected)
{
    // create table "article"
    model = GenerateModel()
    model.sync()
    module.exports = {LoadAllArticles, FindLatestUploadedTitles, SaveArticle, DeleteArticle, UpdateArticle}
}

async function LoadAllArticles(UploadedOnly)
{   let articles
    if(UploadedOnly){ 
    articles = await model.findAll(
        {
            where:{isUploaded:true}
        })
    }else
    {
        articles = await model.findAll()
    }
    for(let i = 0; i<articles.length; i++)
        {
            console.log(articles[i].isUploaded)
            articles[i] = CreateArticleJson(
                articles[i].id,
                articles[i].title,
                articles[i].text,
                articles[i].date, 
                articles[i].isUploaded,
                articles[i].articleTime,
                articles[i].imageName,
                articles[i].imagePath
            )
        }
    return articles
}


async function FindLatestUploadedTitles(num)
{
    let realSize = num
    //selecting date and time atributes of all articles
    //(im not sure whether it is a good idea, but i dont know how to use where on string dates incoding numbers) 
    let articles = await model.findAll(
        {
            where:{isUploaded:true}
        })
    if(articles.length < num) realSize = articles.length
    //sorting selected articles from latest to earliest.(yeah, bubble sorting)
    for(let i = 0; i<articles.length; i++)
        {
            for(let j = i + 1; j<articles.length; j++)
                {
                    let article1 = articles[i]
                    let article2 = articles[j]
                    if(convertStringsToDate(article1.date, article1.articleTime) < convertStringsToDate(article2.date, article2.articleTime))
                        {
                            articles[i] = article2
                            articles[j] = article1
                        }
                }
        }
    //slicing first num elements or taking all elements if the sum os all articles is less then required num
    articles = articles.slice(0, realSize)
    for(let i = 0; i<articles.length; i++)
        {
            articles[i] = CreateArticleJson(
                articles[i].id,
                articles[i].title,
                articles[i].text,
                articles[i].date, 
                articles[i].isUploaded,
                articles[i].articleTime,
                articles[i].imageName,
                articles[i].imagePath
                )
        }
    return articles
}

function convertStringsToDate(strDate, strTime)
{
    let day = strDate.slice(0, strDate.indexOf("-"))
    let last = strDate.slice(strDate.indexOf("-") + 1, strDate.length)
    let month = last.slice(0, last.indexOf("-"))
    let year = last.slice(last.indexOf("-") + 1, last.length)

    let hour = strTime.slice(0, strTime.indexOf(":"))
    last = strTime.slice(strTime.indexOf(":") + 1, strTime.length)
    let minute = last.slice(0, last.indexOf(":"))
    let second = last.slice(last.indexOf(":") + 1, last.length)
    return new Date(day, month, year, hour, minute, second)
}

function CreateArticleJson(id, title, text, date, isUploaded, articleTime, imageName, imagePath)
{
    let Uploaded = false
    if(isUploaded != 0) Uploaded = true
    const json = 
    {
        "id": id,
        "title": title,
        "text": text,
        "date": date,
        "isUploaded": Uploaded,
        "articleTime": articleTime,
        "imageName": imageName,
        "imagePath": imagePath
    }
    console.log(json.isUploaded)
    return json
}

async function SaveArticle(ArticleJson)
{
    let Uploaded = 0;
    if(ArticleJson.isUploaded)
        {
            Uploaded = 1
        }
    const newArticle = await model.create(
        {
        title:ArticleJson.title,
        text: ArticleJson.text,
        date: ArticleJson.date,
        isUploaded: Uploaded,
        articleTime: ArticleJson.articleTime,
        imageName: ArticleJson.imageName,
        imagePath: ArticleJson.imagePath
        })
    console.log(newArticle instanceof model)
    return newArticle.id
}
async function DeleteArticle(ArticleId)
{
    await model.destroy({
        where:{
            id: ArticleId
        }
    })
}
async function UpdateArticle(NewArticleJson, articleId)
{
    let NewUploaded = 0
    if(NewArticleJson.isUploaded)NewUploaded = 1
    await model.update(
        {
            title: NewArticleJson.title,
            text: NewArticleJson.text,
            date: NewArticleJson.date,
            isUploaded: NewUploaded,
            articleTime: NewArticleJson.articleTime,
            imageName: NewArticleJson.imageName,
            imagePath: NewArticleJson.imagePath
        },
        {where:
            {
                id: articleId
            }
        }
    )
}

function ConnectSequelize(database, username, password, host, dialect)
{
    return new Sequelize(database, username, password, {host:host, dialect:dialect})
}
function GenerateModel()
{
    // in other projects you should better create an extension for this
    const ArticleModel = seq.define("article", 
        {id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
         title: {type:DataTypes.TEXT, allowNull: false},
         text: {type: DataTypes.TEXT, allowNull: false},
         date:{type: DataTypes.TEXT, allowNull:false},
         isUploaded:{type: DataTypes.INTEGER, allowNull:false},
         articleTime:{type: DataTypes.TEXT, allowNull:false},
         imageName:{type: DataTypes.TEXT, allowNull:false},
         imagePath:{type: DataTypes.TEXT, allowNull:false}
        })
    return ArticleModel
}
