'use strict'

module.exports = {
  registerShortcuts, unregisterShortcuts
}

function debounce (state, cb, debounceTime, emitter) {
  cb()
  clearTimeout(state.timer)
  state.timer = setTimeout(() => unregisterShortcuts(state, emitter), debounceTime)
}

function registerShortcuts (state, emitter) {
  if (!state.active) {
    state.active = true
    Object.keys(state.shortcuts).forEach(keyCombo => {
      state.globalShortcut.register(`${keyCombo}`, () => debounce(state, state.shortcuts[keyCombo], state.debounceTime, emitter))
    })
    emitter.emit('active')
  }
}

function unregisterShortcuts (state, emitter) {
  if (state.active) {
    state.active = false
    Object.keys(state.shortcuts).forEach(keyCombo => {
      state.globalShortcut.unregister(keyCombo)
    })
    emitter.emit('inactive')
  }
}
