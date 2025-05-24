import Keyboard from './components/Keyboard';
import { useKeyboard } from './hooks/useKeyboard';
import Display from './components/Display';

import './app.css';

function App() {
  const initialText = "lorem ipsum dolor sit amet, consectetur adipiscing elit";
  const {
    handleKeyDown,
    activeKeys,
    cursorPosition,
    typedCharacters
  } = useKeyboard(initialText);

  return (
    <div className="app-container">
      <Display
        text={initialText}
        cursorPosition={cursorPosition}
        typedCharacters={typedCharacters}
      />
      <Keyboard
        onKeyDown={handleKeyDown}
        activeKeys={activeKeys}
      />
    </div>
  );
}

export default App;