-- Migracja 0: Inicjalizacja rozszerzeń i bazy danych
-- Uruchamiana na projekcie Supabase w Fazie 0 / Fazie 1

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
