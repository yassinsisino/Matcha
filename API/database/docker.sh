# container de la  base de donnee
docker run --name dbmatcha -e POSTGRES_USER=user -e POSTGRES_DB=matcha -p 5432:5432 -d postgres
# visualisateur de base de donnee
docker run --name pgadmin -e 'PGADMIN_DEFAULT_EMAIL=user@domain.com' -e 'PGADMIN_DEFAULT_PASSWORD=SuperSecret' -p 80:80 -d dpage/pgadmin4