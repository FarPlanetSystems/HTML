from datetime import datetime
import requests
"""
import requests
api_url = "http://localhost:4321/allArticles"
response = requests.get(api_url)
print(response.json())"""
#print(str(datetime.now().hour) + ":" + str(datetime.now().minute) + ":" + str(datetime.now().second))
api_save_url = "http://localhost:4321/saveArticle"

response = requests.post(api_save_url, {
    "title":"someTitle",
    "text": "texttexttext",
    "date": "01-01-1999",
    "isUploaded": False,
    "articleTime": "00:00:00",
    "imageName": "image1",
    "imagePath":"D:/stuff/HTML/backend/public/arrow.png"
})
print(response.json()["success"])