#!/bin/bash
set -e

# Cria usuários com senhas vindas do ambiente
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER operador WITH PASSWORD '${OPERADOR_PASSWORD}';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO operador;
    GRANT USAGE ON SCHEMA public TO operador;
    GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO operador;

    CREATE USER consultor WITH PASSWORD '${CONSULTOR_PASSWORD}';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO consultor;
    GRANT USAGE ON SCHEMA public TO consultor;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO consultor;
EOSQL
