from fastapi import FastAPI, requests, WebSocket, WebSocketDisconnect
from fastapi import APIRouter, Response, Request
import time
import os
import asyncio
import json
import logging
from typing import List
from logging import debug, info, warning, error, critical, exception

with open(os.path.join('config', 'config.json'), 'r') as f:
    CONFIG = json.load(f)
os.environ['CONFIG'] = json.dumps(CONFIG)

from components import *
from component_util import get_all_updates

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

    component_DiningDensityFoodWrapper = OpenFoodWrapper(
        update=CONFIG['components']['dining_density']['update']
    )

    # Start component threads
    component_infoWeatherWrapper.start()

    component_DiningDensityFoodWrapper.start()


app = FastAPI()
r = APIRouter(
    prefix='/api'
)

@r.get('/')
async def get_root():
    return {'time': time.ctime()}

@app.websocket('/api/ws')
async def event_socket(ws: WebSocket):
    print(ws)
    await ws.accept()
    try:
        processed_ids = []
        while True:
            messages = get_all_updates()
            if len(messages) > 0:
                for m in messages:
                    if not str(m['_id']) in processed_ids:
                        processed_ids.append(str(m['_id']))
                        if len(processed_ids) > 15:
                            del processed_ids[0]
                        del m['_id']
                        try:
                            await ws.send_json(m)
                        except:
                            warning('Unexpected WS disconnect.')
            await asyncio.sleep(CONFIG['event_stream_wait'])
    except WebSocketDisconnect:
        await ws.close()
        print(ws)

    

app.include_router(r)
app.include_router(InfoComponentRouter)
app.include_router(DiningDensityComponentRouter)