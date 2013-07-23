echo "Dumping database $(truck.postgresSourceDB)..."
assert pg_dump -F c -U $(truck.postgresUser) $(truck.postgresSourceDB) > $(truck.tempRoot)/db.dump
assert pg_restore -U $(truck.postgresUser) -d  $(truck.postgresDB)_pending
