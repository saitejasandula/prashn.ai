import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Quiz({ quizData, finishQuiz }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef();

  const question = quizData ? quizData[current] : null;
  const isHard = quizData && quizData[0] && quizData[0].difficulty === 'hard';

  useEffect(() => {
    if (isHard && question) {
      setTimer(30);
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            handleAnswer(null);
            return 30;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
    // eslint-disable-next-line
  }, [current, isHard]);

  if (!quizData) return <div>Quiz not loaded.</div>;

  const handleAnswer = (option) => {
    clearInterval(intervalRef.current);
    setAnswers([...answers, option]);
    if (current + 1 < quizData.length) {
      setCurrent(current + 1);
    } else {
      submitQuiz([...answers, option]);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const res = await axios.post('/api/quiz/report', { questions: quizData, answers: finalAnswers });
      finishQuiz(finalAnswers, res.data.report);
    } catch {
      finishQuiz(finalAnswers, []);
    }
  };

  return (
    <div>
      <div className="progress-bar" style={{ width: `${((current + 1) / quizData.length) * 100}%` }} />
      <h2>Question {current + 1} of {quizData.length}</h2>
      <div>{question.question}</div>
      <div>
        {question.options.map((opt, idx) => (
          <button key={idx} className="button" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {isHard && <div className="timer">Time left: {timer}s</div>}
    </div>
  );
}

export default Quiz; 