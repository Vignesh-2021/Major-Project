import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScores } from "./ScoreContext";
import "./Summarizer.css";
import AccessDenied from "../components/AccessDenied";

const Summarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { updateScore } = useScores();
  const location = useLocation();
  const navigate = useNavigate();

  // Get subject and session ID from route state or localStorage
  const { state } = location;
  const subjectFromState = state?.subject || state?.topic; // Fallback to topic
  const completedSessionId = state?.completedSessionId; // For completed session view
  const storedSession = JSON.parse(localStorage.getItem("activeSession")) || {};
  const subject = subjectFromState || storedSession.topic;
  const sessionId = completedSessionId || storedSession.id;

  // Log state for debugging
  useEffect(() => {
    console.log("Summarizer - Route state:", state);
    console.log("Summarizer - Subject:", subject);
    console.log("Summarizer - CompletedSessionId:", completedSessionId);
    console.log("Summarizer - StoredSession:", storedSession);
    console.log("Summarizer - SessionId:", sessionId);
  }, [state, subject, completedSessionId, storedSession, sessionId]);

  // Load saved summaries for the session
  useEffect(() => {
    if (sessionId) {
      const savedSummaries = JSON.parse(localStorage.getItem(`summaries_${sessionId}`)) || [];
      setSummaries(savedSummaries);
      console.log(`Loaded summaries for session ID: ${sessionId}`, savedSummaries);
    } else {
      setSummaries([]);
    }
  }, [sessionId]);

  // Save summaries only for active sessions
  useEffect(() => {
    if (storedSession?.id && summaries.length > 0 && !completedSessionId) {
      localStorage.setItem(`summaries_${storedSession.id}`, JSON.stringify(summaries));
      console.log(`Saved summaries for session ID: ${storedSession.id}`, summaries);
    }
  }, [summaries, storedSession?.id, completedSessionId]);

  // Allow access if either subject or completedSessionId exists
  if (!subject && !completedSessionId) {
    console.log("Access Denied - No subject or completedSessionId");
    return <AccessDenied />;
  }

  const API_KEY = "AIzaSyCec-z8P5xD4IMtdIvgSKY8BRHZYtmUfss";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const summarizeText = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter some text.");
      return;
    }
    setIsGenerating(true);
    setErrorMessage("");
    try {
      const requestBody = {
        contents: [{ parts: [{ text: `Summarize this text: ${inputText}` }] }],
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok || !data.candidates || data.candidates.length === 0) {
        throw new Error(data.error?.message || "Failed to summarize.");
      }
      const summaryText = data.candidates[0].content.parts[0].text;
      setSummaries((prevSummaries) => [
        ...prevSummaries,
        {
          input: inputText,
          summary: summaryText,
          questions: [],
          quiz: [],
          showQuiz: false,
          loading: false,
          score: { rawScore: null, percentage: null },
          subject,
        },
      ]);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuestions = async (summary, index) => {
    if (!summary) {
      setErrorMessage("No summary available to generate questions.");
      return;
    }
    try {
      const requestBody = {
        contents: [{ parts: [{ text: `Generate 3 simple questions based on this summary: ${summary}` }] }],
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok || !data.candidates || data.candidates.length === 0) {
        throw new Error(data.error?.message || "Failed to generate questions.");
      }
      const questionsText = data.candidates[0].content.parts[0].text;
      const questionsList = questionsText
        .split("\n")
        .filter((q) => q.trim() !== "" && q.match(/^\d+\./))
        .map((q) => ({ text: q.replace(/^\d+\.\s*/, "").trim(), answer: null, showAnswer: false }));
      setSummaries((prevSummaries) => {
        const updatedSummaries = [...prevSummaries];
        updatedSummaries[index].questions = questionsList;
        return updatedSummaries;
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    }
  };

  const generateAnswer = async (summary, question, summaryIndex, questionIndex) => {
    try {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Provide a brief answer and explanation for this question based on the summary: "${question}"\nSummary: ${summary}`,
              },
            ],
          },
        ],
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok || !data.candidates || data.candidates.length === 0) {
        throw new Error(data.error?.message || "Failed to generate answer.");
      }
      const answerText = data.candidates[0].content.parts[0].text;
      setSummaries((prevSummaries) => {
        const updatedSummaries = [...prevSummaries];
        updatedSummaries[summaryIndex].questions[questionIndex].answer = answerText;
        updatedSummaries[summaryIndex].questions[questionIndex].showAnswer = true;
        return updatedSummaries;
      });
    } catch (error) {
      console.error("Error generating answer:", error);
      setErrorMessage(error.message);
    }
  };

  const toggleAnswer = (summaryIndex, questionIndex) => {
    setSummaries((prevSummaries) => {
      const updatedSummaries = JSON.parse(JSON.stringify(prevSummaries));
      const questionItem = updatedSummaries[summaryIndex].questions[questionIndex];
      if (questionItem.answer) {
        questionItem.showAnswer = !questionItem.showAnswer;
      }
      return updatedSummaries;
    });
  };

  const generateQuiz = async (inputText, index) => {
    if (!inputText) {
      setErrorMessage("No input text available to generate quiz.");
      return;
    }
    setSummaries((prevSummaries) => {
      const updatedSummaries = [...prevSummaries];
      updatedSummaries[index].loading = true;
      return updatedSummaries;
    });
    try {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Create a multiple-choice quiz with exactly 5 questions based on this text: ${inputText}. For each question: 1. Provide the question text 2. Provide 4 options labeled a), b), c), d) 3. Clearly state the correct answer with "Correct Answer: [letter]" 4. Provide a detailed explanation with "Explanation: [text]" Format example: 1. What is the main purpose of this text? a) Option 1 b) Option 2 c) Option 3 d) Option 4 Correct Answer: a Explanation: The main purpose is clearly stated in the first paragraph where it mentions... Ensure explanations are detailed and directly reference the original text.`,
              },
            ],
          },
        ],
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok || !data.candidates || data.candidates.length === 0) {
        throw new Error(data.error?.message || "Failed to generate quiz.");
      }
      const quizText = data.candidates[0].content.parts[0].text;
      const { quizItems } = parseQuiz(quizText);
      setSummaries((prevSummaries) => {
        const updatedSummaries = prevSummaries.map((summary, i) => {
          if (i === index) {
            return { ...summary, quiz: quizItems, showQuiz: true, loading: false };
          }
          return summary;
        });
        return updatedSummaries;
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      setSummaries((prevSummaries) => {
        const updatedSummaries = [...prevSummaries];
        updatedSummaries[index].loading = false;
        return updatedSummaries;
      });
    }
  };

  const parseQuiz = (quizText) => {
    const lines = quizText.split("\n").filter((line) => line.trim() !== "");
    const quizItems = [];
    let currentQuestion = null;
    let collectingExplanation = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^\d+\./)) {
        if (currentQuestion) quizItems.push(currentQuestion);
        currentQuestion = {
          question: line.replace(/^\d+\.\s*/, "").trim(),
          options: [],
          correctAnswer: "",
          explanation: "",
          selectedOption: null,
          showExplanation: false,
          isCorrect: null,
        };
        collectingExplanation = false;
      } else if (line.match(/^[a-d]\)/)) {
        if (currentQuestion) currentQuestion.options.push(line.replace(/^[a-d]\)\s*/, "").trim());
        collectingExplanation = false;
      } else if (line.startsWith("Correct Answer:")) {
        if (currentQuestion) currentQuestion.correctAnswer = line.split("Correct Answer:")[1].trim().toLowerCase();
        collectingExplanation = false;
      } else if (line.startsWith("Explanation:")) {
        if (currentQuestion) {
          currentQuestion.explanation = line.split("Explanation:")[1].trim();
          collectingExplanation = true;
        }
      } else if (collectingExplanation && currentQuestion) {
        currentQuestion.explanation += " " + line.trim();
      }
    }
    if (currentQuestion) quizItems.push(currentQuestion);
    return { quizItems };
  };

  const calculateQuizScore = (quiz) => {
    const totalQuestions = quiz.length;
    const correctAnswers = quiz.filter((q) => q.isCorrect === true).length;
    const rawScore = correctAnswers;
    const percentage = (correctAnswers / totalQuestions) * 100;
    return { rawScore, percentage };
  };

  const handleOptionSelect = (summaryIndex, quizIndex, optionIndex) => {
    setSummaries((prevSummaries) => {
      const updatedSummaries = JSON.parse(JSON.stringify(prevSummaries));
      const quizItem = updatedSummaries[summaryIndex].quiz[quizIndex];
      const selectedLetter = String.fromCharCode(97 + optionIndex);
      quizItem.selectedOption = selectedLetter;
      quizItem.isCorrect = selectedLetter === quizItem.correctAnswer;
      const quiz = updatedSummaries[summaryIndex].quiz;
      const allAnswered = quiz.every((q) => q.selectedOption !== null);
      if (allAnswered) {
        const score = calculateQuizScore(quiz);
        updatedSummaries[summaryIndex].score = score;
        updateScore(updatedSummaries[summaryIndex].subject, score.percentage);
      }
      return updatedSummaries;
    });
  };

  const toggleShowExplanation = (summaryIndex, quizIndex) => {
    setSummaries((prevSummaries) => {
      const updatedSummaries = JSON.parse(JSON.stringify(prevSummaries));
      const quizItem = updatedSummaries[summaryIndex].quiz[quizIndex];
      if (quizItem.selectedOption !== null) {
        quizItem.showExplanation = !quizItem.showExplanation;
      }
      return updatedSummaries;
    });
  };

  const toggleQuizView = (index) => {
    setSummaries((prevSummaries) => {
      const updatedSummaries = prevSummaries.map((summary, i) => {
        if (i === index) return { ...summary, showQuiz: !summary.showQuiz };
        return summary;
      });
      return updatedSummaries;
    });
  };

  const startNewSummary = () => {
    setInputText("");
    setSummaries([]);
    if (storedSession?.id) {
      localStorage.removeItem(`summaries_${storedSession.id}`);
    }
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="input-section">
          <h1 className="title">Text Summarizer & Quiz Generator</h1>
          <textarea
            className="input-box"
            placeholder="Enter text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating || completedSessionId} // Disable for completed sessions
          />
          <div className="button-group">
            <button
              className="button"
              onClick={summarizeText}
              disabled={isGenerating || completedSessionId} // Disable for completed sessions
            >
              {isGenerating ? "Summarizing..." : "Summarize"}
            </button>
            {summaries.length > 0 && !completedSessionId && (
              <button className="button" onClick={startNewSummary}>
                New Summary
              </button>
            )}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        {summaries.map((item, index) => (
          <div key={index} className="summary-item">
            {!item.showQuiz ? (
              <>
                <h3>Original Text:</h3>
                <p>{item.input}</p>
                <h3>Summary:</h3>
                <p>{item.summary}</p>
                {item.score.rawScore !== null && (
                  <p className="score-text">
                    Quiz Score: {item.score.rawScore}/5 ({item.score.percentage}%)
                  </p>
                )}
                <div className="button-group">
                  <button
                    className="button"
                    onClick={() => generateQuestions(item.summary, index)}
                    disabled={item.loading || completedSessionId} // Disable for completed sessions
                  >
                    Generate Questions
                  </button>
                  <button
                    className="button"
                    onClick={() => generateQuiz(item.input, index)}
                    disabled={item.loading || completedSessionId} // Disable for completed sessions
                  >
                    {item.loading ? "Generating Quiz..." : "Generate Quiz"}
                  </button>
                </div>
                {item.questions.length > 0 && (
                  <div className="questions-section">
                    <h4>Generated Questions:</h4>
                    <ul>
                      {item.questions.map((question, qIndex) => (
                        <li key={qIndex}>
                          <div className="question-wrapper">
                            <span>{question.text}</span>
                            <button
                              className="button answer-button"
                              onClick={() => {
                                if (!question.answer) {
                                  generateAnswer(item.summary, question.text, index, qIndex);
                                } else {
                                  toggleAnswer(index, qIndex);
                                }
                              }}
                              disabled={isGenerating || completedSessionId} // Disable for completed sessions
                            >
                              {!question.answer
                                ? "Get Answer"
                                : question.showAnswer
                                ? "Hide Answer"
                                : "Show Answer"}
                            </button>
                          </div>
                          {question.showAnswer && question.answer && (
                            <div className="answer-text">{question.answer}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="quiz-section">
                <h4>Generated Quiz (Based on Original Text):</h4>
                {item.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="quiz-item">
                    <p>
                      <strong>{q.question}</strong>
                    </p>
                    <div className="options-grid">
                      {q.options.map((opt, optIndex) => {
                        const optionLetter = String.fromCharCode(97 + optIndex);
                        const isSelected = q.selectedOption === optionLetter;
                        const isCorrect = optionLetter === q.correctAnswer;
                        let buttonClass = "option-button";
                        if (q.selectedOption) {
                          if (isCorrect) buttonClass += " correct";
                          else if (isSelected) buttonClass += " incorrect";
                        }
                        return (
                          <button
                            key={optIndex}
                            className={buttonClass}
                            onClick={() => handleOptionSelect(index, qIndex, optIndex)}
                            disabled={q.selectedOption !== null || completedSessionId} // Disable for completed sessions
                          >
                            {opt}
                            {q.selectedOption && (
                              <span className="option-feedback">{isCorrect ? "✓" : "✗"}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {q.selectedOption && (
                      <>
                        <div className="answer-button-wrapper">
                          <button
                            className="button explanation-button"
                            onClick={() => toggleShowExplanation(index, qIndex)}
                          >
                            {q.showExplanation ? "Hide Explanation" : "Show Explanation"}
                          </button>
                        </div>
                        {q.showExplanation && (
                          <div className="answer-section">
                            <div className="correct-answer-box">
                              Correct Answer: {String.fromCharCode(97 + q.correctAnswer.charCodeAt(0) - 97)}){' '}
                              {q.options[q.correctAnswer.charCodeAt(0) - 97]}{' '}
                              <span className="option-feedback">✓</span>
                            </div>
                            <p className="explanation-text">{q.explanation || "No explanation provided."}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {item.score.rawScore !== null && (
                  <p className="score-text">
                    Quiz Score: {item.score.rawScore}/5 ({item.score.percentage}%)
                  </p>
                )}
                <button className="button" onClick={() => toggleQuizView(index)}>
                  Back to Summary
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summarizer;