FROM postgres:alpine
ARG password=rootroot
ENV POSTGRES_PASSWORD=$password
ADD feedibus-database.sql /docker-entrypoint-initdb.d/
EXPOSE 5432