const Event = require('events')
const path = require('path')
const Glob = require("glob").Glob
const fs = require('fs.extra');
const tree = require('directory-tree');

class FileManager extends Event {
  constructor (config) {
    super()
    this.allMatched = false
    this._destination = false
    this._includeFiles = []
    this._includeGlob = []
    this._cwd = false
    if (config.cwd)
      this.cwd = config.cwd
    if (config.name)
      this.name = config.name
    if (config.destination)
      this.destination = config.destination
    if (config.includes)
      this.includes = config.includes
  }
  get cwd () {
    if (this._cwd === false)
      return process.cwd()
    return this._cwd
  }
  set cwd (val) {
    this._cwd = val
  }
  get includeFiles () {
    return this._includeFiles
  }
  get treeIncludeFiles () {
    let tree = {}
    console.log(this.includeFiles)
  }
  set includes (val) {
    this._includes = val
    console.log(Array.isArray(val))
    if (Array.isArray(val)) {
      this.globIncludeFiles(val)
    }
  }
  set destination (val) {
    this._destination = val
  }
  get destination () {
    return this._destination
  }
  globIncludeFiles (includes) {
    let options = {
      cwd: this.cwd
    }
    let totalInclude = includes.length
    let i = 0
    let that = this
    for (let inc of includes) {
      this._includeGlob.push(new Glob(inc, options, function (err, files) {
        i++
        that._includeFiles.push(...files)
        that.emit('match', err, files)
        if (i === totalInclude) {
          that.emit('allMatched', that)
          that.allMatched = true
        }
      }))
    }
  }
  copyIncludeFiles (destination = this.destination, current = this.cwd) {
    let that = this
    return new Promise((resolve, reject) => {
      if (that.allMatched) {
        this.copyFiles(this.includeFiles, destination).then(() => {
          resolve()
        }).catch((e) => {
          reject(e)
        })
      } else {
        that.on('allMatched', () => {
          this.copyFiles(this.includeFiles, destination).then(() => {
            resolve()
          }).catch((e) => {
            reject(e)
          })
        })
      }
    })
  }

  copyFiles (files, dest) {
    let that = this
    let i = 0
    let totalFiles = files.length
    return new Promise((resolve, reject) => {
      if (dest) {
        for (let file of files) {
          console.log(file)
          let from = path.resolve(that.cwd, file)
          let to = path.resolve(dest, file)
          console.log(to)
          // that.exist(from).then(() => {
          //   that.copy(from, dest).then(() => {
          //     i++
          //     // console.log('coucou')
          //     if (i === totalFiles) {
          //       that.emit('successCopy')
          //     }
          //   })
          // }).catch((e) => {
          //   console.log(e)
          // })
        }
      } else {
        that.emit('error', 'No destination for copyFiles function')
        reject('No destination for copyFiles function')
      }
    })
  }

  exist (pathFile) {
    return new Promise((resolve, reject) => {
      fs.stat(pathFile, (err, stats) => {
        if (err) {
          reject(err)
        }
        console.log(err, stats)
        resolve(pathFile, stats)
      })
    })
  }


  copy (from, to) {
    let that = this
    return new Promise((resolve, reject) => {
      fs.copyRecursive(from, to, function (err) {
        if (err) {
          throw err
        }
        that.emit('copy', from, to)
        console.log('mooooove')
        resolve()
      })
    })
  }
}

module.exports = FileManager
