const keyboardRowsQwerty = [
  [
    { label: '`', code: 'Backquote', type: 'small' },
    { label: '1', code: 'Digit1', type: 'small' },
    { label: '2', code: 'Digit2', type: 'small' },
    { label: '3', code: 'Digit3', type: 'small' },
    { label: '4', code: 'Digit4', type: 'small' },
    { label: '5', code: 'Digit5', type: 'small' },
    { label: '6', code: 'Digit6', type: 'small' },
    { label: '7', code: 'Digit7', type: 'small' },
    { label: '8', code: 'Digit8', type: 'small' },
    { label: '9', code: 'Digit9', type: 'small' },
    { label: '0', code: 'Digit0', type: 'small' },
    { label: '-', code: 'Minus', type: 'small' },
    { label: '=', code: 'Equal', type: 'small' },
    { label: 'backspace', code: 'Backspace', type: 'backspace' }
  ],
  [
    { label: 'tab', code: 'Tab', type: 'tab' },
    { label: 'q', code: 'KeyQ', type: 'small' },
    { label: 'w', code: 'KeyW', type: 'small' },
    { label: 'e', code: 'KeyE', type: 'small' },
    { label: 'r', code: 'KeyR', type: 'small' },
    { label: 't', code: 'KeyT', type: 'small' },
    { label: 'y', code: 'KeyY', type: 'small' },
    { label: 'u', code: 'KeyU', type: 'small' },
    { label: 'i', code: 'KeyI', type: 'small' },
    { label: 'o', code: 'KeyO', type: 'small' },
    { label: 'p', code: 'KeyP', type: 'small' },
    { label: '[', code: 'BracketLeft', type: 'small' },
    { label: ']', code: 'BracketRight', type: 'small' },
    { label: '\\', code: 'Backslash', type: 'backslash' }
  ],
  [
    { label: 'caps', code: 'CapsLock', type: 'caps' },
    { label: 'a', code: 'KeyA', type: 'small' },
    { label: 's', code: 'KeyS', type: 'small' },
    { label: 'd', code: 'KeyD', type: 'small' },
    { label: 'f', code: 'KeyF', type: 'small', bump: true },
    { label: 'g', code: 'KeyG', type: 'small' },
    { label: 'h', code: 'KeyH', type: 'small' },
    { label: 'j', code: 'KeyJ', type: 'small', bump: true },
    { label: 'k', code: 'KeyK', type: 'small' },
    { label: 'l', code: 'KeyL', type: 'small' },
    { label: ';', code: 'Semicolon', type: 'small' },
    { label: '\'', code: 'Quote', type: 'small' },
    { label: 'enter', code: 'Enter', type: 'enter' }
  ],
  [
    { label: 'shift', code: 'ShiftLeft', type: 'shift-left' },
    { label: 'z', code: 'KeyZ', type: 'small' },
    { label: 'x', code: 'KeyX', type: 'small' },
    { label: 'c', code: 'KeyC', type: 'small' },
    { label: 'v', code: 'KeyV', type: 'small' },
    { label: 'b', code: 'KeyB', type: 'small' },
    { label: 'n', code: 'KeyN', type: 'small' },
    { label: 'm', code: 'KeyM', type: 'small' },
    { label: ',', code: 'Comma', type: 'small' },
    { label: '.', code: 'Period', type: 'small' },
    { label: '/', code: 'Slash', type: 'small' },
    { label: 'shift', code: 'ShiftRight', type: 'shift-right' }
  ],
  [
    { label: 'ctrl', code: 'ControlLeft', type: 'ctrl' },
    { label: 'win', code: 'MetaLeft', type: 'win' },
    { label: 'alt', code: 'AltLeft', type: 'alt' },
    { label: '', code: 'Space', type: 'space' },
    { label: 'alt', code: 'AltRight', type: 'alt' },
    { label: 'win', code: 'MetaRight', type: 'win' },
    { label: 'menu', code: 'ContextMenu', type: 'menu' },
    { label: 'ctrl', code: 'ControlRight', type: 'ctrl' }
  ]
];

