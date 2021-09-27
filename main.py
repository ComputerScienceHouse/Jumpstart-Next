from fastapi import FastAPI
from fastapi import APIRouter
import time

app = FastAPI()
r = APIRouter(
    prefix='/api'
)

@r.get('/')
async def get_root():
    return {'time': time.ctime()}

app.include_router(r)