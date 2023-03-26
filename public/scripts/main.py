import os
import numpy as np
import cv2
import math

def image_tailing(img_array: np, tile_size=256, min_zoom=0, max_zoom=3, method='centered/left-up'):
    h = tile_size
    w = tile_size
    img_height, img_width = img_array.shape[:2]
    max_side = max(img_height, img_width)

    out = 'out/'
    
    for z_lvl in range(min_zoom, max_zoom + 1):
        if not os.path.isdir(f"out/{z_lvl}"):
            os.mkdir(f"out/{z_lvl}")
        # Required size of largest side in current zoom level 
        required_side_max_zoom_lvl = tile_size * 2 ** z_lvl
        rs_max = required_side_max_zoom_lvl
        scale_percent = rs_max / max_side * 100
        width = int(img_array.shape[1] * scale_percent / 100)
        height = int(img_array.shape[0] * scale_percent / 100)
        print(f"zoom={z_lvl} w={width}, h={height}")
        dim = (width, height)
    
        # resize image
        img_resized = cv2.resize(img_array, dim, interpolation=cv2.INTER_AREA)
    
        # Find the proportional coefficient and round up it to integer
        # and our sides of picture will be proportional by tile size
        alpha_width = math.ceil(width / tile_size) * tile_size
        alpha_height = math.ceil(height / tile_size) * tile_size
        # filled square with alpha channel
        filled_square = np.zeros((alpha_height, alpha_width, 4), np.uint8)
        # Getting the centering position
        if method == 'centered':
            ax, ay = (alpha_width - img_resized.shape[1]) // 2, (alpha_height - img_resized.shape[0]) // 2
        else:
            ax, ay = 0, 0
        # Pasting the 'image' in a centering position or left-up position
        filled_square[ay:img_resized.shape[0] + ay, ax:ax + img_resized.shape[1]] = img_resized
        x, y = 0, 0
        k, l = 0, 0
        while y < alpha_height:
            while x < alpha_width:
                if not os.path.isdir(f"out/{z_lvl}/{k}"):
                    os.mkdir(f"out/{z_lvl}/{k}")
                crop = filled_square[y:y + h, x:x + w].copy()
                cv2.imwrite(f'out/{z_lvl}/{k}/{l}.png', crop)
                k += 1
                x += w
            k = 0
            l += 1
    
            x = 0
            y += h
    
if __name__ == '__main__':
    max_zoom = 5
    img = cv2.imread('./1.png', cv2.IMREAD_UNCHANGED)
    image_tailing(img, min_zoom=0, max_zoom=max_zoom, method='left-up')
    print("End of script")