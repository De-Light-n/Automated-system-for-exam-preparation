import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
} from "@mui/material";

function ExamTrainer() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState("");

  // Mock questions
  const questions = [
    {
      id: 1,
      question: "Що таке алгоритм?",
      options: ["Послідовність дій", "Програма", "Функція", "Змінна"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Що таке рекурсія?",
      options: [
        "Цикл",
        "Функція, що викликає сама себе",
        "Умовний оператор",
        "Масив",
      ],
      correctAnswer: 1,
    },
  ];

  const handleStart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNext = () => {
    setAnswers({
      ...answers,
      [currentQuestion]: selectedAnswer,
    });
    setSelectedAnswer("");
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finish exam
      alert("Екзамен завершено!");
      setStarted(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!started) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Екзаменаційний тренажер
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Тренуйтесь перед екзаменом з обмеженням часу
        </Typography>

        <Paper sx={{ p: 4, mt: 3, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Готові розпочати тренувальний екзамен?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Кількість питань: {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Час: 60 хвилин
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            sx={{ mt: 2 }}
          >
            Розпочати
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Екзаменаційний тренажер
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Питання {currentQuestion + 1} з {questions.length}
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          {questions[currentQuestion].question}
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 3, width: "100%" }}>
          <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
            {questions[currentQuestion].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {currentQuestion < questions.length - 1 ? "Наступне" : "Завершити"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ExamTrainer;
