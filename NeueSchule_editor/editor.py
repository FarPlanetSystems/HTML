import tkinter as tk
import requests
from datetime import date, datetime
from editor_view import MainWindow


#ViewModel
class Article:
    def __init__(self, title, text, image, date, isUploaded:bool, time):
        self.id = 0
        self.title = title
        self.text = text
        self.image = image
        self.date = date
        self.time = time
        self.isUploaded = isUploaded
        self.ArticleOpened_event = self.__default_articleOpened
    
    def __default_articleOpened(self, obj):
        pass

    def OpenArticle(self):
        self.ArticleOpened_event(self)
    def __str__(self):
        return "article"
    def json(self):
        json = {
            "id":self.id,
            "title": self.title,
                "text":self.text,
                "date":self.date,
                "isUploaded":self.isUploaded,
                "articleTime": self.time,
                "imageName":"no",
                "imagePath": self.image
                }
        return json

class Library:
    def __init__(self, saveEvent, uploadEvent, deleteEvent, updateEvent):
        self.__articles = []
        self.__saveEvent = saveEvent
        self.__uploadEvent = uploadEvent
        self.__deleteEvent = deleteEvent
        self.__updateEvent = updateEvent
        self.currentArticle = None
        self.NotifyCurrentArticleChanged = self.__default_CurrentArticleChanged
        self.NotifyArticleAdded = self.__default_CurrentArticleChanged
        self.NotifyArticleRemoved = self.__default_CurrentArticleChanged


    def __default_CurrentArticleChanged(self):
        pass
    def GetCurrentArticle(self):
        return self.currentArticle
    def SetCurrentArticle(self, value:Article):
        self.currentArticle = value
        self.NotifyCurrentArticleChanged()

    #update
    def SaveArticleCommand(self, title, text, image):
        #generating strings of the current time
        datestr = str(date.today())
        timestr = str(datetime.now().hour) + ":" + str(datetime.now().minute) + ":" + str(datetime.now().second)
        #creating the new instance of uodated article
        newArticle = Article(title, text, image, datestr, self.currentArticle.isUploaded, timestr)
        newArticle.id = self.currentArticle.id
        #updating the old instance in db
        self.__updateEvent(self.currentArticle, newArticle)
        #changing the values of the old instance
        self.currentArticle.title = newArticle.title
        self.currentArticle.text = newArticle.text
        self.currentArticle.image = newArticle.image
        self.currentArticle.date = newArticle.date
        self.currentArticle.time = newArticle.time
        self.currentArticle.isUploaded = newArticle.isUploaded
        self.SetCurrentArticle(self.currentArticle)
            
    
    def createArticle(self, title, text, imagePath):
        datestr = str(date.today())
        timestr = str(datetime.now().hour) + ":" + str(datetime.now().minute) + ":" + str(datetime.now().second)
        article = Article(title, text, imagePath, datestr, False, timestr)
        article.ArticleOpened_event = self.SetCurrentArticle
        self.__saveEvent(article)
        self.addArticle(article)

    def addArticle(self, article):
        self.__articles.append(article)
        self.NotifyArticleAdded()

    def removeArticleCommand(self):
        if self.currentArticle != None and self.__articles.__len__() > 1:
            self.__articles.remove(self.currentArticle)
            self.__deleteEvent(self.currentArticle)
            self.SetCurrentArticle(self.__articles[0])
            self.NotifyArticleRemoved()

    def uploadArticleCommand(self, title, text, image):
        if self.currentArticle != None:
            #generating strings of the current time
            datestr = str(date.today())
            timestr = str(datetime.now().hour) + ":" + str(datetime.now().minute) + ":" + str(datetime.now().second)
            #creating the new instance of uodated article
            newArticle = Article(title, text, image, datestr, not(self.currentArticle.isUploaded), timestr)
            newArticle.id = self.currentArticle.id
            #updating the old instance in db
            self.__uploadEvent(self.currentArticle, newArticle)
            #changing the values of the old instance
            self.currentArticle.title = newArticle.title
            self.currentArticle.text = newArticle.text
            self.currentArticle.image = newArticle.image
            self.currentArticle.date = newArticle.date
            self.currentArticle.time = newArticle.time
            self.currentArticle.isUploaded = newArticle.isUploaded
            print(self.currentArticle.json())
            self.SetCurrentArticle(self.currentArticle)
    
    

    def getNumOfArticles(self):
        return len(self.__articles)

    def getArticleByIndex(self, index):
        try:
            res = self.__articles[index]
        except:
            res = self.__articles[0]
        return res


