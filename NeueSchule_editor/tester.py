"""from datetime import datetime
import requests
#files = {'file': ("article_image", open('D:/stuff/HTML/backend/public/arrow.png', 'rb'))}
#files = {'image', open('D:/stuff/HTML/backend/public/arrow.png', 'rb')}
files = {'file': ("image", open('D:/stuff/HTML/backend/public/arrow.png', 'rb'))}
print(files)

requests.post("http://localhost:4321/images", files = files)

"""
import requests

url = "http://localhost:4321/stats"
    
files = {'uploaded_file': open('D:/stuff/HTML/backend/public/arrow.png', 'rb')}
requests.post(url, files= files)
print(files["uploaded_file"].name)