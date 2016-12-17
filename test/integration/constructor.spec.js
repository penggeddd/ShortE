'use strict'
const test = require('tape')
const sinon = require('sinon')

const ShortE = require('../../')

test('constructor registers leader key properly', t => {
  t.plan(1)
  const register = sinon.stub()
  register.onCall(0).callsArg(1)
  const globalShortcut = {
    register,
    unregister: () => {}
  }
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  t.ok(shortcuts.active, 'register shortcuts called')
})

test('constructor registers cancel key properly', t => {
  t.plan(1)
  const register = sinon.stub()
  register.onCall(1).callsArg(1)
  const globalShortcut = {
    register,
    unregister: () => {}
  }
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  t.notOk(shortcuts.active, 'unregister shortcuts called')
})
