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

class OpenFoodWrapper:    
    def __init__(self, update=300) -> None:
        self.update = update

    def start(self):
        threading.Thread(name="thread_jumpstart-next_component_dining-density_food", target=self.fetchLoop, daemon=True).start()
        info('Started dining-density.food thread')

    def fetchLoop(self):
        while True:
            try:
                data = requests.get('https://maps.rit.edu/proxySearch/densityMap.php').json()['busyness']
                data = data[:17] # Food places are from 0-16, unfortunate hardcoding...update later
                for i in range(len(data)): 
                    data[i] = data[i]['properties']
                    data[i]['pct_full'] = int(100*data[i]['count']/data[i]['max_occ'])
                    data[i].pop("mdo_id")                    
                    data[i].pop("open_status")
                    data[i].pop("max_occ")      
                # data is now like this
                # {0: {"name": name, "count": count, "pct_full": pct_full}, 1: ...}
                data = {
                    'data': data,
                    'record': 'food'
                }
                db.dining_density.replace_one({'record': 'food'}, data, upsert=True)
                post_update('dining-density.food')
            except:
                exception('Failed to fetch food data: ')
            time.sleep(self.update)

"""    @app.get('/api/food')
    async def get_food():
        try:
            food_response = requests.get("http://api.open-notify.org/astros.json")
            # later implementation of hours: hours_response = requests.get("http://api.open-notify.org/astros.json")
            busyness = response.json().busyness
            data = [[]]
            for i in range(16):
                data[0][loc] = busyness.properties.name
                data[1][loc] = busyness.properties.count
                data[2][loc] = busyness.properties.max_occ
            return {"busyness": data}    
        catch Exception as e:
            print("Food Api Request Failed. Error: " + str(e))
            return {"message": "error"} """

DiningDensityComponentRouter = APIRouter(
    prefix='/api/components/dining-density', 
    tags=['component', 'dining-density']        
)

@DiningDensityComponentRouter.get('/food')
async def get_food(r: Response):
    food_data = db.dining_density.find_one(filter={'record': 'food'})
    if food_data:
        del food_data['_id']
        return {
            'result': 'success',
            'data': food_data
        }
    else:
        r.status_code = HTTP_404_NOT_FOUND
        return {'result': 'failed: food record not generated'}