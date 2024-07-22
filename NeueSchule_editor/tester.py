
import os
from PIL import Image
old_image_path = "D:/stuff/HTML/neueSchule_editor/images/icon.jpg"
new_image_path = "D:/stuff/HTML/backend/public/Blumen.jpg"

dest = os.path.dirname(old_image_path)

image = Image.open(new_image_path)
image = image.resize((500, 500))

os.remove(old_image_path)

image.save(os.path.join(dest, os.path.basename(new_image_path)))




