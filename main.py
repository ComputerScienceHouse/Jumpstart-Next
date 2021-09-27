from fastapi import FastAPI
from fastapi import APIRouter
import time
import os
import json
import logging

with open(os.path.join('config', 'config.json'), 'r') as f:
    CONFIG = json.load(f)
os.environ['CONFIG'] = json.dumps(CONFIG)

from components import *

if __name__ != '__main__':
    logging.basicConfig(format=CONFIG['logging']['format'],
                        level=logging.getLevelName(CONFIG['logging']['level'].upper()))
    
    # Load component util classes
    component_infoWeatherWrapper = OpenWeatherWrapper(
        CONFIG['components']['info']['weather']['key'],
        CONFIG['components']['info']['weather']['lat'],
        CONFIG['components']['info']['weather']['lon'],
        units=CONFIG['components']['info']['weather']['units'],
        update=CONFIG['components']['info']['weather']['update']
    )

    # Start component threads
    component_infoWeatherWrapper.start()

app = FastAPI()
r = APIRouter(
    prefix='/api'
)

@r.get('/')
async def get_root():
    return {'time': time.ctime()}

app.include_router(r)
app.include_router(InfoComponentRouter)