from rembg import remove
from PIL import Image
import easygui as eg
import sys

#get arguments from app.js
input_path = sys.argv[1]
 
#open image in path and remove background
input = Image.open(input_path)
# input_path = eg.fileopenbox(title='Select image file')
output_path = eg.filesavebox(title='Save file to..')
# input = Image.open(input_path)
output = remove(input)
output.save(output_path)