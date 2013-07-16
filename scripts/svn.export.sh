echo "Exporting $(truck.svnUrl) to $(truck.svnExportDir)..."

svn export -q $(truck.svnUrl) $(truck.svnExportDir)

for dir in $(truck.svnDirectories); do
	echo "Copying $dir..."
	cp -r $(truck.svnExportDir)/$dir $(truck.tempRoot)/
done
