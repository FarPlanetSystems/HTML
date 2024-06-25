import tkinter as tk
import abc
from tkinter import ttk

#ViewModel
class Article:
    def __init__(self, title, text, photo, date):
        self.title = title
        self.text = text
        self.photo = photo
        self.date = date
        self.isUploaded = False
        self.ArticleOpened_event = self.__default_articleOpened
    
    def __default_articleOpened(self):
        print("Hello world")
        pass

    def OpenArticle(self):
        self.ArticleOpened_event()
    def __str__(self):
        return "article"

class Library:
    def __init__(self, saveEvent, uploadEvent, deleteEvent, updateEvent):
        self.__articles = []
        self.__saveEvent = saveEvent
        self.__uploadEvent = uploadEvent
        self.__deleteEvent = deleteEvent
        self.__updateEvent = updateEvent

    def getArticleByIndex(self, index):
        try:
            res = self.__articles[index]
        except:
            res = self.__articles[0]
        return res

    def getNumOfArticles(self):
        return len(self.__articles)
    
    def addArticle(self, article):
        if article.__str__() == "article":
            if self.__compareNames(article):
                updatedArticle = self.__findArticleByTitle(article.title)
                updatedArticle.text = article.text
                updatedArticle.photo = article.photo
                updatedArticle.date = article.date
                self.__updateEvent(updatedArticle.title)
            else:
                self.__articles.append(article)
                self.__saveEvent(article.title)

    def removeArticle(self, article):
        if article.__str__() == "article":
            self.__articles.remove(article)
            self.__deleteEvent(article.Titel)

    def uploadArticle(self, article):
        if article.__str__() == "article":
            if self.__compareNames(article):
                self.__uploadEvent(article.titel)


    def __findArticleByTitle(self, Title:str):
        for i in self.__articles:
            if i.title == Title:
                return i
        return None
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

#View
class Window(abc.ABC):
    def __init__(self, dataContext):
        self._visualizer = tk.Tk()
        self.dataContext = dataContext
        self._isVisualized = False

    @abc.abstractmethod
    def SetDefaultVisualization(self):
        pass
    @abc.abstractmethod
    def Show(self):
        pass
    @abc.abstractmethod
    def Close(self):
        pass
    def _defaultShow(self):
        if self._isVisualized == False:
            self.SetDefaultVisualization()
            self._isVisualized = True
        self._visualizer.mainloop()

