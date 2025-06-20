import React, { useState } from 'react';
import axios from 'axios';

function Home({ startQuiz }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/quiz', { difficulty, numQuestions });
      startQuiz(res.data.questions);
    } catch (err) {
      setError('Failed to generate quiz.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Quiz AI</h1>
      <label>
        Difficulty:
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <br />
      <label>
        Number of Questions:
        <input type="number" min="1" max="20" value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
      </label>
      <br />
      <button className="button" onClick={handleStart} disabled={loading}>{loading ? 'Generating...' : 'Start Quiz'}</button>
      {error && <div className="timer">{error}</div>}
    </div>
  );
}

export default Home; 