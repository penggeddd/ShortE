'use strict'
const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const ShortE = require('../../')

function stubShortE (registerShortcuts, unregisterShortcuts) {
  return proxyquire('../../', {
    './lib/registrators': {
      registerShortcuts, unregisterShortcuts
    }
  })
}

test('setting leader changes leader in state, unregisters old leader and registers new', t => {
  t.plan(4)
  const register = sinon.stub()
  register.withArgs('Ctrl+B').callsArg(1)
  const globalShortcut = {register, unregister: sinon.spy()}
  const registerShortcuts = sinon.spy()
  const unregisterShortcuts = sinon.spy()
  const ShortE = stubShortE(registerShortcuts, unregisterShortcuts)
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  shortcuts.leader = 'Ctrl+B'
  t.ok(globalShortcut.unregister.calledWith('Ctrl+A'), 'old leader unregistered')
  t.ok(globalShortcut.register.calledWith('Ctrl+B'), 'new leader registered')
  t.ok(registerShortcuts.calledOnce, 'calling new leader registers shortcuts')
  t.equal(shortcuts.leader, 'Ctrl+B', 'new leaderShortcut placed in state')
})

test('setting leader - bad parameters', t => {
  t.plan(2)
  const globalShortcut = {register: sinon.spy(), unregister: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500, cancel: 'Ctrl+B'})
  t.throws(
    () => { shortcuts.leader = {} },
    /invalid leader key/,
    'cannot set leader key to object'
  )
  t.throws(
    () => { shortcuts.leader = 'Ctrl+B' },
    /leader and cancel shortcuts cannot be identical/,
    'cannot set leader key to cancel button shortcut'
  )
})

test('setting cancel changes cancel in state, unregisters old cancel and registers new', t => {
  t.plan(4)
  const register = sinon.stub()
  register.withArgs('Ctrl+B').callsArg(1)
  const globalShortcut = {register, unregister: sinon.spy()}
  const registerShortcuts = sinon.spy()
  const unregisterShortcuts = sinon.spy()
  const ShortE = stubShortE(registerShortcuts, unregisterShortcuts)
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500, cancel: 0})
  shortcuts.cancel = 'Ctrl+B'
  t.ok(globalShortcut.unregister.calledWith(0), 'old leader unregistered')
  t.ok(globalShortcut.register.calledWith('Ctrl+B'), 'new leader registered')
  t.ok(registerShortcuts.calledOnce, 'calling new leader registers shortcuts')
  t.equal(shortcuts.cancel, 'Ctrl+B', 'new leaderShortcut placed in state')
})

test('setting cancel - bad parameters', t => {
  t.plan(2)
  const globalShortcut = {register: sinon.spy(), unregister: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500, cancel: 'Ctrl+B'})
  t.throws(
    () => { shortcuts.cancel = {} },
    /invalid cancel shortcut/,
    'cannot set cancel key to object'
  )
  t.throws(
    () => { shortcuts.cancel = 'Ctrl+A' },
    /leader and cancel shortcuts cannot be identical/,
    'cannot set cancel key to leader button shortcut'
  )
})
