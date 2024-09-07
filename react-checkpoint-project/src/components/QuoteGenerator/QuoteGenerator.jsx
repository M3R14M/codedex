import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaXTwitter } from 'react-icons/fa6';
import './QuoteGenerator.css';

function QuoteGenerator({ changeColor }) {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [author, setAuthor] = useState(null);
  const [color, setColor] = useState(null);

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
    const response = await fetch(
      'https://api.quotable.io/random?tags=technology&maxLength=100'
    );
    const data = await response.json();
    setCurrentQuote(data.content);
    setAuthor(data.author);

    const newColor = getColor(color);
    setColor(newColor);
    changeColor(newColor);
  }

  useEffect(() => {
    generateQuote();
  }, []);

  const tweetUrl = `https://x.com/intent/post?text=“${currentQuote}” - ${author}%0a%0a&hashtags=TechQuotes&related=M3R14M_dev`;

  return (
    <div id="quote-box">
      <div className="quote-text">
        {!currentQuote && <>Loading...</>}
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