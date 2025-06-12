# Utiliser l'image officielle MySQL
FROM mysql:9.2

# Copier les fichiers SQL dans le dossier d'initialisation de MySQL
COPY ./sql-files/ /docker-entrypoint-initdb.d/

# Exposer le port standard de MySQL
EXPOSE 3306
