import tkinter as tk
import abc
from tkinter import ttk, filedialog
from datetime import date
from PIL import Image, ImageTk

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
    def __init__(self, dataContext, app):
        super().__init__(dataContext)
        self.ArticleTitle = tk.StringVar()
        self.ArtcleDate = tk.StringVar()
        self.IsArticleUploaded = tk.BooleanVar()
        self.ArticleImagePath = tk.StringVar()
        self.isImageShown = False
        self.MessageLine = tk.StringVar()
        app.NotifyOnNewMessage =  self.MessageLine.set

        dataContext.NotifyCurrentArticleChanged = self.__onArticleOpened

        self.__articleTextEntry = tk.Text(master=self._visualizer, font="Calibri 20")


    def SetDefaultVisualization(self):
        self.isImageShown = False
        self._visualizer.title('NeueSchule editor')
        self._visualizer.geometry('1200x750')
        
        self._visualizer.columnconfigure((0,1,2), weight = 1, uniform="a")

        self._visualizer.rowconfigure(0, weight = 4, uniform="a")
        self._visualizer.rowconfigure(1, weight = 2, uniform="a")
        self._visualizer.rowconfigure(2, weight=4, uniform="a")
        self._visualizer.rowconfigure(3, weight = 20, uniform="a")
        self._visualizer.rowconfigure(4, weight = 8, uniform="a")
        self._visualizer.rowconfigure(5, weight=2, uniform="a")

        # row 0 column 1
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

        # row 1 column 1
        ImageAddingFrame = ttk.Frame(master=self._visualizer)
        ImageAddingFrame.columnconfigure(0, weight=6)
        ImageAddingFrame.columnconfigure(1, weight=1)
        ImageAddingFrame.columnconfigure(2, weight=1)
        ImageAddingFrame.rowconfigure(1, weight=1)

        self.ImagePathEntry = ttk.Label(master=ImageAddingFrame, font="Calibri 16", textvariable=self.ArticleImagePath)
        self.ImagePathEntry.grid(row=0, column=0, sticky="nsew")

        ImportImageButton = ttk.Button(master=ImageAddingFrame, text="import image", command=self.__clickImportButton)

        ImportImageButton.grid(row=0, column=1, sticky="nsew", padx=20)

        CheckImageButton = ttk.Button(master= ImageAddingFrame, text="check image", command=self.__clickCheckImageButton)
        CheckImageButton.grid(row=0, column=2, sticky="nsew")

        ImageAddingFrame.grid(row=1, column=1, columnspan=2, sticky="nsew", padx=20)

        # row 2 column 1
        ArticleTitleEntry = ttk.Entry(master=self._visualizer, font="Calibri 20", textvariable=self.ArticleTitle)
        ArticleTitleEntry.grid(row=2, column=1, columnspan=2, sticky='nsew', padx=10, pady=10)

        # row 3 column 1
        self.__articleTextEntry.grid(row=3, column=1, columnspan=2, sticky='nsew', padx=10, pady=10)
        
        # row 4 column 1
        ButtonFrame = ttk.Frame(master=self._visualizer)
        SaveButton = ttk.Button(master=ButtonFrame, text="Save", command=self.__clickSaveButton)
        UploadButton = ttk.Button(master=ButtonFrame, text="Upload", command=self.__clickUploadButton)
        DeleteButton = ttk.Button(master=ButtonFrame, text="Delete", command=self.__clickDeleteButton)

        ButtonFrame.rowconfigure(0, weight=1)
        ButtonFrame.columnconfigure((0, 1, 2), weight=1)
        SaveButton.grid(column=0, row=0, sticky="nsew", padx=35, pady=35)
        UploadButton.grid(column=1, row=0, sticky="nsew", padx=35, pady=35)
        DeleteButton.grid(column=2, row=0, sticky="nsew", padx=35, pady=35)
        ButtonFrame.grid(row=4, column=1, columnspan=2, sticky='nsew', padx=10)

        # row 5 colomnum 0-1

        MessageLabel = ttk.Label(master=self._visualizer, textvariable=self.MessageLine, font="Calibri 16")

        MessageLabel.grid(row=5, column=0, columnspan=2, sticky="sew", padx=10)

        # column 0
        list = ArticlesList(self._visualizer, self.dataContext, self.__createEmptyArticle)
        self._isVisualized = True

    def __clickSaveButton(self):

        self.dataContext.SaveArticleCommand(self.ArticleTitle.get(), self.__articleTextEntry.get(1.0, "end"), self.ArticleImagePath.get())
        ArticlesList(self._visualizer, self.dataContext, self.__createEmptyArticle)
    
    def __clickDeleteButton(self):
        self.dataContext.removeArticleCommand()
        ArticlesList(self._visualizer, self.dataContext, self.__createEmptyArticle)

    def __clickUploadButton(self):
        self.dataContext.uploadArticleCommand(self.ArticleTitle.get(), self.__articleTextEntry.get(1.0, "end"), self.ArticleImagePath.get())
        ArticlesList(self._visualizer, self.dataContext, self.__createEmptyArticle)

    def __clickCheckImageButton(self):
        if not(self.isImageShown):
            try:
                self.__showImage()
            except:
                pass
        else:
            self.isImageShown = False
            self.ImageCanvas.grid_remove()
            self.SetDefaultVisualization()

    def __showImage(self):
        self.isImageShown = True
        self.ImageCanvas = tk.Canvas(self._visualizer)
        self.ImageCanvas.grid(row=2, rowspan=2, column=1, columnspan=2, sticky="nsew")
        Original_image = Image.open(self.path)
        self.Tk_image = ImageTk.PhotoImage(Original_image)

        self.ImageCanvas.bind("<Configure>", self.__resizeImageCanvas)

    def __resizeImageCanvas(self, event):
        self.ImageCanvas.delete('all')
        self.ImageCanvas.create_image(event.width/2, event.height/2, image=self.Tk_image)

    
    def __clickImportButton(self):
        self.path = filedialog.askopenfile().name
        self.ArticleImagePath.set(self.path)
        if self.isImageShown == True:
            self.__clickCheckImageButton()
            self.__clickCheckImageButton()

    def __onArticleOpened(self):
        self.__articleTextEntry.delete(1.0, "end")
        self.__articleTextEntry.insert(1.0, self.dataContext.currentArticle.text)
        self.ArticleTitle.set(self.dataContext.currentArticle.title)
        self.ArtcleDate.set(self.dataContext.currentArticle.date)
        self.IsArticleUploaded.set(self.dataContext.currentArticle.isUploaded)
        self.ArticleImagePath.set(self.dataContext.currentArticle.image)
        self.path = self.dataContext.currentArticle.image

    def __clear(self):
        self.ArticleTitle.set("draft")
        self.__articleTextEntry.delete(1.0, "end")
        self.ArtcleDate.set(str(date.today()))
        self.IsArticleUploaded.set(False)
        self.ArticleImagePath.set("no image")
        self.path = ""

    def __createEmptyArticle(self):
        self.__clear()
        self.dataContext.createArticle(self.ArticleTitle.get(), self.__articleTextEntry.get(1.0, "end"), self.ArticleImagePath.get())
        ArticlesList(self._visualizer, self.dataContext, self.__createEmptyArticle)
        pass

    def Show(self):
        self._defaultShow()
    
    def Close(self):
        pass


