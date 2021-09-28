import os
import json
from pymongo import MongoClient
import time

conf = json.loads(os.environ['CONFIG'])
mongo_client = MongoClient(
    host=conf['mongodb']['host'],
    port=conf['mongodb']['port'],
    username=conf['mongodb']['username'],
    password=conf['mongodb']['password'],
    tls=conf['mongodb']['tls']
)
db = mongo_client[conf['mongodb']['database']]

def post_update(endpoint):
    db.updates.insert_one({'message': endpoint, 'initialized': time.time()})

def get_all_updates():
    items = []
    found_ids = []
    while True:
        item = db.updates.find_one()
        if item and not str(item['_id']) in found_ids:
            if item['initialized'] > time.time() - 5:
                items.append(item)
                found_ids.append(str(item['_id']))
            else:
                db.updates.delete_one({'_id': item['_id']})
        else:
            break
    return items