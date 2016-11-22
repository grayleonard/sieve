var assert = require('assert')
var sieve = require('../bin/sieve.js')

var objects = [
	{
	"name": "",
	"conditions": [
		{
			"class": "public relationship",
			"type": "public friends",
			"first": "x",
			"second": "y",
			"value": false
		}
	],
	"effects": [
		{
			"class": "intents",
			"type": "candid",
			"first": "x",
			"second": "y",
			"weight": 2,
			"intentDirection": true,
			"value": true
		}
	],
	"origin": "candid.json",
	"id": "candid_38"
	},
	{
	"name": "",
	"conditions": [
		{
			"class": "public relationship",
			"type": "publicly romantically committed to",
			"first": "x",
			"second": "y",
			"value": true
		}
	],
	"effects": [
		{
			"class": "intents",
			"type": "candid",
			"first": "x",
			"second": "y",
			"weight": 2,
			"intentDirection": true,
			"value": true
		}
	],
	"type": "candid",
	"origin": "candid.json",
	"id": "candid_47"
	},
]

describe('Sieve', function() {
	it('should return Sieve singleton class', function() {
		assert.equal(true, sieve instanceof Object)
	})
	it('should have DocumentStore', function() {
		assert.equal(true, typeof sieve.documentStore != undefined)
	})
})

describe('DocumentStore', function() {
	it('should be able to add an object', function() {
		assert.equal(true, sieve.documentStore.add({ added: true }))
		sieve.documentStore.reset()
	})
	it('should be able to add many objects', function() {
		assert.equal(true, sieve.documentStore.add(objects))
	})
	it('should be able to get one document', function() {
		assert.equal('object', typeof sieve.documentStore.get(0))
	})
	it('should be able to get all documents', function() {
		assert.equal(2, sieve.documentStore.get().length)
	})
	it('should be able to flatten documents', function() {
		assert.equal(true, sieve.documentStore.flatten()[0].hasOwnProperty('values'))
	})
})

describe('Search', function() {
	it('should be able to access documentStore', function() {
		assert.equal(true, sieve.search.getDocs())
	})
	it('should split query into tokens', function() {
		assert.deepEqual(['trust', 1, true], sieve.search.setQuery('trust 1 true'))
	})
	it('should search by boolean', function() {
		sieve.search.setQuery('true')
		assert.equal('object', typeof sieve.search.run())
	})
	it('should search by string', function() {
		sieve.search.setQuery('public')
		assert.equal('object', typeof sieve.search.run())
	})
	it('should search by integer', function() {
		sieve.search.setQuery('1')
		assert.equal('object', typeof sieve.search.run())
	})
	it('should search by a mix of types', function () {
		sieve.search.setQuery('public 1 true')
		assert.equal(5, sieve.search.run()[0].score)
	})
	it('should sort by score', function() {
		var res = sieve.search.run()
		assert.equal(true, res[0].score > res[1].score)
	})
})
