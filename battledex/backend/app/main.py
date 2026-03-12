from fastapi import FastAPI

app = FastAPI(
    title="BattleDex API",
    description="Pokemon battle analysis and counter recommendation API",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "battledex-api"}
