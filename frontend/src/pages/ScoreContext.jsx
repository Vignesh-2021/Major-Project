import React, { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [scores, setScores] = useState({}); // { subject: [score1, score2, ...] }

  // Initialize scores from localStorage on mount
  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
    const initialScores = {};
    storedSessions.forEach((session) => {
      const summaries = JSON.parse(localStorage.getItem(`summaries_${session.topic}`)) || [];
      const validScores = summaries
        .filter((summary) => summary.score && summary.score.percentage !== null)
        .map((summary) => summary.score.percentage);
      if (validScores.length > 0) {
        initialScores[session.topic] = validScores;
      }
    });
    setScores(initialScores);
  }, []);

  const updateScore = (subject, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [subject]: prevScores[subject] ? [...prevScores[subject], score] : [score],
    }));
  };

  const getAverageScore = (subject) => {
    const subjectScores = scores[subject] || [];
    if (subjectScores.length === 0) return "N/A";
    const average = subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length;
    return average.toFixed(1); // Round to 1 decimal place
  };

  return (
    <ScoreContext.Provider value={{ scores, updateScore, getAverageScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScores = () => useContext(ScoreContext);