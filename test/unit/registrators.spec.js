'use strict'
const test = require('tape')
const sinon = require('sinon')
const EventEmitter = require('events')

function stubGlobalShortcut (unregister) {
  let shortcuts = {}
  return {
    register: (key, cb) => {
      shortcuts[key] = cb
    },
    press: (key) => {
      if (shortcuts[key]) shortcuts[key]()
    },
    unregister
  }
}

test('can register and call shortcut', t => {
  t.plan(3)
  let startTime
  const { registerShortcuts } = require('../../lib/registrators')
  const register = sinon.stub()
  register.withArgs('a').callsArg(1)
  const aSpy = sinon.spy()
  const emitter = new EventEmitter()
  let state = {
    active: false,
    shortcuts: {
      a: function () {
        startTime = new Date()
        aSpy.apply(this, arguments)
      }
    },
    globalShortcut: {
      register,
      unregister: sinon.spy()
    },
    debounceTime: 100
  }
  emitter.on('active', () => t.pass('active event emitted'))
  emitter.on('inactive', () => {
    const endTime = new Date()
    t.ok(endTime - startTime > state.debounceTime, 'debounceTime passed before inactivity')
  })
  registerShortcuts(state, emitter)
  t.ok(aSpy.calledOnce, 'first shortcut called once')
})

test('does not register and call shortcuts if state is already active', t => {
  t.plan(2)
  let startTimes = []
  const { registerShortcuts } = require('../../lib/registrators')
  const unregister = sinon.spy()
  const globalShortcut = stubGlobalShortcut(unregister)
  const emitter = new EventEmitter()
  const aSpy = sinon.spy()
  const bSpy = sinon.spy()
  let state = {
    active: true,
    shortcuts: {
      a: function () {
        startTimes.push(new Date())
        aSpy.apply(this, arguments)
      },
      b: function () {
        startTimes.push(new Date())
        bSpy.apply(this, arguments)
      }
    },
    globalShortcut,
    debounceTime: 100
  }
  registerShortcuts(state, emitter)
  globalShortcut.press('a')
  globalShortcut.press('b')
  t.ok(aSpy.notCalled, 'first unregistered call was not called')
  t.ok(bSpy.notCalled, 'second unregistered call was not called')
})

test('calling multiple shortcuts debounces inactivity', t => {
  t.plan(6)
  let startTimes = []
  const { registerShortcuts } = require('../../lib/registrators')
  const unregister = sinon.spy()
  const globalShortcut = stubGlobalShortcut(unregister)
  const emitter = new EventEmitter()
  const aSpy = sinon.spy()
  const bSpy = sinon.spy()
  let state = {
    active: false,
    shortcuts: {
      a: function () {
        startTimes.push(new Date())
        aSpy.apply(this, arguments)
      },
      b: function () {
        startTimes.push(new Date())
        bSpy.apply(this, arguments)
      }
    },
    globalShortcut,
    debounceTime: 100
  }
  emitter.on('active', () => t.pass('active event emitted'))
  emitter.on('inactive', () => {
    const endTime = new Date()
    t.ok(
      endTime - startTimes[startTimes.length - 1] > state.debounceTime,
      'last debounceTime passed before inactivity'
    )
    t.ok(aSpy.calledOnce, 'first shortcut called once')
    t.ok(bSpy.calledOnce, 'secondshortcut called once')
    t.ok(unregister.calledWith('a'), 'first shortcut unregistered')
    t.ok(unregister.calledWith('b'), 'second shortcut unregistered')
  })
  registerShortcuts(state, emitter)
  globalShortcut.press('a')
  setTimeout(() => globalShortcut.press('b'), 50)
})
