'use strict'
const test = require('tape')
const sinon = require('sinon')

const ShortE = require('../')

test('can get and set debounceTime in state', t => {
  t.plan(2)
  const globalShortcut = {register: sinon.spy(), unregister: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  t.equal(shortcuts.debounceTime, 500, 'can get debounce time')
  shortcuts.debounceTime = 100
  t.equal(shortcuts.debounceTime, 100, 'debounce time changed')
})

test('debounceTime - bad parameters', t => {
  t.plan(2)
  const globalShortcut = {register: sinon.spy(), unregister: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  t.throws(
    () => shortcuts.debounceTime = 'a',
    /debounceTime must be an integer/,
    'cannot set debounce time to string'
  )
  t.throws(
    () => shortcuts.debounceTime = 1.5,
    /debounceTime must be an integer/,
    'cannot set debounce time to fraction'
  )
})
