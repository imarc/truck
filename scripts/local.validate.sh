echo "Checking for siteRoot $(truck.envRoot)..."

if ! [ -d $(truck.envRoot) ]; then
	echo "$(truck.envRoot) does not exist."

	if ! [ -d $(truck.siteRoot) ]; then
		echo "Trying to make site root and env root..."
		mkdir -p $(truck.envRoot)
		if [ $? ]; then
			exit 1
		fi
	else
		exit 1
	fi
fi
