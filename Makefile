SRC =	lib/sieve.js \
	lib/documentStore.js \
	lib/search.js \

bin/sieve.js: $(SRC)
	cat $^ > $@
	echo "module.exports = new sieve()" >> $@
