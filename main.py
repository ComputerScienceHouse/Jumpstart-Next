from re import M
from fastapi import FastAPI, requests, WebSocket, WebSocketDisconnect
from fastapi import APIRouter, Response, Request
from fastapi.responses import FileResponse
import time
import os
import asyncio
import json
import logging
from typing import List
from logging import debug, info, warning, error, critical, exception
from datetime import datetime

from starlette.status import HTTP_404_NOT_FOUND

with open(os.path.join("config", "config.json"), "r") as f:
    CONFIG = json.load(f)
os.environ["CONFIG"] = json.dumps(CONFIG)

THEME_OVERRIDE = {"value": None, "reset": 0}

from components import *
from component_util import get_all_updates

if __name__ != "__main__":
    logging.basicConfig(
        format=CONFIG["logging"]["format"],
        level=logging.getLevelName(CONFIG["logging"]["level"].upper()),
    )

    # Load component util classes
    component_infoWeatherWrapper = OpenWeatherWrapper(
        CONFIG["components"]["info"]["weather"]["key"],
        CONFIG["components"]["info"]["weather"]["lat"],
        CONFIG["components"]["info"]["weather"]["lon"],
        units=CONFIG["components"]["info"]["weather"]["units"],
        update=CONFIG["components"]["info"]["weather"]["update"],
    )

    # Start component threads
    component_infoWeatherWrapper.start()

    component_calendarEventWrapper = CalendarWrapper()

    # Start component threads
    component_infoWeatherWrapper.start()
    component_calendarEventWrapper.start()


async def clean_shutdown():
    logging.info("Performing clean shutdown.")
    component_calendarEventWrapper.kill()
    component_infoWeatherWrapper.kill()


app = FastAPI(on_shutdown=[clean_shutdown])
r = APIRouter(prefix="/api")


@r.get("/")
async def get_root():
    return {"time": time.ctime()}


@app.websocket("/api/ws")
async def event_socket(ws: WebSocket):
    print(ws)
    await ws.accept()
    try:
        processed_ids = []
        while True:
            messages = get_all_updates()
            if len(messages) > 0:
                for m in messages:
                    if not str(m["_id"]) in processed_ids:
                        processed_ids.append(str(m["_id"]))
                        if len(processed_ids) > 15:
                            del processed_ids[0]
                        del m["_id"]
                        try:
                            await ws.send_json(m)
                        except:
                            warning("Unexpected WS disconnect.")
            await asyncio.sleep(CONFIG["event_stream_wait"])
    except WebSocketDisconnect:
        await ws.close()
        print(ws)


def get_theme():
    if THEME_OVERRIDE["reset"] > time.time():
        return THEME_OVERRIDE["value"]
    dt = datetime.fromtimestamp(time.time())
    if dt.hour > 23 or dt.hour < 7:
        return "base_dark"
    else:
        return "base_light"


@r.get("/themes/style")
async def get_theme_style(response: Response):
    name = get_theme()
    if os.path.exists(os.path.join("themes", name)):
        with open(os.path.join("themes", name, "style.json"), "r") as f:
            return json.load(f)
    else:
        response.status_code = HTTP_404_NOT_FOUND
        return {"result": "failure"}


@r.get("/themes/logo")
async def get_theme_logo(response: Response):
    name = get_theme()
    if os.path.exists(os.path.join("themes", name)):
        return FileResponse(os.path.join("themes", name, "logo.svg"))
    else:
        response.status_code = HTTP_404_NOT_FOUND
        return {"result": "failure"}


@r.post("/themes/set/{name}")
async def set_theme_override(name: str):
    global THEME_OVERRIDE
    THEME_OVERRIDE = {"value": name, "reset": time.time() + 30}
    return {}


app.include_router(r)
app.include_router(InfoComponentRouter)
app.include_router(CalendarComponentRouter)
app.include_router(AnnouncementComponentRouter)
