import sqlite3
import time
import json
import datetime
from bs4 import BeautifulSoup
import html5lib
from html5lib import sanitizer, treebuilders, treewalkers, serializer

VALID_TAGS_SUMMARY = ['p', 'div', ]
VALID_TAGS_CONTENT = ['h2', 'h3', 'h4', 'p', 'ul', 'li']
all_tags_sum = ['p', 'div']

conn = sqlite3.connect('ucozdb')
c = conn.cursor()


class dbrecord:
    # def __init__(self, id, is_puplished, title, heading, event_date,
    #              length, tag, date_published, valid_to, views, summary,
    #              price, age, content):
    #     self.id = id
    #     self.is_puplished = is_puplished
    #     self.title = title
    #     self.heading = heading
    #     self.event_date = event_date
    #     self.length = length
    #     self.tag = tag
    #     self.date_published = date_published
    #     self.valid_to = valid_to
    #     self.views = views
    #     self.summary = summary
    #     self.price = price
    #     self.age = age
    #     self.content = content
    #     return self

    def __init__(self, row):
        self.id = row[0]
        self.is_puplished = row[1]
        self.title = str(row[2])
        self.heading = str(row[3])
        self.event_date = row[4]
        self.length = row[5]
        self.tag = row[6]
        self.date_published = row[7]
        self.valid_to = row[8]
        self.views = row[9]
        self.summary = row[10]
        self.price = str(row[11])
        self.age = str(row[12])
        self.content = row[13]

    def __str__(self):
        return str([self.id,
                    self.is_puplished,
                    self.title,
                    self.heading,
                    self.event_date,
                    self.length,
                    self.tag,
                    self.date_published,
                    self.valid_to,
                    self.views,
                    self.summary,
                    self.price,
                    self.age,
                    self.content])


def read_db_data():

    c.execute('SELECT * from board')
    data = c.fetchall()

    dbdata = []

    for row in data:
        rowdata = dbrecord(row)
        dbdata.append(rowdata)

    return dbdata


def apply_to_each_in(data, function):
    for dr in data:
        function(dr)


def cleanup_html(ugly_html, valid_tags):

    soup = BeautifulSoup(ugly_html, 'lxml')

    for tag in soup.findAll(True):
        tag.attrs = {}
        if tag.name not in all_tags_sum:
            all_tags_sum.append(tag.name)
        if tag.name not in valid_tags:
            tag.hidden = True

    # clean_html = soup.renderContents()
    # clean_html = soup.prettify
    clean_html = soup

    return clean_html


def cleanup_record(dr):
    dr.summary = cleanup_html(dr.summary, VALID_TAGS_SUMMARY)
    # dr.content = cleanup_html(dr.content, VALID_TAGS_CONTENT)


dbdata = read_db_data()
new_dbdata = read_db_data()

summaries = []
contents = []

apply_to_each_in(new_dbdata, cleanup_record)

ttt = []


def testy(new_dbdata=new_dbdata):
    for dr in new_dbdata:
        soup = BeautifulSoup(dr.summary, 'lxml')
        for tag in soup.findAll(True):
            if tag.name not in all_tags_sum:
                tt = []
                tt.append(tag.name)
                tt.append(dr.id)
                ttt.append(tt)
                all_tags_sum.append(tag.name)


def jsond(new_dbdata):
    nnd = []
    for dr in new_dbdata:
        i = dict()
        i['id'] = dr.id
        i['title'] = dr.title
        i['length'] = dr.length
        i['tag'] = dr.tag
        i['age'] = dr.age
        i['summary'] = str(dr.summary)
        # i['content'] = str(dr.content)
        nnd.append(i)
    with open('ucozdb.json', 'w') as thefile:
        json.dump(nnd, thefile)


c.close()
conn.close()
