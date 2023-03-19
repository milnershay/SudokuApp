import sys
import numpy as np 
import cv2
import imutils
from sklearn.neighbors import KNeighborsClassifier
import tensorflow as tf


def find_cont(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 13, 20, 20)
    edged = cv2.Canny(bfilter, 30, 180)
    blur = cv2.GaussianBlur(bfilter, (9,9), 9)
    thresh = cv2.adaptiveThreshold(blur, 255,1,1,11,2)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    return contours, thresh


def get_board(img, conts):
    cont = sorted(conts, key=cv2.contourArea, reverse=True) [:15]
    for contour in cont:
        approx = cv2.approxPolyDP(contour, 100, True)
        if len(approx) == 4:
            location = approx
            break
    pts1 = np.float32([location[0], location[3], location[1], location[2]])
    pts2 = np.float32([[0,0], [900, 0], [0, 900], [900,900]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    result = cv2.warpPerspective(img, matrix, (900,900))
    result = cv2.rotate(result, cv2.ROTATE_90_CLOCKWISE)
    return result




cv2.namedWindow("norm", cv2.WINDOW_NORMAL)
loc = 'training data'
images = ['\img_0881.heic', '\img_0882.heic', '\img_0883.heic', '\img_0884.heic', '\img_0885.heic', '\img_0892.heic']
samples = np.empty((0,100))
responses = []
for cur in images:
    img = cv2.imread(loc+cur)
    contours, _ = find_cont(img)
    cont = sorted(contours, key=cv2.contourArea, reverse=True) [:15]
    for contour in cont:
        approx = cv2.approxPolyDP(contour, 100, True)
        if len(approx) == 4:
            location = approx
            break
    pts1 = np.float32([location[0], location[3], location[1], location[2]])
    pts2 = np.float32([[0,0], [900, 0], [0, 900], [900,900]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    result = cv2.warpPerspective(img, matrix, (900,900))
    result = cv2.rotate(result, cv2.ROTATE_90_CLOCKWISE)

    keys = [i for i in range(48,58)]

    contours, thresh = find_cont(result)

    for cnt in contours:
        if cv2.contourArea(cnt) > 100 and cv2.contourArea(cnt) < 2500:
            [x,y,w,h] = cv2.boundingRect(cnt)
            if h>28 and w>11 and h<90:
                cv2.rectangle(result,(x,y), (x+w,y+h),(0,0,255),2)
                roi = thresh[y:y+h,x:x+w]
                roismall = cv2.resize(roi,(10,10))
                cv2.imshow("norm", result)
                key = cv2.waitKey(0)

                if key == 27:
                    sys.exit()
                elif key in keys:
                    responses.append(int(chr(key)))
                    sample = roismall.reshape((1,100))
                    samples = np.append(samples, sample,0)
responses = np.array(responses,np.float32)
samples = np.array(samples, np.float32)

model = KNeighborsClassifier()
model.fit(samples, responses)
print("training complete")



