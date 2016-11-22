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
