import logging
from fastapi import APIRouter, Response
from starlette.status import *
import os, json
from pymongo import MongoClient
from logging import debug, info, warning, error, critical, exception
from component_util import post_update
from pydantic import BaseModel
from typing import Any

conf = json.loads(os.environ['CONFIG'])
mongo_client = MongoClient(
    host=conf['mongodb']['host'],
    port=conf['mongodb']['port'],
    username=conf['mongodb']['username'],
    password=conf['mongodb']['password'],
    tls=conf['mongodb']['tls']
)
db = mongo_client[conf['mongodb']['database']]

AnnouncementComponentRouter = APIRouter(
    prefix='/api/components/announcements', 
    tags=['component', 'announcements']
)

class PostMessageModel(BaseModel):
    body: dict
    api_key: str

@AnnouncementComponentRouter.post('/message')
async def post_message(model: PostMessageModel, response: Response):
    logging.debug(f'Attempt to post message with key {model.api_key}')
    if model.api_key in conf['components']['announcements']['keys']:
        logging.debug(model.body)
        db.announcements.replace_one(
            filter={'record': 'announcement'}, 
            replacement={'record': 'announcement', 'message': model.body}, 
            upsert=True
        )
        info('New message posted.')
        post_update('announcement.message')
        return {'result': 'success'}
    else:
        response.status_code = HTTP_403_FORBIDDEN
        return {'result': 'failed', 'reason': f'Invalid API key {model.api_key}'}

@AnnouncementComponentRouter.get('/message')
async def get_message(response: Response):
    record = db.announcements.find_one(filter={'record': 'announcement'})
    if record:
        return record['message']
    else:
        response.status_code = HTTP_404_NOT_FOUND
        return {'result': 'failed', 'reason': 'No message posted.'}