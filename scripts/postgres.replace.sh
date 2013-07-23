echo "Replacing Database $(truck.postgresDB)..."
assert psql -U $(truck.postgresUser) -d postgres -q -c "ALTER DATABASE $(truck.postgresDB) RENAME TO $(truck.postgresDB)_old; ALTER DATABASE $(truck.postgresDB)_pending RENAME TO $(truck.postgresDB);"