const keyboardRowsDvorak = [
  [
    { label: '`', code: 'Backquote', type: 'small' },
    { label: '1', code: 'Digit1', type: 'small' },
    { label: '2', code: 'Digit2', type: 'small' },
    { label: '3', code: 'Digit3', type: 'small' },
    { label: '4', code: 'Digit4', type: 'small' },
    { label: '5', code: 'Digit5', type: 'small' },
    { label: '6', code: 'Digit6', type: 'small' },
    { label: '7', code: 'Digit7', type: 'small' },
    { label: '8', code: 'Digit8', type: 'small' },
    { label: '9', code: 'Digit9', type: 'small' },
    { label: '0', code: 'Digit0', type: 'small' },
    { label: '[', code: 'BracketLeft', type: 'small' },
    { label: ']', code: 'BracketRight', type: 'small' },
    { label: '\\', code: 'Backslash', type: 'backslash' }
  ],
  [
    { label: 'tab', code: 'Tab', type: 'tab' },
    { label: '\'', code: 'Quote', type: 'small' },
    { label: ',', code: 'Comma', type: 'small' },
    { label: '.', code: 'Period', type: 'small' },
    { label: 'p', code: 'KeyP', type: 'small' },
    { label: 'y', code: 'KeyY', type: 'small' },
    { label: 'f', code: 'KeyF', type: 'small' },
    { label: 'g', code: 'KeyG', type: 'small' },
    { label: 'c', code: 'KeyC', type: 'small' },
    { label: 'r', code: 'KeyR', type: 'small' },
    { label: 'l', code: 'KeyL', type: 'small' },
    { label: '/', code: 'Slash', type: 'small' },
    { label: '=', code: 'Equal', type: 'small' },
    { label: 'backspace', code: 'Backspace', type: 'backspace' }
  ],
  [
    { label: 'caps', code: 'CapsLock', type: 'caps' },
    { label: 'a', code: 'KeyA', type: 'small' },
    { label: 'o', code: 'KeyO', type: 'small' },
    { label: 'e', code: 'KeyE', type: 'small' },
    { label: 'u', code: 'KeyU', type: 'small', bump: true },
    { label: 'i', code: 'KeyI', type: 'small' },
    { label: 'd', code: 'KeyD', type: 'small' },
    { label: 'h', code: 'KeyH', type: 'small', bump: true },
    { label: 't', code: 'KeyT', type: 'small' },
    { label: 'n', code: 'KeyN', type: 'small' },
    { label: 's', code: 'KeyS', type: 'small' },
    { label: '-', code: 'Minus', type: 'small' },
    { label: 'enter', code: 'Enter', type: 'enter' }
  ],
    [
    { label: 'shift', code: 'ShiftLeft', type: 'shift-left' },
    { label: ';', code: 'Semicolon', type: 'small' },
    { label: 'q', code: 'KeyQ', type: 'small' },
    { label: 'j', code: 'KeyJ', type: 'small' },
    { label: 'k', code: 'KeyK', type: 'small' },
    { label: 'x', code: 'KeyX', type: 'small' },
    { label: 'b', code: 'KeyB', type: 'small' },
    { label: 'm', code: 'KeyM', type: 'small' },
    { label: 'w', code: 'KeyW', type: 'small' },
    { label: 'v', code: 'KeyV', type: 'small' },
    { label: 'z', code: 'KeyZ', type: 'small' },
    { label: 'shift', code: 'ShiftRight', type: 'shift-right' }
  ],
  [
    { label: 'ctrl', code: 'ControlLeft', type: 'ctrl' },
    { label: 'win', code: 'MetaLeft', type: 'win' },
    { label: 'alt', code: 'AltLeft', type: 'alt' },
    { label: '', code: 'Space', type: 'space' },
    { label: 'alt', code: 'AltRight', type: 'alt' },
    { label: 'win', code: 'MetaRight', type: 'win' },
    { label: 'menu', code: 'ContextMenu', type: 'menu' },
    { label: 'ctrl', code: 'ControlRight', type: 'ctrl' }
  ]
];


export { keyboardRowsQwerty, keyboardRowsDvorak };