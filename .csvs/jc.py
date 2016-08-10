import csv

theGlobalDict = dict()

def createKeyValuePair(a_list):

    id        = str()
    title     = str()
    subtitle  = str()
    intro     = str()
    summary   = str()
    length    = str()
    imgpath   = str()

    strVals   = dict()

    id        = a_list[0]
    title     = a_list[1]
    subtitle  = a_list[2]
    intro     = a_list[3]
    summary   = a_list[4]
    imgpath   = a_list[5]
    length    = a_list[6]

    strVals['title']     = title
    strVals['subtitle']  = subtitle
    strVals['intro']     = intro
    strVals['summary']   = summary
    strVals['length']    = length
    strVals['imgpath']   = imgpath

    return (id, strVals)


def toPair(a_list):
    id = a_list.pop(0)
    n_list = [ali for ali in a_list if ali]
    return (id, n_list)

xxStrs = []

xTags = []
xDate = []
xPrix = []
xIncl = []

xBlue = []
xFees = []
xWill = []
xDtls = []

with open('strs.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xxStrs.append(createKeyValuePair(row))


with open('tags.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xTags.append(toPair(row))

with open('date.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xDate.append(toPair(row))

with open('prix.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xPrix.append(toPair(row))

with open('incl.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xIncl.append(toPair(row))



with open('blue.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xBlue.append(toPair(row))

with open('fees.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xFees.append(toPair(row))

with open('will.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xWill.append(toPair(row))

with open('dtls.csv') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        xDtls.append(toPair(row))

zTags = dict()
zDate = dict()
zPrix = dict()
zIncl = dict()
zBlue = dict()
zFees = dict()
zWill = dict()
zDtls = dict()


zTags = { az: bz for (az, bz) in xTags}
zDate = { az: bz for (az, bz) in xDate}
zPrix = { az: bz for (az, bz) in xPrix}
zIncl = { az: bz for (az, bz) in xIncl}

zBlue = { az: bz for (az, bz) in xBlue}
zFees = { az: bz for (az, bz) in xFees}
zWill = { az: bz for (az, bz) in xWill}
zDtls = { az: bz for (az, bz) in xDtls}

def finalstep():
    for i in xxStrs:
        i[1]['tags'] = zTags[i[0]]
        i[1]['dates'] = zDate[i[0]]
        i[1]['prices'] = zPrix[i[0]]
        i[1]['includes'] = zIncl[i[0]]

        i[1]['blueprint'] = zBlue[i[0]]
        i[1]['additional_fees'] = zFees[i[0]]
        i[1]['will_learn'] = zWill[i[0]]
        i[1]['details'] = zDtls[i[0]]

        theGlobalDict[i[0]] = i[1]
