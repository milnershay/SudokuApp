import sys
import pickle
import numpy as np
import cv2
import imutils
from keras.wrappers.scikit_learn import KerasClassifier
from sklearn.neighbors import KNeighborsClassifier
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense
from sklearn_porter import Porter


def find_cont(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 13, 20, 20)
    blur = cv2.GaussianBlur(bfilter, (9, 9), 9)
    thresh = cv2.adaptiveThreshold(blur, 255, 1, 1, 11, 2)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    return contours, thresh


def get_board(img, conts):
    cont = sorted(conts, key=cv2.contourArea, reverse=True)[:15]
    for contour in cont:
        approx = cv2.approxPolyDP(contour, 100, True)
        if len(approx) == 4:
            location = approx
            break
    pts1 = np.float32([location[0], location[3], location[1], location[2]])
    pts2 = np.float32([[0, 0], [900, 0], [0, 900], [900, 900]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    result = cv2.warpPerspective(img, matrix, (900, 900))
    result = cv2.rotate(result, cv2.ROTATE_90_CLOCKWISE)
    return result


cv2.namedWindow("norm", cv2.WINDOW_NORMAL)
samples = np.loadtxt('Data/samples.data', np.float32)
responses = np.loadtxt('Data/respones.data', np.float32)
model = KNeighborsClassifier()
model.fit(samples, responses)

porter = Porter(model, language='js')
output = porter.export(embed_data=True)
with open('knn_model.js', 'wb') as f:
    pickle.dump(output, f   )

img = cv2.imread('test data\img_0880.heic')
conts, _ = find_cont(img)
board = get_board(img, conts)

conts, thresh = find_cont(board)
for cnt in conts:
    if 100 < cv2.contourArea(cnt) < 2000:
        [x, y, w, h] = cv2.boundingRect(cnt)
        if 28 < h < 80 and w > 11:
            cv2.rectangle(board, (x, y), (x + w, y + h), (0, 255, 0), -1)
            roi = thresh[y:y + h, x:x + w]
            roismall = cv2.resize(roi, (10, 10))
            roismall = roismall.reshape((1, 100))
            roismall = np.float32(roismall)
            print(roismall)
            num = model.predict(roismall)
            n_string = str(int(num))
            cv2.putText(board, n_string, (x, y + h), 2, 2, (0, 0, 0))

cv2.imshow('norm', board)
cv2.waitKey(0)
