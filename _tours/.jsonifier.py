import csv

def createKeyValuePair(srt1, str2, str3, str4, str5, str6, str7):

    id        = str()
    title     = str()
    subtitle  = str()
    intro     = str()
    summary   = str()
    length    = str()
    imgpath   = str()

    strVals   = dict()

    id        = str1
    title     = str2
    subtitle  = str3
    intro     = str4
    summary   = str5
    length    = str6
    imgpath   = str7

    strVals['title']     = title
    strVals['subtitle']  = subtitle
    strVals['intro']     = intro
    strVals['summary']   = summary
    strVals['length']    = length
    strVals['imgpath']   = imgpath

    return (id, strVals)


keyValTupleList = []

with open('csvv.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        keyValTupleList.append(createKeyValuePair(row))











