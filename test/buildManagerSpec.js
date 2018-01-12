let Io = require('../bin/lib/Io') 
let CP = require('child_process')
let FM = require('../bin/lib/FileManager.js')
var chai = require('chai') 
var path = require('path') 
let { resolve, parse, normalize } = path 
let { existsSync } = require('fs') 
var expect = chai.expect 
var should = chai.should 

describe('File Manager Class', () => {
  let DefaultInit
  describe('#constructor()', () => {
    DefaultInit = new FM()
    it('Should init well without config', () => {
      expect(DefaultInt)
    })
  })
})