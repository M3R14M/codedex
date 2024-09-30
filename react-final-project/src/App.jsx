import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Question from './components/Question';
import Results from './components/Results';
import UserForm from './components/UserForm';
import UserProvider from './components/UserContext';

import { shuffle, calculatePercentage } from './assets/utils.js';
import questions from './assets/questions.js';
import elements from './assets/elements.js';
import keywords from './assets/keywords.js';

async function fetchCat(breed) {
  const apiUrl = `https://api.thecatapi.com/v1/images/search?breed_id=${breed}`;
  const options = {
    headers: {
      'Content-type': 'application/json',
      'x-api-key': 'DEMO-API-KEY',
    },
    method: 'GET',
  };
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();

    return data[0];
  } catch (error) {
    console.error('Error fetching cat data:', error.message);
    return null;
  }
}

// Determine the total count of answers for each element
function countAnswers(answers) {
  const counts = {};
  answers.forEach(function (answer) {
    const element = elements[answer];
    counts[element] = (counts[element] || 0) + 1;
  });
  return counts;
}

// Get current path
const path = window.location.pathname.replace('/index.html', '');

function App() {
  const [shuffledQuestions, setShuffledQuestions] = useState(
    shuffle(questions)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState(['#0cf', '#f0c']);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  // Turn all states back to their initial values
  function handleReset() {
    setShuffledQuestions(shuffle(questions));
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setElement('');
    setCat(null);
    setColors(['#0cf', '#f0c']);
  }

  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const answerCount = countAnswers(answers);
        console.log(answerCount);
        const percentages = calculatePercentage(answerCount, answers.length);
        const selectedElement = Object.keys(percentages)[0];
        const selectedPercentage = Object.values(percentages)[0];

        const obj = keywords[selectedElement];
        setElement(obj.text);
        setColors(obj.colors);
        setLoading(true);
        fetchCat(obj.enum).then((data) => {
          const catObj = {
            imgUrl: data?.url,
            name: data?.breeds[0].name,
            desc: data?.breeds[0].description,
            traits: data?.breeds[0].temperament
              .split(',')
              .map((trait) => trait.trim()),
            infoUrl: data?.breeds[0].vetstreet_url,
          };
          setCat(catObj);
          setPercentage(selectedPercentage);
          setLoading(false);
        });
      }
    },
    [currentQuestionIndex]
  );

  // Set the primary and secondary colors based on the selected element
  document.documentElement.style.setProperty('--primary-color', colors[0]);
  document.documentElement.style.setProperty('--secondary-color', colors[1]);
  return (
    <UserProvider>
      <Router basename={path}> 
        <Header />
        <Routes>
          <Route path='/' element={<UserForm />} />
          <Route
            path='/quiz'
            element={
              currentQuestionIndex < questions.length ? (
                <Question
                  question={shuffledQuestions[currentQuestionIndex].question}
                  options={shuffle(
                    shuffledQuestions[currentQuestionIndex].options
                  )}
                  onAnswer={handleAnswer}
                />
              ) : (
                <Results
                  element={element}
                  cat={cat}
                  loading={loading}
                  onReset={handleReset}
                  percentage={percentage}
                />
              )
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
