import tkinter as tk
import abc
from tkinter import ttk, filedialog
from datetime import date
from PIL import Image, ImageTk
from editor_view import MainWindow

#ViewModel
class Article:
    def __init__(self, title, text, image, date):
        self.title = title
        self.text = text
        self.image = image
        self.date = date
        self.isUploaded = False
        self.ArticleOpened_event = self.__default_articleOpened
    
    def __default_articleOpened(self, obj):
        pass

    def OpenArticle(self):
        self.ArticleOpened_event(self)
    def __str__(self):
        return "article"

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

    def SaveArticleCommand(self, title, text, photo):
        datestr = str(date.today())
        article = Article(title, text, photo, datestr)
        self.addArticle(article)
        pass
    #self.__articleTextEntry.get(1.0, "end")
    
    def addArticle(self, article):
        if article.__str__() == "article":
            if self.__compareNames(article):
                updatedArticle = self.__findArticleByTitle(article.title)
                updatedArticle.text = article.text
                updatedArticle.image = article.image
                updatedArticle.date = article.date
                self.__updateEvent(updatedArticle.title)
            else:
                self.__articles.append(article)
                article.ArticleOpened_event = self.SetCurrentArticle
                self.__saveEvent(article.title)
            self.NotifyArticleAdded()

    def removeArticleCommand(self):
        if self.currentArticle != None:
            self.__articles.remove(self.currentArticle)
            self.SetCurrentArticle(self.__articles[0])
            self.NotifyArticleRemoved(self.currentArticle)
            self.__deleteEvent(self.currentArticle.title)

    def uploadArticleCommand(self):
        if self.currentArticle != None:
            self.currentArticle.isUploaded = not(self.currentArticle.isUploaded)
            self.SetCurrentArticle(self.currentArticle)
            self.__uploadEvent(self.currentArticle.title)
    
    

    def getNumOfArticles(self):
        return len(self.__articles)

    def __findArticleByTitle(self, Title:str):
        for i in self.__articles:
            if i.title == Title:
                return i
        return None
    def getArticleByIndex(self, index):
        try:
            res = self.__articles[index]
        except:
            res = self.__articles[0]
        return res
    def __compareNames(self, article):
        if self.__findArticleByTitle(article.title) != None:
            return True
        else:
            return False


#Model
class App:
    def __init__(self):
        self.AllWindows = []
        self.__loadLibrary()
        self.MainWindow = MainWindow(self.Library)
        self.AllWindows.append(MainWindow)
        if self.Library.getNumOfArticles() > 0:
            self.Library.getArticleByIndex(0).OpenArticle()
    
    def Run(self):
        self.MainWindow.Show()
    
    def SaveArticle(self, articleTitel:str):
        #Request to db
        pass

    def UploadArticle(self, articleTitel:str):
        #Request to db
        pass

    def DeleteArticle(self, articleTitel:str):
        pass
    def UpdateArticle(self, articleTitel:str):
        pass
    def __loadLibrary(self):
        #Request to db
        self.Library = Library(self.SaveArticle, self.UploadArticle, self.DeleteArticle, self.UpdateArticle)
        for i in range(5):
            self.Library.addArticle(Article("title"+str(i), "text" + str(i), "no", "22.05.2008"))
        pass

application = App()
application.Run()
