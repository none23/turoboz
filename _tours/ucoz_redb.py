import sqlite3
import time
import datetime

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
        self.title = row[2]
        self.heading = row[3]
        self.event_date = row[4]
        self.length = row[5]
        self.tag = row[6]
        self.date_published = row[7]
        self.valid_to = row[8]
        self.views = row[9]
        self.summary = row[10]
        self.price = row[11]
        self.age = row[12]
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

def apply_to_each_in(dbdata, function):
    for dr in dbdata:
        function(dr)

def cleanup_dr_field(dr, field):
    dr_f = dr.field
    new_dr_f =

    dr.field = new_dr_f


dbdata = read_db_data()
print(dbdata)

c.close()
conn.close()
