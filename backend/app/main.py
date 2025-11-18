from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Zephyr Analytics Backend!"}
  
  
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)