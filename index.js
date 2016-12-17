'use strict'

const assert = require('assert')
const validate = require('validate.js')
const EventEmitter = require('events')
const { registerShortcuts, unregisterShortcuts } = require('./lib/registrators')

module.exports = function ShortE (globalShortcut, leader, opts = {}) {
  assert(validate.isObject(globalShortcut), 'malformed globalShortcut object')
  assert(validate.isFunction(globalShortcut.register), 'malformed globalShortcut object')
  assert(validate.isFunction(globalShortcut.unregister), 'malformed globalShortcut object')
  assert(validate.isString(leader) || validate.isInteger(leader), 'invalid leader key')
  const debounceTime = opts.debounceTime || 0
  const cancel = validate.isDefined(opts.cancel) ? opts.cancel : 'Esc'
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
  const emitter = new EventEmitter()
  const emitterMethods = Object.keys(EventEmitter.prototype).reduce((methods, key) => {
    if (typeof EventEmitter.prototype[key] === 'function') {
      methods[key] = emitter[key]
    }
    return methods
  }, {})
  const methods = Object.assign({}, emitterMethods, {
    register: function (shortcut, cb) {
      assert(
        validate.isString(shortcut) ||
        validate.isInteger(shortcut),
        'invalid shortcut key'
      )
      assert(
        validate.isFunction(cb),
        'invalid callback function'
      )
      state.shortcuts[shortcut] = cb
    }
  })
  globalShortcut.register(leader, () => registerShortcuts(state, emitter))
  globalShortcut.register(cancel, () => {
    clearTimeout(state.timer)
    unregisterShortcuts(state, emitter)
  })
  return Object.defineProperties(methods, {
    leader: {
      get: () => state.leader,
      set: (val) => {
        assert(validate.isString(val) || validate.isInteger(val), 'invalid leader key')
        assert(val !== state.cancel, 'leader and cancel shortcuts cannot be identical')
        globalShortcut.unregister(state.leader)
        globalShortcut.register(val, () => registerShortcuts(state, emitter))
        state.leader = val
      }
    },
    cancel: {
      get: () => state.cancel,
      set: (val) => {
        assert(validate.isString(val) || validate.isInteger(val), 'invalid cancel shortcut')
        assert(val !== state.leader, 'leader and cancel shortcuts cannot be identical')
        globalShortcut.unregister(state.cancel)
        globalShortcut.register(val, () => registerShortcuts(state, emitter))
        state.cancel = val
      }
    },
    debounceTime: {
      get: () => state.debounceTime,
      set: (val) => {
        assert(validate.isInteger(val), 'debounceTime must be an integer')
        state.debounceTime = val
      }
    },
    shortcuts: {
      get: () => Object.assign({}, state.shortcuts)
    },
    active: {
      get: () => state.active
    }
  })
}
