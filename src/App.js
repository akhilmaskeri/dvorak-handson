import Keyboard from './components/Keyboard';
import { useKeyboard } from './hooks/useKeyboard';

function App() {
  const {
    handleKeyDown,
    handleKeyUp,
    handleKeyPress,
    activeKeys
  } = useKeyboard();

  return (
    <div className="app-container">
      <Keyboard
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
        activeKeys={activeKeys}
      />
    </div>
  );
}

export default App;