from fastapi import APIRouter, Response
from starlette.status import *
import os, json
from pymongo import MongoClient
from logging import debug, info, warning, error, critical, exception
import time
import requests
import threading
from component_util import post_update
import datetime

conf = json.loads(os.environ['CONFIG'])
mongo_client = MongoClient(
    host=conf['mongodb']['host'],
    port=conf['mongodb']['port'],
    username=conf['mongodb']['username'],
    password=conf['mongodb']['password'],
    tls=conf['mongodb']['tls']
)
db = mongo_client[conf['mongodb']['database']]

class CalendarWrapper:
    def __init__(
        self, 
        update=30,
        records=25
    ) -> None:
        self.update = update
        self.records = records
    
    def fetchLoop(self):
        while True:
            try:
                data = requests.get('https://calendar.csh.rit.edu/events/upcoming', params={'number': self.records}).json()
                
                for d in data:
                    d['startsIn'] = {
                        'days': (datetime.datetime.fromtimestamp(d['start']['timestamp']) - datetime.datetime.fromtimestamp(time.time())).days,
                        'hours': (datetime.datetime.fromtimestamp(d['start']['timestamp']) - datetime.datetime.fromtimestamp(time.time())).seconds // 3600,
                        'minutes': (datetime.datetime.fromtimestamp(d['start']['timestamp']) - datetime.datetime.fromtimestamp(time.time())).seconds // 60,
                    }
                
                data = {
                    'events': data,
                    'record': 'events'
                }
                db.calendar.replace_one({'record': 'events'}, data, upsert=True)
                post_update('calendar.events')
            except:
                exception('Failed to fetch event data: ')
            time.sleep(self.update)
    
    def start(self):
        threading.Thread(name="thread_jumpstart-next_component_calendar_events", target=self.fetchLoop, daemon=True).start()
        info('Started calendar.events thread')

CalendarComponentRouter = APIRouter(
    prefix='/api/components/calendar', 
    tags=['component', 'calendar']
)

@CalendarComponentRouter.get('/events')
async def get_events(r: Response):
    event_data = db.calendar.find_one(filter={'record': 'events'})
    if event_data:
        return {
            'result': 'success',
            'data': event_data['events']
        }
    else:
        r.status_code = HTTP_404_NOT_FOUND
        return {'result': 'failed: event record not generated'}