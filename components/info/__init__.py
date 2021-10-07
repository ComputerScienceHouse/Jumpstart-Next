from fastapi import APIRouter, Response
from starlette.status import *
import os, json
from pymongo import MongoClient
from logging import debug, info, warning, error, critical, exception
import time
import requests
import threading
from component_util import post_update

conf = json.loads(os.environ['CONFIG'])
mongo_client = MongoClient(
    host=conf['mongodb']['host'],
    port=conf['mongodb']['port'],
    username=conf['mongodb']['username'],
    password=conf['mongodb']['password'],
    tls=conf['mongodb']['tls']
)
db = mongo_client[conf['mongodb']['database']]

class OpenWeatherWrapper:
    def __init__(
        self, 
        api, 
        latitude, 
        longitude, 
        units='imperial', 
        update=300
    ) -> None:
        self.api = api
        self.lat = latitude
        self.lon = longitude
        self.units = units
        self.update = update
    
    def fetchLoop(self):
        while True:
            try:
                data = requests.get('https://api.openweathermap.org/data/2.5/onecall', params={
                    'lat': self.lat,
                    'lon': self.lon,
                    'exclude': 'minutely,hourly,alerts',
                    'appid': self.api,
                    'units': self.units
                }).json()
                data['record'] = 'weather'
                db.info.replace_one({'record': 'weather'}, data, upsert=True)
                post_update('info.weather')
            except:
                exception('Failed to fetch weather data: ')
            time.sleep(self.update)
    
    def start(self):
        threading.Thread(name="thread_jumpstart-next_component_info_weather", target=self.fetchLoop, daemon=True).start()
        info('Started info.weather thread')

InfoComponentRouter = APIRouter(
    prefix='/api/components/info', 
    tags=['component', 'info']
)

@InfoComponentRouter.get('/weather')
async def get_weather(r: Response):
    weather_data = db.info.find_one(filter={'record': 'weather'})
    if weather_data:
        del weather_data['_id']
        weather_data['units'] = conf['components']['info']['weather']['units']
        return {
            'result': 'success',
            'data': weather_data
        }
    else:
        r.status_code = HTTP_404_NOT_FOUND
        return {'result': 'failed: weather record not generated'}