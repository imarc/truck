if ! which svn > /dev/null; then
	echo "Unable to find 'svn' command."
	exit 1;
fi

if [ -d $(truck.svnExportDir) ]; then
	rm -r $(truck.svnExportDir)
fi
