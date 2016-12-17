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
  const cancel = opts.cancel || 'Esc'
  assert(cancel !== leader, 'leader and cancel shortcuts cannot be identical')
  assert(validate.isInteger(debounceTime), 'debounceTime must be an integer')
  assert(validate.isString(cancel) || validate.isInteger(cancel), 'invalid cancelShortcut')
  let state = {
    globalShortcut,
    leader,
    cancel,
    debounceTime,
    shortcuts: {},
    timer: null,
    active: false
  }
  globalShortcut.register(leader, () => registerShortcuts(state))
  globalShortcut.register(cancel, () => {
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
  const methods = Object.assign({}, emitterMethods, {
    register: function (shortcut, cb) {
      state.shortcuts[shortcut] = cb
    }
  })
  return Object.defineProperties(methods, {
    leader: {
      get: () => state.leader,
      set: (val) => {
        assert(validate.isString(leader) || validate.isInteger(leader), 'invalid leader key')
        assert(val !== state.cancel, 'leader and cancel shortcuts cannot be identical')
        globalShortcut.unregister(state.leader)
        globalShortcut.register(val, () => registerShortcuts(state))
        state.leader = val
      }
    },
    cancel: {
      get: () => state.cancel,
      set: (val) => {
        assert(validate.isString(cancel) || validate.isInteger(cancel), 'invalid cancelShortcut')
        assert(val !== state.leader, 'leader and cancel shortcuts cannot be identical')
        globalShortcut.unregister(state.cancel)
        globalShortcut.register(val, () => registerShortcuts(state))
        state.cancel = val
      }
    },
    debounceTime: {
      get: () => state.debounceTime,
      set: (val) => {
        state.debounceTime = val
      }
    },
    shortcuts: {
      get: () => state.shortcuts,
      set: (val) => { throw new Error('use the register method to set shortcuts') }
    }
  })
}
