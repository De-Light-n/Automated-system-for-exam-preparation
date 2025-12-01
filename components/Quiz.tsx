import React, { useState, useEffect } from "react";
import { QuizQuestion, QuizResult } from "../types";
import {
  Check,
  X,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { generateQuiz } from "../services/grokService";
import { api } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

interface QuizProps {
  content: string;
  materialId?: string;
  resumeQuizId?: string;
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  content,
  materialId,
  resumeQuizId,
  onFinish,
  onBack,
}) => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isInputSubmitted, setIsInputSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState<string | undefined>(
    resumeQuizId
  );

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);

      // Спроба відновити незавершений тест
      if (resumeQuizId && isAuthenticated) {
        try {
          const savedQuiz = await api.resumeQuiz(resumeQuizId);
          if (savedQuiz) {
            // Відновлення стану з збереженого тесту
            setCurrentQIndex(savedQuiz.currentQuestionIndex || 0);
            setUserAnswers(
              savedQuiz.answers?.reduce((acc: any, ans: any) => {
                acc[ans.questionId] = ans.userAnswer;
                return acc;
              }, {}) || {}
            );
            // Генеруємо питання знову (або зберігайте їх у БД)
            const qs = await generateQuiz(content, "medium");
            setQuestions(qs);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Failed to resume quiz:", error);
        }
      }

      const qs = await generateQuiz(content, "medium");
      setQuestions(qs);
      setLoading(false);
    };
    loadQuiz();
  }, [content, resumeQuizId, isAuthenticated]);

  useEffect(() => {
    setSelectedOption(null);
    setTextInput("");
    setIsInputSubmitted(false);
  }, [currentQIndex]);

  const handleMultipleChoice = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    const currentQ = questions[currentQIndex];
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: option }));

    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleTextInputSubmit = () => {
    if (!textInput.trim()) return;
    const currentQ = questions[currentQIndex];
    setIsInputSubmitted(true);
    const normalizedInput = textInput.trim().toLowerCase();
    const normalizedCorrect = currentQ.correctAnswer.trim().toLowerCase();
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: textInput.trim() }));
    setSelectedOption(textInput.trim());
    if (normalizedInput === normalizedCorrect) setScore((prev) => prev + 1);
  };

  const nextQuestion = async () => {
    const nextIndex = currentQIndex + 1;

    // Автозбереження прогресу
    if (isAuthenticated && materialId && nextIndex < questions.length) {
      try {
        const answersArray = Object.entries(userAnswers).map(
          ([qId, answer]) => {
            const question = questions.find((q) => q.id === qId);
            return {
              questionId: qId,
              question: question?.question || "",
              options: question?.options || [],
              userAnswer: answer,
              correctAnswer: question?.correctAnswer || "",
              isCorrect: answer === question?.correctAnswer,
            };
          }
        );

        const savedQuiz = await api.saveQuizProgress({
          quizId: currentQuizId,
          materialId,
          currentQuestionIndex: nextIndex,
          answers: answersArray,
        });

        if (!currentQuizId) {
          setCurrentQuizId(savedQuiz._id);
        }
      } catch (error) {
        console.error("Failed to save quiz progress:", error);
      }
    }

    if (nextIndex < questions.length) {
      setCurrentQIndex(nextIndex);
    } else {
      setIsReviewing(true);
    }
  };

  const completeQuiz = async () => {
    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: score,
      scorePercentage: Math.round((score / questions.length) * 100),
      feedback:
        score > questions.length / 2
          ? "Хороший результат!"
          : "Варто повторити матеріал.",
      recommendations: ["Перегляньте глосарій", "Пройдіть флеш-картки"],
      userAnswers,
      questions,
    };

    // Зберегти завершений тест
    if (isAuthenticated && materialId) {
      try {
        await api.saveQuizResult({
          quizId: currentQuizId,
          materialId,
          ...result,
          answers: Object.entries(userAnswers).map(([qId, answer]) => {
            const question = questions.find((q) => q.id === qId);
            return {
              questionId: qId,
              question: question?.question || "",
              options: question?.options || [],
              userAnswer: answer,
              correctAnswer: question?.correctAnswer || "",
              isCorrect: answer === question?.correctAnswer,
            };
          }),
        });
      } catch (error) {
        console.error("Failed to save quiz result:", error);
      }
    }

    onFinish(result);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
        </div>
        <p className="text-slate-800 font-heading font-bold text-xl">
          AI генерує тест...
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Аналізуємо матеріал, формулюємо питання
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-slate-600 mb-4">
          Не вдалося згенерувати тест. Спробуйте пізніше.
        </p>
        <button onClick={onBack} className="text-primary hover:underline">
          Назад
        </button>
      </div>
    );
  }

  if (isReviewing) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="glass rounded-3xl p-10 text-center mb-10 border border-white/50 shadow-xl">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-lg shadow-primary/30 text-white">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-slate-800 mb-2">
            {percentage >= 80
              ? "Відмінний результат!"
              : percentage >= 50
              ? "Непогано!"
              : "Треба підучити"}
          </h2>
          <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary my-4">
            {score}/{questions.length}
          </div>
          <p className="text-slate-500 font-medium">Правильних відповідей</p>
        </div>

        <div className="space-y-6 mb-10">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id] || "";
            const isCorrect =
              userAnswer.toLowerCase().trim() ===
              q.correctAnswer.toLowerCase().trim();
            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border-l-4 shadow-sm bg-white ${
                  isCorrect ? "border-l-green-500" : "border-l-red-500"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isCorrect
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-lg mb-2">
                      {q.question}
                    </p>
                    <p className="text-slate-500 text-sm mb-3">
                      Ваша відповідь:{" "}
                      <span
                        className={
                          isCorrect
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold line-through"
                        }
                      >
                        {userAnswer}
                      </span>
                    </p>
                    {!isCorrect && (
                      <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-green-800 text-sm">
                        <span className="font-bold">Правильно:</span>{" "}
                        {q.correctAnswer}
                      </div>
                    )}
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                      <HelpCircle className="w-4 h-4 shrink-0" />
                      {q.explanation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={completeQuiz}
            className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-transform hover:scale-105"
          >
            Завершити тест
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const progress = ((currentQIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="font-bold text-slate-400 tabular-nums">
          {currentQIndex + 1}/{questions.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 min-h-[400px] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {currentQ.type === "multiple_choice"
              ? "Оберіть варіант"
              : currentQ.type === "true_false"
              ? "Так чи Ні"
              : "Заповніть пропуск"}
          </span>
          <p className="text-2xl md:text-3xl font-heading font-bold text-slate-900 leading-tight">
            {currentQ.question}
          </p>
        </div>

        <div className="space-y-3 flex-1">
          {(currentQ.type === "multiple_choice" ||
            currentQ.type === "true_false") &&
            currentQ.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnClass =
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden ";

              if (selectedOption) {
                if (isSelected) {
                  btnClass += isCorrect
                    ? "bg-green-50 border-green-500 text-green-800"
                    : "bg-red-50 border-red-500 text-red-800";
                } else if (isCorrect) {
                  btnClass +=
                    "bg-green-50 border-green-500 text-green-800 opacity-60";
                } else {
                  btnClass += "border-slate-100 opacity-40";
                }
              } else {
                btnClass +=
                  "border-slate-100 hover:border-primary hover:bg-slate-50 text-slate-700 hover:shadow-md";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleMultipleChoice(opt)}
                  disabled={!!selectedOption}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-bold text-lg">{opt}</span>
                    {selectedOption === opt &&
                      (isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ))}
                  </div>
                </button>
              );
            })}

          {currentQ.type === "fill_in_the_blank" && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isInputSubmitted}
                  placeholder="Впишіть відповідь..."
                  className={`w-full p-5 text-lg rounded-2xl border-2 outline-none transition-all font-medium
                            ${
                              isInputSubmitted
                                ? textInput.trim().toLowerCase() ===
                                  currentQ.correctAnswer.trim().toLowerCase()
                                  ? "bg-green-50 border-green-500 text-green-800"
                                  : "bg-red-50 border-red-500 text-red-800"
                                : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                            }
                          `}
                />
              </div>

              {!isInputSubmitted ? (
                <button
                  onClick={handleTextInputSubmit}
                  disabled={!textInput.trim()}
                  className="self-start px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Перевірити
                </button>
              ) : (
                textInput.trim().toLowerCase() !==
                  currentQ.correctAnswer.trim().toLowerCase() && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                      Правильна відповідь
                    </p>
                    <p className="text-lg font-bold">
                      {currentQ.correctAnswer}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Explanation / Footer */}
        {selectedOption && (
          <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:scale-105"
              >
                {currentQIndex === questions.length - 1 ? "Результат" : "Далі"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
