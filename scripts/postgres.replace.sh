echo "Replacing Database $(truck.postgresDB)..."

dropdb -U $(truck.postgresUser) $(truck.postgresDB)_old
assert psql -U $(truck.postgresUser) -d postgres -q -c "ALTER DATABASE $(truck.postgresDB) RENAME TO $(truck.postgresDB)_old; ALTER DATABASE $(truck.postgresDB)_pending RENAME TO $(truck.postgresDB);"