class MainWindow(Window):
    def __init__(self, dataContext):
        super().__init__(dataContext)
        self.ArticleTitle = tk.StringVar()
        self.ArtcleDate = tk.StringVar()
        self.IsArticleUploaded = tk.BooleanVar()
        self.IsArticleUploaded.set(False)


    def SetDefaultVisualization(self):
        self._visualizer.title('NeueSchule editor')
        self._visualizer.geometry('1200x750')
        
        self._visualizer.columnconfigure((0,1,2), weight = 1, uniform="a")

        self._visualizer.rowconfigure(0, weight = 1, uniform="a")
        self._visualizer.rowconfigure(1, weight = 1, uniform="a")
        self._visualizer.rowconfigure(2, weight = 5, uniform="a")
        self._visualizer.rowconfigure(3, weight = 2, uniform="a")

        headerFrame = ttk.Frame(master=self._visualizer)
        headerFrame.rowconfigure(0, weight=1)
        headerFrame.columnconfigure((0, 1, 2, 3), weight=3)

        Editinglabel = ttk.Label(master=headerFrame, text="Editing", font="Calibri 20")
        DateLabel = ttk.Label(master=headerFrame, text="last time edited: ", font="Calibri 16")
        Date = ttk.Label(master=headerFrame, font="Calibri 16", textvariable=self.ArtcleDate)
        IsUploadedCheckButton = ttk.Checkbutton(master=headerFrame, variable=self.IsArticleUploaded, text = "Uploaded", state="disabled")

        Editinglabel.grid(column=0, row=0, sticky="nsew")
        DateLabel.grid(column=1, row=0, sticky="nsew")
        Date.grid(column=2, row=0, sticky="nsew")
        IsUploadedCheckButton.grid(column=3, row=0, sticky="ns")

        headerFrame.grid(row=0, column=1,columnspan=2, sticky='nsew', padx=15, pady=10)


        ArticleTitleEntry = ttk.Entry(master=self._visualizer, font="Calibri 20", textvariable=self.ArticleTitle)
        ArticleTitleEntry.grid(row=1, column=1, columnspan=2, sticky='nsew', padx=10, pady=10)
        self.__articleTextEntry = tk.Text(master=self._visualizer, font="Calibri 20")
        self.__articleTextEntry.grid(row=2, column=1, columnspan=2, sticky='nsew', padx=10, pady=10)
        
        ButtonFrame = ttk.Frame(master=self._visualizer)
        SaveButton = ttk.Button(master=ButtonFrame, text="Save", command=self.__clickSaveButton)
        UploadButton = ttk.Button(master=ButtonFrame, text="Upload")
        DeleteButton = ttk.Button(master=ButtonFrame, text="Delete")

        ButtonFrame.rowconfigure(0, weight=1)
        ButtonFrame.columnconfigure((0, 1, 2), weight=1)
        SaveButton.grid(column=0, row=0, sticky="nsew", padx=35, pady=35)
        UploadButton.grid(column=1, row=0, sticky="nsew", padx=35, pady=35)
        DeleteButton.grid(column=2, row=0, sticky="nsew", padx=35, pady=35)
        ButtonFrame.grid(row=3, column=1, columnspan=2, sticky='nsew', padx=10, pady=10)

        list = ArticlesList(self._visualizer, self.dataContext)
        self._isVisualized = True

    def __clickSaveButton(self):
        article = Article(self.ArticleTitle.get(), self.__articleTextEntry.get(1.0, "end"), "no", "25.06.2024")
        self.dataContext.addArticle(article)
        ArticlesList(self._visualizer, self.dataContext)
        print(self.__articleTextEntry.get(1.0, "end"))

    def Show(self):
        self._defaultShow()

    def Close(self):
        pass


class ArticlesList(ttk.Frame):

    def __init__(self, parent, library):
        super().__init__(parent)

        self.grid(column=0, row=0, rowspan=4, sticky='nsew')

        self.__library = library
        self.__elementsNum = library.getNumOfArticles()
        self.__listHeight = self.__elementsNum * 100

        self.__canvas = tk.Canvas(self, scrollregion=(0, 0, self.winfo_width(), self.__listHeight))
        self.__canvas.pack(expand=True, fill='both')

        self.__articlesFrame = ttk.Frame(master=self.__canvas)
        self.__canvas.create_window((0, 0), window=self.__articlesFrame, anchor="nw", width=self.winfo_width(), height=self.__listHeight)


        for i in range(library.getNumOfArticles()):
            article = self.__createArticleView(library.getArticleByIndex(i))
            article.pack(expand=True, fill='y', pady=10, padx=10)

        self.__canvas.bind_all("<MouseWheel>", self.__scroll)
        self.bind("<Configure>", self.__updateSize)

    def __scroll(self, event):
        if(self.__listHeight > self.master.winfo_height()):
            self.__canvas.yview_scroll(-int(event.delta/100),"units")

    def __updateSize(self, event):
        self.__canvas.create_window((0, 0), window=self.__articlesFrame, anchor="nw", width=self.winfo_width(), height=self.__listHeight)
        pass
    def __createArticleView(self, article:Article):
        singleArticleFrame = ttk.Frame(master = self.__articlesFrame, height=100)
        singleArticleFrame.columnconfigure((0, 1, 2, 3, 4), weight=1, uniform="a")
        singleArticleFrame.rowconfigure(0, weight=1)
        
        articleTitel = ttk.Label(master=singleArticleFrame, text=article.title, width=20, font="Calibri 12")
        articleDate = ttk.Label(master = singleArticleFrame, text=article.date, width=10, font="Calibri 12")
        openButton = ttk.Button(master = singleArticleFrame, text="Open", command = article.OpenArticle)

        articleTitel.grid(row=0, column=0, rowspan=2, sticky="nsew")
        articleDate.grid(row=0, column=2, columnspan=2, sticky="nws")
        openButton.grid(row=0, column=4, sticky="ew")
        return singleArticleFrame
        

application = App()
application.Run()
