import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  const startQuiz = (data) => {
    setQuizData(data);
    setUserAnswers([]);
    setReport(null);
    navigate('/quiz');
  };

  const finishQuiz = (answers, report) => {
    setUserAnswers(answers);
    setReport(report);
    navigate('/result');
  };

  const retestQuiz = () => {
    setQuizData(null);
    setUserAnswers([]);
    setReport(null);
    navigate('/');
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home startQuiz={startQuiz} />} />
        <Route path="/quiz" element={<Quiz quizData={quizData} finishQuiz={finishQuiz} />} />
        <Route path="/result" element={<Result quizData={quizData} userAnswers={userAnswers} report={report} retestQuiz={retestQuiz} />} />
      </Routes>
    </div>
  );
}

export default App; 