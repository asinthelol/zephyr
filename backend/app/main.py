from fastapi import FastAPI
import uvicorn

from app.config import settings
from app.core.cors import setup_cors
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# Setup CORS
setup_cors(app)

# Include API router
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Zephyr Analytics Backend!"}
  
  
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)