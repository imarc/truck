echo "Exporting $(truck.svnUrl) to $(truck.svnExportDir)..."

assert svn export -q $(truck.svnUrl) $(truck.svnExportDir)

if [ ! -d $(truck.tempRoot) ]; then
	mkdir $(truck.tempRoot)
fi

for dir in $(truck.svnDirectories); do
	assert cp -r $(truck.svnExportDir)/$dir $(truck.tempRoot)/$dir
done
