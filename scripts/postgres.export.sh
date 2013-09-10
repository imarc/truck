echo "Dumping database $(truck.postgresSourceDB)..."
assert pg_dump -F c -U $(truck.postgresUser) $(truck.postgresSourceDB) -f $(truck.tempRoot)/db.dump

dropdb -U $(truck.postgresUser) $(truck.postgresDB)_pending
assert createdb -U $(truck.postgresUser) $(truck.postgresDB)_pending
assert pg_restore -U $(truck.postgresUser) -d $(truck.postgresDB)_pending $(truck.tempRoot)/db.dump
