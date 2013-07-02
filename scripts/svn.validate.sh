if ! which svn > /dev/null; then
	echo "Unable to find 'svn' command."
	exit 1;
fi

if [ -d $(truck.svn.tempExport) ]; then
	rm -r $(truck.svn.tempExport)
fi
