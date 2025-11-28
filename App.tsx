import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { FileUpload } from "./components/FileUpload";
import { Flashcards } from "./components/Flashcards";
import { Quiz } from "./components/Quiz";
import { MindMap } from "./components/MindMap";
import { Glossary } from "./components/Glossary";
import { Chat } from "./components/Chat";
import { AuthModal } from "./components/AuthModal";
import { AuthCallback } from "./components/AuthCallback";
import { useAuth } from "./context/AuthContext";
import {
  StudyMaterial,
  UserStats,
  UserLevel,
  ViewMode,
  DashboardTab,
  QuizResult,
} from "./types";
import {
  BookOpen,
  Brain,
  List,
  Sparkles,
  ChevronRight,
  FileText,
  MessageCircle,
  LayoutDashboard,
  ArrowLeft,
  Clock,
  LogIn,
} from "lucide-react";
import { api } from "./services/apiClient";

const App: React.FC = () => {
  const {
    user,
    isAuthenticated,
    logout,
    loading: authLoading,
    updateUserStats,
  } = useAuth();

  // Check if OAuth callback
  if (window.location.pathname === "/auth/callback") {
    return <AuthCallback />;
  }

  // -- State --
  const [view, setView] = useState<ViewMode>("home");
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    xp: user?.stats?.xp || 120,
    level: user?.stats?.level || UserLevel.STUDENT,
    streak: user?.stats?.streak || 0,
    achievements: user?.stats?.achievements || [],
    cardsLearned: user?.stats?.cardsLearned || 0,
    testsPassed: user?.stats?.testsPassed || 0,
  });

  // Sync user stats from context
  useEffect(() => {
    if (user) {
      setUserStats({
        xp: user.stats.xp,
        level: user.stats.level,
        streak: user.stats.streak,
        achievements: user.stats.achievements,
        cardsLearned: user.stats.cardsLearned,
        testsPassed: user.stats.testsPassed,
      });
    }
  }, [user]);

  // -- Persistence --
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        // Load user data from API
        loadUserData();
      } else {
        // Show auth modal or try localStorage for guest mode
        try {
          const savedMaterial = localStorage.getItem("examninja_material");
          if (savedMaterial) {
            const parsed = JSON.parse(savedMaterial);
            if (parsed && parsed.id) {
              setMaterial(parsed);
              setView("dashboard");
            }
          }

          const savedStats = localStorage.getItem("examninja_stats");
          if (savedStats) {
            setUserStats(JSON.parse(savedStats));
          }
        } catch (e) {
          console.error("Error loading from local storage", e);
        }
      }
    }
  }, [isAuthenticated, authLoading]);

  const loadUserData = async () => {
    try {
      const user = await api.getUser();
      setUserStats(user.stats);

      // Load latest material
      const materials = await api.getMaterials();
      if (materials && materials.length > 0) {
        const latest = materials[0];
        setMaterial({
          ...latest,
          id: latest._id,
          createdAt: new Date(latest.createdAt).getTime(),
        });
        setView("dashboard");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    if (material && !isAuthenticated) {
      localStorage.setItem("examninja_material", JSON.stringify(material));
    }
  }, [material, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("examninja_stats", JSON.stringify(userStats));
    }
  }, [userStats, isAuthenticated]);

  // -- Handlers --
  const handleMaterialProcessed = async (newMaterial: StudyMaterial) => {
    setMaterial(newMaterial);
    setView("dashboard");
    setActiveTab("overview");
    addXP(50);

    // Save to backend if authenticated
    if (isAuthenticated) {
      try {
        const saved = await api.createMaterial(newMaterial);
        setMaterial({
          ...saved,
          id: saved._id,
          createdAt: new Date(saved.createdAt).getTime(),
        });
      } catch (error) {
        console.error("Error saving material:", error);
      }
    }
  };

  const addXP = async (amount: number) => {
    setUserStats((prev) => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      if (newXP > 500) newLevel = UserLevel.BACHELOR;
      if (newXP > 1500) newLevel = UserLevel.MASTER;
      if (newXP > 3000) newLevel = UserLevel.PROFESSOR;

      const updatedStats = { ...prev, xp: newXP, level: newLevel };

      // Update context
      if (isAuthenticated && updateUserStats) {
        updateUserStats({ xp: newXP, level: newLevel });
      }

      return updatedStats;
    });

    // Update on backend if authenticated
    if (isAuthenticated) {
      try {
        await api.updateStats({ xpDelta: amount });
      } catch (error) {
        console.error("Error updating stats:", error);
      }
    }
  };

  const handleFlashcardComplete = async (score: number) => {
    addXP(score * 10);
    setUserStats((prev) => ({
      ...prev,
      cardsLearned: prev.cardsLearned + score,
    }));

    if (isAuthenticated) {
      try {
        await api.updateStats({ cardsLearned: score });
      } catch (error) {
        console.error("Error updating card stats:", error);
      }
    }

    setActiveTab("overview");
  };

  const handleCardUpdate = async (
    id: string,
    status: "new" | "learning" | "mastered",
    nextReview: number
  ) => {
    if (!material) return;
    const updatedCards = material.flashcards.map((c) =>
      c.id === id ? { ...c, status, nextReview } : c
    );
    setMaterial({ ...material, flashcards: updatedCards });

    // Update on backend if authenticated
    if (isAuthenticated && material.id) {
      try {
        await api.updateFlashcard(material.id, id, status, nextReview);
      } catch (error) {
        console.error("Error updating flashcard:", error);
      }
    }
  };

  const handleQuizFinish = async (result: QuizResult) => {
    addXP(result.scorePercentage);
    setUserStats((prev) => ({ ...prev, testsPassed: prev.testsPassed + 1 }));

    if (isAuthenticated && material) {
      try {
        await api.saveQuizResult({
          materialId: material.id,
          ...result,
        });
        await api.updateStats({ testsPassed: 1 });
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    }

    setActiveTab("overview");
  };

  const handleLogout = () => {
    logout();
    setMaterial(null);
    setView("home");
  };

  // -- Renderers --

  const renderHero = () => (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-bounce-slow">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Штучний інтелект для навчання
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-heading font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Вчись{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
            розумніше
          </span>
          <br />
          не важче.
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Завантаж свій конспект — отримай структуру, тести, ментальні карти та
          картки за лічені секунди. Твій особистий AI-репетитор вже тут.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() =>
              isAuthenticated ? setView("upload") : setShowAuthModal(true)
            }
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 rounded-2xl focus:outline-none hover:bg-slate-800 hover:scale-105 shadow-xl shadow-slate-900/30"
          >
            Почати безкоштовно
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 transition-all duration-200 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none hover:border-primary hover:text-primary hover:scale-105 shadow-lg"
            >
              <LogIn className="mr-2 w-5 h-5" />
              Увійти
            </button>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 max-w-7xl mx-auto space-y-24 px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 text-slate-900">
            Всі інструменти для навчання в одному місці
          </h2>
          <p className="text-lg text-slate-600 text-center mb-16 max-w-2xl mx-auto">
            Завантажуй конспекти і отримуй повний набір інтерактивних матеріалів за секунди
          </p>

          {/* Feature 1: Flashcards */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 lg:order-1">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Інтерактивні картки</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Вивчай матеріал за допомогою карток з плавною 3D анімацією. 
                Натисни на картку, щоб перевернути її та побачити відповідь. 
                Система автоматично генерує питання та відповіді з твого конспекту.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>3D анімація перевороту карток</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Автоматична генерація з конспекту</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Зручна навігація між картками</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:order-2">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 shadow-xl">
                <div className="text-center p-8">
                  <Sparkles className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Місце для скріну карток</p>
                  <p className="text-slate-400 text-sm mt-2">Розмір: 800x600px</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Quiz */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 lg:order-2">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Розумні тести</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Перевір свої знання за допомогою автоматично згенерованих тестів. 
                AI створює питання різної складності на основі твого матеріалу 
                з миттєвою перевіркою відповідей.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Різні типи питань (одна/кілька відповідей)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Миттєва перевірка з поясненнями</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Детальна статистика результатів</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:order-1">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 shadow-xl">
                <div className="text-center p-8">
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Місце для скріну тесту</p>
                  <p className="text-slate-400 text-sm mt-2">Розмір: 800x600px</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Mind Map */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 lg:order-1">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Ментальні карти</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Візуалізуй зв'язки між темами та концепціями у вигляді інтерактивної ментальної карти. 
                Бач всю картину матеріалу на одній діаграмі з можливістю масштабування та навігації.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Автоматична побудова зв'язків між темами</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Інтерактивна навігація та масштабування</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Експорт у різні формати</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:order-2">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 shadow-xl">
                <div className="text-center p-8">
                  <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Місце для скріну ментальної карти</p>
                  <p className="text-slate-400 text-sm mt-2">Розмір: 800x600px</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Chat */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 lg:order-2">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">AI-асистент</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Постав будь-яке питання по матеріалу та отримай детальну відповідь від AI. 
                Асистент знає весь контекст твого конспекту і може пояснити складні теми простою мовою.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Розуміє контекст твого матеріалу</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Детальні пояснення складних тем</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span>Історія всіх розмов зберігається</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:order-1">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 shadow-xl">
                <div className="text-center p-8">
                  <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Місце для скріну чату</p>
                  <p className="text-slate-400 text-sm mt-2">Розмір: 800x600px</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardNavigation = () => {
    const tabs: { id: DashboardTab; label: string; icon: React.FC<any> }[] = [
      { id: "overview", label: "Огляд", icon: LayoutDashboard },
      { id: "flashcards", label: "Картки", icon: Sparkles },
      { id: "quiz", label: "Тест", icon: BookOpen },
      { id: "mindmap", label: "Карта", icon: Brain },
      { id: "glossary", label: "Глосарій", icon: List },
      { id: "chat", label: "Чат", icon: MessageCircle },
    ];

    return (
      <div className="sticky top-24 z-40 flex justify-center mb-8">
        <div className="glass p-1.5 rounded-2xl flex overflow-x-auto no-scrollbar shadow-lg shadow-slate-200/50 border border-white/50 max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 text-sm
                    ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }
                `}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-indigo-300" : ""}`}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!material) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Summary Card - Wide */}
            <div className="md:col-span-2 lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-800">
                  Стислий зміст
                </h3>
              </div>
              <div className="prose prose-slate max-w-none leading-relaxed text-slate-600 text-lg">
                {material.summary}
              </div>
            </div>

            {/* Stats / Quick Actions Column */}
            <div className="md:col-span-1 lg:col-span-1 space-y-6">
              {/* Action: Quiz */}
              <div
                onClick={() => setActiveTab("quiz")}
                className="group bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
                <BookOpen className="w-8 h-8 mb-4 relative z-10" />
                <h3 className="text-xl font-bold font-heading relative z-10">
                  Пройти тест
                </h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
                  <span>Start Quiz</span> <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Action: Flashcards */}
              <div
                onClick={() => setActiveTab("flashcards")}
                className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-primary/50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-pink-50 rounded-xl text-secondary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500">
                    {material.flashcards.length} карток
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Флеш-картки
                </h3>
                <p className="text-sm text-slate-500">
                  Тренуй пам'ять за допомогою інтервальних повторень.
                </p>
              </div>

              {/* Info: Created At */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 text-slate-400 flex flex-col items-center justify-center text-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-medium">
                  Створено {new Date(material.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Key Facts - Full Width */}
            <div className="md:col-span-3 lg:col-span-4 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-6">
                Ключові факти
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {material.keyFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all"
                  >
                    <span className="text-2xl font-bold text-slate-200 font-heading leading-none">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "flashcards":
        return (
          <Flashcards
            key={material.id}
            cards={material.flashcards}
            onComplete={handleFlashcardComplete}
            onBack={() => setActiveTab("overview")}
            onUpdateCard={handleCardUpdate}
          />
        );
      case "quiz":
        return (
          <Quiz
            content={material.originalContent}
            onFinish={handleQuizFinish}
            onBack={() => setActiveTab("overview")}
          />
        );
      case "mindmap":
        return <MindMap data={material.mindMap} />;
      case "glossary":
        return <Glossary items={material.glossary} />;
      case "chat":
        return <Chat context={material.originalContent} />;
      default:
        return null;
    }
  };

  const renderDashboard = () => {
    if (!material) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 min-h-[calc(100vh-4rem)] pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <button
              onClick={() => setView("upload")}
              className="text-slate-400 hover:text-primary text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Завантажити інший файл
            </button>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 truncate max-w-2xl tracking-tight">
              {material.title}
            </h2>
          </div>
          {/* Actions can go here */}
        </div>

        {renderDashboardNavigation()}
        {renderTabContent()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      <Header
        stats={userStats}
        goHome={() => setView("home")}
        isAuthenticated={isAuthenticated}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        userName={user?.username}
        userAvatar={user?.avatar}
      />

      <main className="relative z-0">
        {view === "home" && renderHero()}
        {view === "upload" && (
          <FileUpload onProcessingComplete={handleMaterialProcessed} />
        )}
        {view === "dashboard" && renderDashboard()}
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default App;
