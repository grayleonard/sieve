var sieve = function() {
	this.documentStore = new sieve.DocumentStore()
	this.search = new sieve.Search(this)
}

sieve.DocumentStore = function(docs) {
	this.documents = docs || []
}

sieve.DocumentStore.prototype.add = function(obj) {
	var self = this
	if(Array.isArray(obj)) {
		obj.forEach(function(o) {
			self.documents.push(o)
		})
	} else
		self.documents.push(obj)
	return true
}

sieve.DocumentStore.prototype.get = function() {
	var args = arguments
	if(args.length)
		return this.documents[args[0]]
	return this.documents
}

sieve.DocumentStore.prototype.reset = function() {
	this.documents = []
}

sieve.DocumentStore.prototype.flatten = function() {
	var self = this
	self.flattened = []
	var traverse = function(o, tmp) {
		var tmp = tmp || { keys: [], values: [] }
		for(var i in o) {
			tmp.keys.push(i)
			if(typeof o[i] == 'object') {
				traverse(o[i], tmp)
			} else if(o[i] !== '')
				tmp.values.push(o[i])
		}
		return tmp
	}
	this.documents.forEach(function(doc) {
		var traversed = traverse(doc)
		traversed.original = doc
		traversed.uuid = self.generateID()
		traversed.score = 0
		self.flattened.push(traversed)
	})
	return self.flattened
}

sieve.DocumentStore.prototype.generateID = function() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}
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
	return idx.sort(function(a, b) {
		return +b.score - +a.score
	})
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

module.exports = new sieve()
