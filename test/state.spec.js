'use strict'

const test = require('tape')
const sinon = require('sinon')
const EventEmitter = require('events')

const ShortE = require('../')

test('default state', t => {
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500})
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
  const globalShortcut = {register: sinon.spy(), unregister: () => {}}
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+A', {debounceTime: 500, cancelShortcut: 'Ctrl+B'})
  t.ok(globalShortcut.register.calledWith('Ctrl+A'), 'leader key registered')
  t.ok(globalShortcut.register.calledWith('Ctrl+B'), 'custom cancel key registered')
  Object.keys(EventEmitter.prototype).forEach(k => {
    if (typeof EventEmitter.prototype[k] === 'function') {
      t.equals(shortcuts[k], EventEmitter.prototype[k], `${k} EventEmitter method exported`)
    }
  })
  t.end()
})

test('bad params', t => {
  t.plan(4)
  const globalShortcut = {register: () => {}, unregister: () => {}}
  t.throws(
    () => new ShortE({register: () => {}}, 'Ctrl+A', {debounceTime: 500, cancelShortcut: 'Ctrl+B'}),
    /malformed globalShortcut object/,
    'cannot create instance when providing globalShortcut with no unregister method'
  )
  t.throws(
    () => new ShortE({unregister: () => {}}, 'Ctrl+A', {debounceTime: 500, cancelShortcut: 'Ctrl+B'}),
    /malformed globalShortcut object/,
    'cannot create instance when providing globalShortcut with no unregister method'
  )
  t.throws(
    () => new ShortE(null, 'Ctrl+A', {debounceTime: 500, cancelShortcut: 'Ctrl+B'}),
    /malformed globalShortcut object/,
    'cannot create instance when providing globalShortcut with no unregister method'
  )
  t.throws(
    () => new ShortE(globalShortcut, null, {debounceTime: 500, cancelShortcut: 'Ctrl+B'}),
    /invalid leader key/,
    'cannot create instance without providing leader key'
  )
})
