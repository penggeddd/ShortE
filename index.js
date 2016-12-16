'use strict'

const assert = require('assert')
const validate = require('validate.js')
const EventEmitter = require('events')

function debounce (state, cb, debounceTime) {
  cb()
  clearTimeout(state.timer)
  state.timer = setTimeout(() => unregisterShortcuts(state), debounceTime)
}

function registerShortcuts (state) {
  if (!state.active) {
    state.emit('active')
    state.active = true
    Object.keys(state.shortcuts).forEach(keyCombo => {
      state.globalShortcut.register(`${keyCombo}`, () => debounce(state, state.shortcuts[keyCombo], state.debounceTime))
    })
  }
}

function unregisterShortcuts (state) {
  if (state.active) {
    state.emit('inactive')
    state.active = false
    Object.keys(state.shortcuts).forEach(keyCombo => {
      state.globalShortcut.unregister(keyCombo)
    })
  }
}

module.exports = function ShortE (globalShortcut, leader, opts = {}) {
  assert(validate.isObject(globalShortcut), 'malformed globalShortcut object')
  assert(validate.isFunction(globalShortcut.register), 'malformed globalShortcut object')
  assert(validate.isFunction(globalShortcut.unregister), 'malformed globalShortcut object')
  assert(validate.isString(leader) || validate.isInteger(leader), 'invalid leader key')
  const debounceTime = opts.debounceTime || 0
  const cancelShortcut = opts.cancelShortcut || 'Esc'
  assert(validate.isInteger(debounceTime), 'debounceTime must be an integer')
  assert(validate.isString(cancelShortcut) || validate.isInteger(cancelShortcut), 'invalid cancelShortcut')
  let state = {
    globalShortcut,
    leader,
    debounceTime,
    shortcuts: {},
    timer: null,
    active: false
  }
  globalShortcut.register(leader, () => registerShortcuts(state))
  globalShortcut.register(cancelShortcut, () => {
    clearTimeout(state.timer)
    unregisterShortcuts(state)
  })
  const emitter = new EventEmitter()
  const emitterMethods = Object.keys(EventEmitter.prototype).reduce((methods, key) => {
    if (typeof EventEmitter.prototype[key] === 'function') {
      methods[key] = emitter[key]
    }
    return methods
  }, {})
  return Object.assign(state, emitterMethods, {
    register: function (shortcut, cb) {
      state.shortcuts[shortcut] = cb
    },
    leader: function (newLeader) {
      globalShortcut.unregister(leader)
      globalShortcut.register(newLeader, () => registerShortcuts(state))
      state.leader = newLeader
    },
    debounceTimer: function (newTime) {
      state.debounceTime = newTime
    }
  })
}