class ArticlesList(ttk.Frame):

    def __init__(self, parent, library, addButtonCommand):
        super().__init__(parent)

        self.grid(column=0, row=0, rowspan=4, sticky='nsew')

        self.__library = library
        self.__elementsNum = library.getNumOfArticles() + 1
        self.__listHeight = self.__elementsNum * 100

        self.__canvas = tk.Canvas(self, scrollregion=(0, 0, self.winfo_width(), self.__listHeight), bd=0, highlightthickness=0)
        self.__canvas.pack(expand=True, fill='both')

        self.__articlesFrame = ttk.Frame(master=self.__canvas)
        self.__canvas.create_window((0, 0), window=self.__articlesFrame, anchor="nw", width=self.winfo_width(), height=self.__listHeight)


        for i in range(library.getNumOfArticles()):
            article = self.__createArticleView(library.getArticleByIndex(i))
            article.pack(expand=True, fill='y', pady=10, padx=10)
        
        self.__createAddArticleButton(addButtonCommand)

        self.__canvas.bind_all("<MouseWheel>", self.__scroll)
        self.bind("<Configure>", self.__updateSize)

    def __scroll(self, event):
        if(self.__listHeight + 100 > self.master.winfo_height()):
            self.__canvas.yview_scroll(-int(event.delta/100),"units")

    def __updateSize(self, event):
        self.__canvas.create_window((0, 0), window=self.__articlesFrame, anchor="nw", width=self.winfo_width(), height=self.__listHeight)
        pass
    def __createArticleView(self, article):
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
    def __createAddArticleButton(self, command):
        self.add_button = ttk.Button(self.__articlesFrame, command=command, text="+")
        self.add_button.pack(expand=True, fill='both', padx=20, pady=20)