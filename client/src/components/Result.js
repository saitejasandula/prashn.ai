import React from 'react';

function Result({ quizData, userAnswers, report, retestQuiz }) {
  if (!quizData || !report) return <div>Result not available.</div>;
  const score = report.filter(r => r.isCorrect).length;

  return (
    <div>
      <h2>Quiz Result</h2>
      <div className="result">Score: {score} / {quizData.length}</div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td>{r.question}</td>
              <td className={r.isCorrect ? 'correct' : 'incorrect'}>{r.yourAnswer || <span style={{color:'#d32f2f'}}>No Answer</span>}</td>
              <td>{r.correct}</td>
              <td className={r.isCorrect ? 'correct' : 'incorrect'}>{r.isCorrect ? 'Correct' : 'Incorrect'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="button red" onClick={retestQuiz}>Retest Quiz</button>
    </div>
  );
}

export default Result; 