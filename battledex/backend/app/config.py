from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "BattleDex"
    pokeapi_base_url: str = "https://pokeapi.co/api/v2"


settings = Settings()
