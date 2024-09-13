import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaXTwitter } from 'react-icons/fa6';
import './QuoteGenerator.css';

function QuoteGenerator({ changeColor }) {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [author, setAuthor] = useState(null);
  const [color, setColor] = useState(null);
  const [error, setError] = useState({attempts: 5, message: ''});

  function getColor(currentColor) {
    const colors = [
      "#6A5ACD",
      "#2E8B57",
      "#B22222",
      "#4682B4",
      "#D2691E",
      "#8B4513",
      "#A0522D",
      "#556B2F",
      "#8B008B",
      "#B8860B"
    ];

    let randomColor;
    do {
      const randomIndex = Math.floor(Math.random() * colors.length);
      randomColor = colors[randomIndex];
    } while (randomColor === currentColor);

    return randomColor;
  }

  async function generateQuote() {
    try {
      const response = await fetch(
        'http://api.quotable.io/random?tags=technology&maxLength=100'
      );
      const data = await response.json();
      setCurrentQuote(data.content);
      setAuthor(data.author);

      const newColor = getColor(color);
      setColor(newColor);
      changeColor(newColor);
    } catch (err) {
      if (err.message === 'Failed to fetch') {    
        setError((prev) => {
          if (prev.attempts > 0) {
            return { attempts: prev.attempts - 1, message: <>{err.message}<p>Attempting new connection...</p></> };
          } else {
            return { ...prev, message: <>{err.message}<p>Please report the issue on <a href='https://github.com/M3R14M/codedex/issues' target='_blank'>GitHub</a> for support</p></> };
          }
        });
        if (error.attempts > 0) {
          setTimeout(generateQuote, 2000);
        }
      } else {
        setError({ attempts: 0, message: err.message });
      }
      console.error('Error fetching quote:', err.message);
    } 
  }

  useEffect(() => {
    generateQuote();
  }, []);

  const tweetUrl = `https://x.com/intent/post?text=“${currentQuote}” - ${author}%0a%0a&hashtags=TechQuotes&related=M3R14M_dev`;

  return (
    <div id="quote-box">
      <div className="quote-text">
        {!currentQuote && (
          <>
            {error.message ? error.message : 'Loading...'}
          </>
        )}
        {currentQuote && (
          <>
            <FaQuoteLeft />
            <span id="text">{currentQuote}</span>
            <p id="author">– {author}</p>
          </>
        )}
      </div>
      {currentQuote && (
        <div className="quote-footer">
          <a
            id="tweet-quote"
            className="btn"
            href={tweetUrl}
            title="Share this quote on X"
            target="_blank"
          >
            <FaXTwitter />
          </a>
          <button
            id="new-quote"
            onClick={generateQuote}
            className="btn"
            title="Get a new quote"
          >
            New quote
          </button>
        </div>
      )}
    </div>
  );
}

export default QuoteGenerator;