'use strict'

const test = require('tape')
const sinon = require('sinon')
const EventEmitter = require('events')

const ShortE = require('../')

test('default state', t => {
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A')
  t.ok(globalShortcut.register.calledWith('Ctrl+A'), 'leader key registered')
  t.ok(globalShortcut.register.calledWith('Esc'), 'default cancel key registered')
  t.equal(shortcuts.debounceTime, 0, 'default debounce time is 0')
  Object.keys(EventEmitter.prototype).forEach(k => {
    if (typeof EventEmitter.prototype[k] === 'function') {
      t.equals(shortcuts[k], EventEmitter.prototype[k], `${k} EventEmitter method exported`)
    }
  })
  t.end()
})

test('custom params key', t => {
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {cancelShortcut: 'Ctrl+B', debounceTime: 500})
  t.ok(globalShortcut.register.calledWith('Ctrl+A'), 'leader key registered')
  t.ok(globalShortcut.register.calledWith('Ctrl+B'), 'custom cancel key registered')
  t.equal(shortcuts.debounceTime, 500, 'custom debounce time placed in state')
  Object.keys(EventEmitter.prototype).forEach(k => {
    if (typeof EventEmitter.prototype[k] === 'function') {
      t.equals(shortcuts[k], EventEmitter.prototype[k], `${k} EventEmitter method exported`)
    }
  })
  t.end()
})
