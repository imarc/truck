shopt -s expand_aliases

assert() {
	echo "Asserting: $*"
	"$@"
	exitcode="$?"
	if [ $exitcode -ne 0 ]; then
		exit $exitcode
	fi
}
