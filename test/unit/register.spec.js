'use strict'
const test = require('tape')
const sinon = require('sinon')

const ShortE = require('../../')

test('register adds cb to shortcut', t => {
  t.plan(2)
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  const cb1 = function cb1 () {}
  const cb2 = function cb2 () {}
  shortcuts.register('a', cb1)
  shortcuts.register('b', cb2)
  t.deepEqual(shortcuts.shortcuts.a, cb1, 'first shortcut registered in state')
  t.deepEqual(shortcuts.shortcuts.b, cb2, 'second shortcut registered in state')
})

test('registering same shortcut overrides shortcut in state', t => {
  t.plan(1)
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  const cb1 = function cb1 () {}
  const cb2 = function cb2 () {}
  shortcuts.register('a', cb1)
  shortcuts.register('a', cb2)
  t.deepEqual(shortcuts.shortcuts.a, cb2, 'shortcut overriden in state')
})

test('register - bad params', t => {
  t.plan(2)
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  const cb1 = function cb1 () {}
  t.throws(
    () => shortcuts.register({}, cb1),
    /invalid shortcut key/,
    'cannot register object as shortcut key'
  )
  t.throws(
    () => shortcuts.register('a', {}),
    /invalid callback function/,
    'cannot register object as shortcut key'
  )
})

test('cannot modify shortcuts directly in state', t => {
  t.plan(1)
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
  const cb1 = function cb1 () {}
  const cb2 = function cb2 () {}
  shortcuts.register('a', cb1)
  shortcuts.shortcuts.a = cb2
  t.deepEqual(shortcuts.shortcuts.a, cb1, 'shortcut unmodified')
})
