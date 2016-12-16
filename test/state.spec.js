'use strict'

const test = require('tape')
const sinon = require('sinon')
const EventEmitter = require('events')

const ShortE = require('../')

test('default state', t => {
  const globalShortcut = {register: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', 500)
  t.ok(globalShortcut.register.calledWith('Ctrl+A'), 'leader key registered')
  t.ok(globalShortcut.register.calledWith('Esc'), 'default cancel key registered')
  Object.keys(EventEmitter.prototype).forEach(k => {
    if (typeof EventEmitter.prototype[k] === 'function') {
      t.equals(shortcuts[k], EventEmitter.prototype[k], `${k} EventEmitter method exported`)
    }
  })
  t.end()
})

test('custom cancel key', t => {
  const globalShortcut = {register: sinon.spy()}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', 500, 'Ctrl+B')
  t.ok(globalShortcut.register.calledWith('Ctrl+A'), 'leader key registered')
  t.ok(globalShortcut.register.calledWith('Ctrl+B'), 'custom cancel key registered')
  Object.keys(EventEmitter.prototype).forEach(k => {
    if (typeof EventEmitter.prototype[k] === 'function') {
      t.equals(shortcuts[k], EventEmitter.prototype[k], `${k} EventEmitter method exported`)
    }
  })
  t.end()
})
