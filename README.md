# ShortE
Keyboard shortcut modes for Electron

## Description
This allows you to designate a 'leader' key, that enters the user into a different 'mode'.
Upon entering the new mode:
* One or more of your pre-defined shortcuts are registered.
* When using one of those shortcuts, a timer starts, at the end of which the user will return to the previous mode.
* The user can press the 'cancel' shortcut to return to the previous mode.

## Installation
```
npm install shorte
```

## Usage
```javascript
const ShortE = require('shorte')
const { globalShortcut } = require('electron')
// ...
app.on('ready', () => {
  const shortcuts = new ShortE(
    globalShortcut, // pass the electron globalShortcut object
    'Ctrl+B', // the initial leader key, this can be changed later
    { // opts
      debounceTime: 500 // default 0
      cancel: 'Ctrl+A' // default is Esc
    }
  )
  shortcuts.register('W', () => console.log('W was pressed'))
  shortcuts.register('Alt+B', () => console.log('Alt+B was pressed'))
  // Pressing: Ctrl+B + <indefinite wait> + W will print 'W was pressed'
  // Pressing: Ctrl+B + <indefinite wait> + Alt+B will print'Alt+B was pressed'
  // Pressing: 
  // Ctrl+B + <indefinite wait> + W + <wait less than 0.5 seconds> + B 
  // will print 'W was pressed' and 'Alt+B was pressed'
})
```

## API
### contructor 
```javascript
const shortcuts = new ShortE(globalShortcut, leader, opts)
```
Cteates the shortcuts object and registers the leader key.
* globalShortcut - the electron globalShortcut object
* leader - the leader key (electron Accelerator format) (eg. 'Ctrl+B')
* opts - optional object including:
  * debounceTime (in milliseconds) - default is 0
  * cancel - string for custom button - default is Esc

### register
```javascript
shortcuts.register(key, cb)
```
Registers a shortcut key. Once the leader key will be pressed, this shortcut will be available.
* key: The key combination in electron Accelerator format. (eg. 'Alt+B')
* cb: The function to be called when this key is pressed.

### leader
```javascript
shortcuts.leader(key)
```
Changes the leader key.
* key: the new leader key

### cancel
```javascript
shortcuts.cancel(key)
```
Changes the cancel key.
* key: the new cancel key

## Accessors
### debounceTime
```javascript
console.log(shortcuts.debounceTime) // 500
shortcuts.debounceTime = 100
console.log(shortcuts.debounceTime) // 100
```
### shortcuts
```javascript
console.log(shortcuts.shortcuts) // { a: [ some function ], b: [ some other function] }
shortcuts.shortcuts.a = function () => {} // silently fail
```
### active
```javascript
// Press leader key
console.log(shortcuts.active) // true
// Press a shortcut, wait debounceTime
console.log(shortcuts.active) // false
```
## Events
### active
```javascript
shortcuts.on('active', () => console.log('leader key pressed, shortcuts now available'))
// Press leader key
// 'leader key pressed, shortcuts now available
```
### inactive
```javascript
shortcuts.on('inactive', () => console.log('timeout reached, shortcuts unavailable'))
// Press leader key
// Use shortcut and wait debounce time, or press cancel key
// 'timeout reached, shortcuts unavailable'
```

## Contributing
Yes please.

## License
MIT
