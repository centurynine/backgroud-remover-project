from rembg import remove
from PIL import Image
import easygui as eg
import sys
 
input_path = sys.argv[1]
output_path = sys.argv[2]

input = Image.open(input_path)


output = remove(input)
output.save(output_path)
output_path_savepc = eg.filesavebox(title='Save file to..', default='*.png')
output.save(output_path_savepc)