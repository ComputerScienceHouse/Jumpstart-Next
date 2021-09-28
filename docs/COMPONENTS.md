# Component Documentation
## Backend

Components should be added within their own folders within the `components` folder in the project root. At the very least, this folder should contain an `__init__.py` that contains any relevant backend code for the component. Anything that needs to be exported into the main program should be added to `components/__init__.py`, i.e. `from .info import InfoComponentRouter, OpenWeatherWrapper` or similar.

#### API Endpoints
API endpoints should be behind an APIRouter (see the [FastAPI Docs](https://fastapi.tiangolo.com/tutorial/bigger-applications/) for more info) with the route prefix `api/components/<component_name>` and tags `["component", "<component_name>"]` as shown below.
```python
InfoComponentRouter = APIRouter(
    prefix='/api/components/info', 
    tags=['component', 'info']
)
```

#### Caching Threads/Other Backend Code
Other backend code can be written as needed. A common use-case for this is to cache data from another API to MongoDB to be fetched by the website later.

**Using MongoDB**
MongoDB can be configured with the following code:
```python
import os, json
from pymongo import MongoClient

conf = json.loads(os.environ['CONFIG'])
mongo_client = MongoClient(
    host=conf['mongodb']['host'],
    port=conf['mongodb']['port'],
    username=conf['mongodb']['username'],
    password=conf['mongodb']['password'],
    tls=conf['mongodb']['tls']
)
db = mongo_client[conf['mongodb']['database']]
```

Any data should then be saved to an individual collection per the component's name, such as `db.info` or `db.calendar`. Old cached data should be removed when new data is downloaded, so as to limit storage usage.

**Using WebSocket Communication**
The website uses websockets to determine when to pull new information from the server. Backend programs should import `post_update()` from `component_util.py`. Once imported this can be used as follows:
```python
post_update('component_name.update_type')
```
This event can then be listened for on the [frontend](#using-websockets).

#### Setting Up Backend in `main.py`
Once backend code is written, it should then be added to `main.py`. All routers need to be included, and any threads that need to be started should be placed within the `__name__ != "__main__"` run guard. See `main.py` for implementation examples.

## Frontend
Adding frontend code for a component is relatively simple. In essence, you need only create a standard React component to be imported into `web/src/App.js` within `web/src/components`.

#### Using WebSockets
Components that need to listen for WebSocket events should do the following:

- Import the following: `import { updateWebSocket } from '../util';`
- Create a `useEffect` or `componentDidMount`/`componentWillUnmount` that listens for a `component_name.update_type` event on `updateWebSocket`, as shown below
```javascript
function wsListener(e) {
    console.log(e);
}
useEffect(function () {
    updateWebSocket.addEventListener('info.weather', wsListener);
    return () => updateWebSocket.removeEventListener('info.weather', wsListener);
});
```
Make sure to remove the event listener when the component unmounts.