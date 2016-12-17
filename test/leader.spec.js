'use strict'
const test = require('tape')
const sinon = require('sinon')

const ShortE = require('../')

test('setting leader changes leader in state, unregisters old leader and registers new', t => {
  t.plan(3)
  const globalShortcut = {register: sinon.spy(), unregister: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  shortcuts.leader = 'Ctrl+B'
  t.ok(globalShortcut.unregister.calledWith('Ctrl+A'), 'old leader unregistered')
  t.ok(globalShortcut.register.calledWith('Ctrl+B'), 'new leader registered')
  t.equal(shortcuts.leader, 'Ctrl+B', 'new leaderShortcut placed in state')
})
