FROM postgres:16

# Copia os scripts SQL para o container
COPY init-db/ /docker-entrypoint-initdb.d/

# Define o encoding e timezone (opcional)
ENV POSTGRES_INITDB_ARGS="--encoding=UTF8 --locale=C"

COPY init-db/ /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh