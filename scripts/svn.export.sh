echo "Exporting $(truck.svn.url) to $(truck.svn.tempExport)..."

svn export -q $(truck.svn.url) $(truck.svn.tempExport)

for dir in $(truck.svn.directories); do
	cp -r $(truck.svn.tempExport)/$dir $(truck.tempRoot)/
done
