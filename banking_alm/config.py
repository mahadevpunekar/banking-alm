from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Local default: file SQLite (no Postgres required). Override with PostgreSQL for production.
    database_url: str = "sqlite+aiosqlite:///./banking_alm_local.db"
    app_name: str = "Banking ALM"
    # Comma-separated origins for React (Vite default: http://localhost:5173)
    cors_origins: str = "http://localhost:5173"


def get_settings() -> Settings:
    return Settings()
