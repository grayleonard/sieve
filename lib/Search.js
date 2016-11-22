sieve.Search = function(ctx) {
	this.sieve = ctx
}

sieve.Search.prototype.getDocs = function() {
	if(typeof this.sieve.documentStore.documents !== 'undefined')
		return true
	return false
}

sieve.Search.prototype.setQuery = function(query) {
	this.tokens = query.split(' ').map(function(t) {
		if(t == 'true' || t == 'false') //boolean check
			return !!t
		if(Number.isInteger(+t)) { // integer check
			return +t
		}
		return t
	})
	return this.tokens
}

sieve.Search.prototype.run = function() {
	var self = this
	var idx = this.sieve.documentStore.flatten()
	this.tokens.forEach(function(t) {
		idx = self.searchByTokenType(t, idx)
	})
	return idx
}

sieve.Search.prototype.searchByTokenType = function(token, idx) {
	var tmp = idx
	tmp = this.scoreByType(token, tmp)
	return tmp
}

sieve.Search.prototype.mapByType = function(token, idx) {
	var tmp = JSON.parse(JSON.stringify(idx))
	for(var o in tmp) {
		tmp[o].values = tmp[o].values.filter(function(v) {
			return typeof v === typeof token
		})
	}
	return tmp
}

sieve.Search.prototype.scoreByType = function(t, idx) {
	if(typeof t == 'boolean') //boolean check
		return this.booleanScore(t, idx)
	if(Number.isInteger(+t)) { // integer check
		return this.integerScore(t, idx)
	}
	return this.stringScore(t, idx)
}

sieve.Search.prototype.booleanScore = function(t, idx) {
	var tmp = this.mapByType(t, idx)
	for(var o in tmp) {
		tmp[o].values.forEach(function(v) {
			if(v === t)
				idx[o].score += 1
		})
	}
	return idx
}

sieve.Search.prototype.integerScore = function(t, idx) {
	return idx
}

sieve.Search.prototype.stringScore = function(t, idx) {
	var idx = idx
	var tmp = this.mapByType(t, idx)
	for(var o in tmp) {
		tmp[o].values.forEach(function(v) {
			if(v.indexOf(t) > -1)
				idx[o].score += 1
		})
	}
	return idx
}

