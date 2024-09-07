import { useState } from 'react';
import QuoteGenerator from './components/QuoteGenerator';
import './App.css';

function App() {
  const [color, setColor] = useState(null);
  function changeColor(color) {
    setColor(color);
  }

  document.documentElement.style.setProperty('--main-color', color);
  return (
    <>
      <main style={{ opacity: 1 }}>
        <QuoteGenerator changeColor={changeColor} />
      </main>
      <footer>
        Made with <heart-icon title="love"></heart-icon> by{' '}
        <a href="https://www.github.com/M3R14M" target="_blank">
          M3R14M
        </a>
      </footer>
    </>
  );
}

export default App;