#Model
class App:
    def __init__(self):
        self.NotifyOnNewMessage = self.__default_event
        self.AllWindows = []
        self.__loadLibrary()
        self.MainWindow = MainWindow(self.Library, self)
        self.AllWindows.append(MainWindow)
        if self.Library.getNumOfArticles() > 0:
            print(self.Library.getArticleByIndex(0).isUploaded)
            self.Library.getArticleByIndex(0).OpenArticle()
    
    def __default_event(self, obj):
        pass

    def Run(self):
        self.MainWindow.Show()
    
    def SaveArticle(self, article:Article):
        #Request to db
        api_save_url = "http://localhost:4321/api/articles"

        response = requests.post(api_save_url, article.json()).json()

        article.id = response["id"]

        msg = self.__generateMessageText(response, " was not created", " was created")
        self.NotifyOnNewMessage(msg)


    def UploadArticle(self, oldArticle:Article, newArticle:Article):
        api_update_url = "http://localhost:4321/api/articles" + oldArticle.id.__str__()
        response = requests.put(api_update_url, newArticle.json()).json()

        # sending the image of the uploaded article, if ones path was added
        self.__sendImage(oldArticle.id, newArticle.image)

        if(newArticle.isUploaded):
            msg = self.__generateMessageText(response, " was not uploaded", " was uploaded")
            self.NotifyOnNewMessage(msg)
        else:
            msg = self.__generateMessageText(response, " is still uploaded", " is not uploaded anymore")
            self.NotifyOnNewMessage(msg)

    def DeleteArticle(self, article:Article):
        api_delete_url = "http://localhost:4321/api/articles" + article.id.__str__()
        response = requests.delete(api_delete_url).json()

        msg = self.__generateMessageText(response, " article was not deleted", " article was deleted")
        self.NotifyOnNewMessage(msg)
    
    def UpdateArticle(self, oldArticle:Article, newArticle:Article):
        api_update_url = "http://localhost:4321/api/articles" + oldArticle.id.__str__()
        # sending the actual new article
        response = requests.put(api_update_url, newArticle.json()).json()

        # sending the image of the updated article, if ones path was added
        self.__sendImage(oldArticle.id, newArticle.image)

        # Notification of the system
        msg = self.__generateMessageText(response, " was not saved", " was saved")
        self.NotifyOnNewMessage(msg)

    def __sendImage(self, id, imagePath):
        api_addImage_url = "http://localhost:4321/api/images" + id.__str__()
        try:
            print(imagePath)
            image = {"article_image": open(imagePath, 'rb')}
            requests.post(api_addImage_url, files=image)
        except:
            print("no image path added")

    def __generateMessageText(self, api_response, error_msg:str, success_msg:str):
        Text = ""
        if not api_response["success"]:
            Text = "Error! "
            Text += api_response["message"] + error_msg
        if api_response["success"]:
            Text = "Success! "
            Text += api_response["message"] + success_msg
        return Text


    def __loadLibrary(self):
        #Request to server
        api_load_url = "http://localhost:4321/api/articles"
        response = requests.get(api_load_url).json()
        #initializing the library
        self.Library = Library(self.SaveArticle, self.UploadArticle, self.DeleteArticle, self.UpdateArticle)
        for i in response:
            article = Article(i["title"], i["text"], i["imagePath"], i["date"], i["isUploaded"], i["articleTime"])
            article.id = i["id"]
            article.ArticleOpened_event = self.Library.SetCurrentArticle
            self.Library.addArticle(article)
        pass

application = App()
application.Run()
