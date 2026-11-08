/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserState, TabState, UserPerks, BlikCoinPack, DailyChallengeId } from './types';
import { DashboardView } from './components/DashboardView';
import { LearnView } from './components/LearnView';
import { ArenaView } from './components/ArenaView';
import { ARENA_ENABLED } from './config/features';
import { MaturaSimulatorView } from './components/MaturaSimulatorView';
import { ProfileView } from './components/ProfileView';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { SessionRunner } from './components/SessionRunner';
import { RewardPopup } from './components/RewardPopup';
import { BlikCoinModal } from './components/BlikCoinModal';
import { auth, db, loginWithGoogle } from './lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, LogIn, User, X } from 'lucide-react';
import { restoreSessionState, clearSessionState } from './services/sessionRecoveryService';
import { OnboardingOverlay, OnboardingPreferences } from './components/OnboardingOverlay';
import { ProPopup } from './components/ProPopup';
import { ParentSponsorModal } from './components/ParentSponsorModal';
import { activatePro, deductHeart, refillHeartsWithCoins, getSyncedHearts } from './lib/heartsManager';
import { AuthModal } from './components/AuthModal';
import { GuestPromoModal } from './components/GuestPromoModal';
import { PromoFloatingPill } from './components/PromoFloatingPill';
import { 
  fetchPromotionConfig, 
  hasRealDiscount,
  PromotionConfig, 
  DEFAULT_GUEST_PROMOTION, 
  getGuestPromoRemainingSeconds, 
  formatPromoSeconds,
  hasSeenGuestPromoModal,
  markGuestPromoModalSeen 
} from './services/promotionService';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { AiTaskGeneratorModal } from './components/AiTaskGeneratorModal';
import { MistakesBankModal } from './components/MistakesBankModal';
import { ACHIEVEMENTS, ShopItem } from './data/achievements';
import { triggerHaptic, calculateStreakOnTaskCompletion, getTodayDateString, filterActualTaskIds, isActualTaskId } from './utils';
import { buildFirestoreUserPayload } from './schema_firestore';
import { checkSystemMetaVersion } from './lib/curriculumSync';
import { handleFirestoreError, OperationType } from './lib/firestoreErrors';
import { migrateGuestProgressToUser, hasGuestProgress } from './lib/guestMigration';
import { normalizeSubjectFirestoreId } from './services/ckeCatalogRepository';
import { initTheme } from './services/themeManager';
import { loadEnglishCurriculum } from './data/englishDataLoader';
import { loadMathCurriculum } from './data/mathDataLoader';
import { BrandBackgroundPattern } from './components/BrandBackgroundPattern';
import { ToastHost } from './components/ToastHost';
import { SubjectLobbyModal } from './components/SubjectLobbyModal';
import { PolishStudyHub } from './components/polish/PolishStudyHub';
import { EnglishStudyHub } from './components/english';
import { CkeFormulasModal } from './components/CkeFormulasModal';
import { EnglishDictionaryModal } from './components/english/EnglishDictionaryModal';
import { ScratchpadModal } from './components/ScratchpadModal';
import { DevHubModal } from './components/DevHubModal';
import { applyFullDeveloperAccess, isDevBuild, isDevModeActive, isDevAccessAllowed, getAllDevTaskIds } from './services/devService';
import { SubjectId, SubjectKey } from './types';
import { PolishPartNumber, PolishEpoch, PolishTaskType } from './types/maturaTypes';

import { LoadingScreen } from './components/Loading';

function getCurrentIsoWeekKey(): string {
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export default function App() {
  const [user, loading] = useAuthState(auth);
  const isGuest = !user;

  const [promoConfig, setPromoConfig] = useState<PromotionConfig>(DEFAULT_GUEST_PROMOTION);
  const [showGuestPromoModal, setShowGuestPromoModal] = useState(false);
  const [guestPromoSecondsLeft, setGuestPromoSecondsLeft] = useState<number>(() => getGuestPromoRemainingSeconds(DEFAULT_GUEST_PROMOTION.durationMinutes));
  const [activeAuthPromo, setActiveAuthPromo] = useState<PromotionConfig | null>(null);

  useEffect(() => {
    return initTheme();
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchPromotionConfig().then(cfg => {
      if (mounted) {
        setPromoConfig(cfg);
        setGuestPromoSecondsLeft(getGuestPromoRemainingSeconds(cfg.durationMinutes));
      }
    });

    const timer = setInterval(() => {
      setGuestPromoSecondsLeft(getGuestPromoRemainingSeconds(promoConfig.durationMinutes));
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [promoConfig.durationMinutes]);


  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
      if (isDevModeActive()) {
        return getAllDevTaskIds();
      }
      const stored = localStorage.getItem('matura_quest_completed_tasks');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Sanityzacja: zachowaj tylko znaczniki LESSON- oraz rzeczywiste zadania (bez gołych '1.1', '1-1')
      return Array.isArray(parsed) 
        ? parsed.filter(id => typeof id === 'string' && (id.startsWith('LESSON-') || isActualTaskId(id))) 
        : [];
    } catch {
      return isDevModeActive() ? getAllDevTaskIds() : [];
    }
  });
  const [taskStars, setTaskStars] = useState<Record<string, number>>(() => {
    try {
      if (isDevModeActive()) {
        const stars: Record<string, number> = {};
        getAllDevTaskIds().forEach(id => { stars[id] = 3; });
        return stars;
      }
      const stored = localStorage.getItem('matura_quest_task_stars');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [lessonMistakes, setLessonMistakes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('matura_quest_lesson_mistakes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Rule 1: Check system/meta version once upon startup (cached, 0 extra reads if up to date)
  useEffect(() => {
    checkSystemMetaVersion().catch(err => console.info("Curriculum meta check:", err));
  }, []);
  const [currentTab, setCurrentTab] = useState<TabState>(() => {
    try {
      const saved = localStorage.getItem('jasne_active_tab_v1');
      if (saved && ['dashboard', 'learn', 'nauka', 'simulator', ...(ARENA_ENABLED ? ['arena'] : []), 'profil', 'profile'].includes(saved)) {
        return (saved === 'nauka' ? 'learn' : saved === 'profile' ? 'profil' : saved) as TabState;
      }
    } catch {}
    return 'dashboard';
  });

  // Arena jest ukryta do premiery – każde przejście do niej (DevHub, stare linki) wraca na Dashboard
  useEffect(() => {
    if (!ARENA_ENABLED && currentTab === 'arena') setCurrentTab('dashboard');
  }, [currentTab]);

  useEffect(() => {
    try {
      localStorage.setItem('jasne_active_tab_v1', currentTab);
    } catch {}
  }, [currentTab]);

  // Reset scroll position to top when navigating between tabs
  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentTab]);
  const [activeTask, setActiveTask] = useState<boolean>(false);
  const [isSimulatorSessionActive, setIsSimulatorSessionActive] = useState<boolean>(false);
  const [simulatorInitialView, setSimulatorInitialView] = useState<'hub' | 'exam_setup' | 'full_exams' | 'maraton'>('hub');

  // Reset flagi aktywnej sesji symulatora po zmianie zakładki
  useEffect(() => {
    if (currentTab !== 'simulator') {
      setIsSimulatorSessionActive(false);
    }
  }, [currentTab]);

  const [activeTaskData, setActiveTaskData] = useState<any>(null);
  const [showResumedSessionBadge, setShowResumedSessionBadge] = useState<boolean>(false);

  // Session Recovery: Check and restore active interrupted session on startup (< 24h)
  useEffect(() => {
    let mounted = true;
    let badgeTimer: any = null;
    restoreSessionState().then(restored => {
      if (!mounted) return;
      if (restored && restored.tasks && restored.tasks.length > 0) {
        setActiveTaskData({
          ...restored,
          originTab: restored.originTab || 'learn',
          isSession: true,
          lessonTasks: restored.tasks,
          isRestoredSession: true
        });
        setActiveTask(true);
        setShowResumedSessionBadge(true);
        badgeTimer = setTimeout(() => {
          if (mounted) {
            setShowResumedSessionBadge(false);
          }
        }, 4500);
      }
    }).catch(err => {
      console.warn('[SessionRecovery] Startup recovery check failed:', err);
    });

    return () => {
      mounted = false;
      if (badgeTimer) {
        clearTimeout(badgeTimer);
      }
    };
  }, []);
  const [reward, setReward] = useState<{ 
    xp: number; 
    coins: number; 
    tokens?: number; 
    levelUp?: number; 
    title?: string; 
    description?: string; 
    bonusNote?: string 
  } | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [showProPopup, setShowProPopup] = useState(false);
  const [showParentSponsorModal, setShowParentSponsorModal] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [showBlikCoinModal, setShowBlikCoinModal] = useState(false);

  // Globalny skrót klawiszowy do Panelu Deweloperskiego: Ctrl + Shift + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowDevModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Propozycja konta i PRO NIE wyskakuje przy wejściu ani tuż po onboardingu (zero tarcia, Time-to-Value < 30 s).
  // Pokazujemy ją raz, po pierwszej ukończonej sesji – w momencie satysfakcji. Pływająca pigułka
  // (PromoFloatingPill) pojawia się tylko przy realnym rabacie skonfigurowanym w Firestore.
  const [currentSubject, setCurrentSubject] = useState<SubjectId>(() => {
    try {
      const stored = localStorage.getItem('matura_quest_current_subject');
      if (stored === 'polski' || stored === 'matematyka' || stored === 'angielski' || stored === 'biologia') {
        return stored as SubjectId;
      }
      const legacy = localStorage.getItem('matura_quest_selected_subject');
      if (legacy === 'pol') return 'polski';
    } catch {}
    return 'matematyka';
  });

  const [selectedSubjectKey, setSelectedSubjectKey] = useState<SubjectKey>(() => {
    try {
      const stored = localStorage.getItem('matura_quest_selected_subject');
      if (stored && ['math', 'pol', 'eng', 'math-roz', 'eng-roz'].includes(stored)) return stored as SubjectKey;
      const cur = localStorage.getItem('matura_quest_current_subject');
      if (cur === 'polski') return 'pol';
      if (cur === 'angielski') return 'eng';
    } catch {}
    return 'math';
  });

  // Dane matematyki (domyślny przedmiot) dociągamy w tle zaraz po pierwszym renderze
  useEffect(() => {
    loadMathCurriculum().catch(() => {});
  }, []);

  // Dane angielskiego dociągamy w tle, gdy tylko ten przedmiot staje się aktywny
  useEffect(() => {
    if (selectedSubjectKey === 'eng' || selectedSubjectKey === 'eng-roz') {
      loadEnglishCurriculum().catch(() => {});
    }
  }, [selectedSubjectKey]);

  const handleSelectSubject = (key: SubjectKey) => {
    setSelectedSubjectKey(key);
    const subId: SubjectId = key === 'pol' ? 'polski' : key === 'eng' ? 'angielski' : 'matematyka';
    setCurrentSubject(subId);
    try {
      // Zdarzenie emitujemy tylko przy realnej zmianie – inaczej nasłuch w DashboardView
      // (ze starą wartością w domknięciu) odbija wywołanie w nieskończoność.
      const changed = localStorage.getItem('matura_quest_selected_subject') !== key;
      localStorage.setItem('matura_quest_selected_subject', key);
      localStorage.setItem('matura_quest_current_subject', subId);
      if (changed) window.dispatchEvent(new Event('storage'));
    } catch {}
    setUserState(prev => ({
      ...prev,
      currentSubject: subId
    }));
  };

  const handleSelectSubjectId = (subId: SubjectId) => {
    setCurrentSubject(subId);
    const subKey: SubjectKey = subId === 'polski' ? 'pol' : subId === 'angielski' ? 'eng' : 'math';
    setSelectedSubjectKey(subKey);
    try {
      const changed = localStorage.getItem('matura_quest_selected_subject') !== subKey;
      localStorage.setItem('matura_quest_current_subject', subId);
      localStorage.setItem('matura_quest_selected_subject', subKey);
      if (changed) window.dispatchEvent(new Event('storage'));
    } catch {}
    setUserState(prev => ({
      ...prev,
      currentSubject: subId
    }));
  };

  const [showSubjectLobbyModal, setShowSubjectLobbyModal] = useState(false);
  const [showFormulasModal, setShowFormulasModal] = useState(false);
  const [showEnglishDictionaryModal, setShowEnglishDictionaryModal] = useState(false);
  const [showScratchpadModal, setShowScratchpadModal] = useState(false);

  const [polishHubInitialMode, setPolishHubInitialMode] = useState<'lessons' | 'task_browser'>('lessons');
  const [polishHubInitialLessonId, setPolishHubInitialLessonId] = useState<string | null>(null);
  const [polishHubInitialFilter, setPolishHubInitialFilter] = useState<{
    part?: PolishPartNumber | 'all';
    epoch?: PolishEpoch | 'all';
    type?: PolishTaskType | 'all';
  } | undefined>(undefined);

  const [englishHubInitialMode, setEnglishHubInitialMode] = useState<'lessons' | 'task_browser'>('lessons');
  const [englishHubInitialLessonId, setEnglishHubInitialLessonId] = useState<string | null>(null);

  const [isSubjectSheetOpen, setIsSubjectSheetOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'overview' | 'achievements' | 'perks'>('overview');
  const [showPolishStudyHub, setShowPolishStudyHub] = useState<boolean>(false);
  
  const [userState, setUserState] = useState<UserState>(() => {
    const defaultState: UserState = {
      xp: 0,
      coins: 0,
      gems: 0,
      level: 1,
      campusRust: 0,
      lastActive: Date.now(),
      arenaRating: 1000,
      arenaWins: 0,
      masteryTokens: 0,
      streakDays: 0,
      streakActiveDates: [],
      dailyTaskCounts: {},
      claimedAchievements: {},
      timeSpentTotalSeconds: 0,
      weeklyTimeSpentMinutes: 0,
      lastWeekKey: getCurrentIsoWeekKey(),
      hearts: 5,
      maxHearts: 5,
      isPro: false,
      lastHeartRegenTimestamp: Date.now(),
      aiVisionDailyCount: 0,
      perks: {
        xpBoostPercent: 0,
        coinBoostPercent: 0,
        streakFreezes: 0,
        arenaShields: 0,
        arenaTokenBonusPercent: 0,
        temporaryXpBoostCharges: 0,
      },
      maturaAttempts: 0,
      currentSubject: 'matematyka',
      completedLessonsPolish: [],
      completedTasksPolish: [],
      polishStats: { totalPoints: 0, completedCount: 0 }
    };

    try {
      const cachedAuth = localStorage.getItem('matura_quest_cached_user');
      const cachedGuest = localStorage.getItem('matura_quest_guest_user');
      const stored = cachedAuth || cachedGuest;
      let state = defaultState;
      if (stored) {
        const parsed = JSON.parse(stored);
        state = {
          ...defaultState,
          ...parsed,
          perks: { ...defaultState.perks, ...(parsed.perks || {}) }
        };
      }
      // Flaga dev zapisana w localStorage (np. przez dawne ?dev=1) nie może nic
      // odblokować w buildzie produkcyjnym.
      if (!isDevBuild()) state = { ...state, isDev: false };
      return isDevAccessAllowed() ? applyFullDeveloperAccess(state) : state;
    } catch {}

    return isDevAccessAllowed() ? applyFullDeveloperAccess(defaultState) : defaultState;
  });

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    if (user) {
      // 1. Sprawdź, czy w stanie lokalnym istnieją jakiekolwiek postępy gościa i wykonaj automatyczną migrację
      if (hasGuestProgress()) {
        migrateGuestProgressToUser(user).then((mergedResult) => {
          if (mergedResult && isMounted) {
            setUserState(prev => ({
              ...prev,
              ...mergedResult.userState
            }));
            setCompletedTasks(mergedResult.completedTasks);
            setTaskStars(mergedResult.taskStars);
          }
        }).catch(err => {
          console.error("Migration error in auth listener:", err);
        });
      }

      const userRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(userRef, async (snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;

          // Rule 2: Single-Document User State (users/{userId})
          const stats = data.stats || {};
          const streak = data.streak || {};
          const progress = data.progress || {};

          // Populate completed tasks and stars from single document (sanitizing legacy IDs)
          const rawLoaded = progress.completedTasks || data.completedTasks || [];
          const loadedCompleted = (Array.isArray(rawLoaded) ? rawLoaded : [])
            .filter((id: any) => typeof id === 'string' && (id.startsWith('LESSON-') || isActualTaskId(id)));
          const loadedStars = progress.taskStars || data.taskStars || {};
          
          if (isDevModeActive()) {
            const devTasks = getAllDevTaskIds();
            setCompletedTasks(devTasks);
            const stars: Record<string, number> = {};
            devTasks.forEach(id => { stars[id] = 3; });
            setTaskStars(stars);
          } else {
            setCompletedTasks(loadedCompleted);
            setTaskStars(loadedStars);
            try {
              localStorage.setItem("matura_quest_completed_tasks", JSON.stringify(loadedCompleted));
              localStorage.setItem("matura_quest_task_stars", JSON.stringify(loadedStars));
            } catch {}
          }

          // Populate completed_lessons list
          const rawCompletedLessons = data.completed_lessons || progress.completedLessons || [];
          const loadedCompletedLessons: string[] = Array.isArray(rawCompletedLessons)
            ? rawCompletedLessons
            : Object.keys(data.completedLessons || progress.completedLessons || {});

          setUserState(prev => {
            let nextState: UserState = {
              ...prev,
              ...data,
              xp: stats.xp ?? data.xp ?? prev.xp,
              coins: stats.coins ?? data.coins ?? prev.coins,
              gems: stats.gems ?? data.gems ?? prev.gems,
              level: stats.level ?? data.level ?? prev.level,
              arenaRating: stats.arenaRating ?? data.arenaRating ?? prev.arenaRating,
              arenaWins: stats.arenaWins ?? data.arenaWins ?? prev.arenaWins,
              masteryTokens: stats.masteryTokens ?? data.masteryTokens ?? prev.masteryTokens,
              streakDays: streak.currentDays ?? data.streakDays ?? prev.streakDays,
              lastStreakDate: streak.lastActiveDate ?? data.lastStreakDate ?? prev.lastStreakDate,
              streakActiveDates: streak.streakActiveDates ?? data.streakActiveDates ?? prev.streakActiveDates,
              dailyTaskCounts: streak.activityHistory ?? data.dailyTaskCounts ?? prev.dailyTaskCounts ?? {},
              timeSpentTotalSeconds: stats.timeSpentTotalSeconds ?? data.timeSpentTotalSeconds ?? prev.timeSpentTotalSeconds ?? 0,
              weeklyTimeSpentMinutes: stats.weeklyTimeSpentMinutes ?? data.weeklyTimeSpentMinutes ?? prev.weeklyTimeSpentMinutes ?? 0,
              lastWeekKey: stats.lastWeekKey ?? data.lastWeekKey ?? prev.lastWeekKey ?? getCurrentIsoWeekKey(),
              hearts: typeof data.hearts === 'number' ? data.hearts : (prev.hearts ?? 5),
              maxHearts: typeof data.maxHearts === 'number' ? data.maxHearts : (prev.maxHearts ?? 5),
              isPro: data.isPro ?? prev.isPro ?? false,
              lastHeartRegenTimestamp: data.lastHeartRegenTimestamp ?? prev.lastHeartRegenTimestamp ?? Date.now(),
              aiVisionDailyCount: data.aiVisionDailyCount ?? prev.aiVisionDailyCount ?? 0,
              lastVisionDate: data.lastVisionDate ?? prev.lastVisionDate,
              completed_lessons: loadedCompletedLessons,
              completedLessons: data.completedLessons || progress.completedLessons || prev.completedLessons || {},
              perks: {
                xpBoostPercent: 0,
                coinBoostPercent: 0,
                streakFreezes: 0,
                arenaShields: 0,
                arenaTokenBonusPercent: 0,
                temporaryXpBoostCharges: 0,
                ...(data.perks || {})
              },
              claimedAchievements: data.claimedAchievements || {}
            };

            if (isDevModeActive() || (isDevBuild() && prev.isDev)) {
              nextState = applyFullDeveloperAccess(nextState);
            }

            try {
              localStorage.setItem('matura_quest_cached_user', JSON.stringify(nextState));
            } catch {}
            return nextState;
          });

          if (!data.hasCompletedOnboarding && !isDevModeActive()) {
            setIsNewUser(true);
          }
        } else {
          // New User Setup - initialize and migrate any guest data
          const mergedResult = await migrateGuestProgressToUser(user);
          if (mergedResult && isMounted) {
            setUserState(prev => ({
              ...prev,
              ...mergedResult.userState
            }));
            setCompletedTasks(mergedResult.completedTasks);
            setTaskStars(mergedResult.taskStars);
            setIsNewUser(true);
          }
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      });
    } else if (!loading) {
      // Guest mode initialization from localStorage
      const savedGuest = localStorage.getItem('matura_quest_guest_user');
      if (savedGuest) {
        try {
          const parsed = JSON.parse(savedGuest);
          setUserState(prev => ({
            ...prev,
            ...parsed,
            isDev: isDevBuild() ? parsed.isDev : false,
            streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : (prev.streakDays || 0),
            streakActiveDates: Array.isArray(parsed.streakActiveDates) ? parsed.streakActiveDates : (prev.streakActiveDates || []),
            lastStreakDate: parsed.lastStreakDate || prev.lastStreakDate,
            completed_lessons: Array.isArray(parsed.completed_lessons) ? parsed.completed_lessons : (prev.completed_lessons || []),
            completedLessons: parsed.completedLessons || prev.completedLessons || {},
            hearts: typeof parsed.hearts === 'number' ? parsed.hearts : (prev.hearts ?? 5),
            maxHearts: typeof parsed.maxHearts === 'number' ? parsed.maxHearts : (prev.maxHearts ?? 5),
            isPro: parsed.isPro ?? prev.isPro ?? false,
            lastHeartRegenTimestamp: parsed.lastHeartRegenTimestamp ?? prev.lastHeartRegenTimestamp ?? Date.now(),
            aiVisionDailyCount: parsed.aiVisionDailyCount ?? prev.aiVisionDailyCount ?? 0,
            lastVisionDate: parsed.lastVisionDate ?? prev.lastVisionDate,
            perks: {
              xpBoostPercent: 0,
              coinBoostPercent: 0,
              streakFreezes: 0,
              arenaShields: 0,
              arenaTokenBonusPercent: 0,
              temporaryXpBoostCharges: 0,
              ...(parsed.perks || {})
            },
            claimedAchievements: parsed.claimedAchievements || {}
          }));
        } catch (e) {
          console.error("Failed to parse guest state:", e);
        }
      } else {
        setUserState({
          xp: 0,
          coins: 30,
          gems: 5,
          level: 1,
          campusRust: 0,
          lastActive: Date.now(),
          arenaRating: 1000,
          arenaWins: 0,
          masteryTokens: 0,
          streakDays: 0,
          streakActiveDates: [],
          claimedAchievements: {},
          completed_lessons: [],
          completedLessons: {},
          hearts: 5,
          maxHearts: 5,
          isPro: false,
          lastHeartRegenTimestamp: Date.now(),
          aiVisionDailyCount: 0,
          perks: {
            xpBoostPercent: 0,
            coinBoostPercent: 0,
            streakFreezes: 0,
            arenaShields: 0,
            arenaTokenBonusPercent: 0,
            temporaryXpBoostCharges: 0,
          },
          maturaAttempts: 0
        });
        setCompletedTasks([]);
        setTaskStars({});
        setLessonMistakes({});
        try {
          localStorage.removeItem('matura_quest_completed_tasks');
          localStorage.removeItem('matura_quest_task_stars');
          localStorage.removeItem('matura_quest_lesson_mistakes');
          localStorage.removeItem('matura_quest_cached_user');
        } catch {}
      }

      // Check if user has already completed onboarding
      const guestOnboardingCompleted = localStorage.getItem('matura_quest_onboarding_completed') === 'true';
      if (!guestOnboardingCompleted) {
        setTimeout(() => setShowGuestPrompt(true), 600);
      }
    }
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user, loading]);

  const handleOnboardingComplete = async (prefs: OnboardingPreferences, shouldOpenAuth: boolean = false, solvedDemoTask: boolean = true) => {
    triggerHaptic('success');
    const todayStr = getTodayDateString();

    const currentStreakDates = userState.streakActiveDates || [];
    const updatedStreakDates = currentStreakDates.includes(todayStr)
      ? currentStreakDates
      : [...currentStreakDates, todayStr];

    const currentDailyCounts = userState.dailyTaskCounts || {};
    const updatedDailyCounts = {
      ...currentDailyCounts,
      [todayStr]: (currentDailyCounts[todayStr] || 0) + 1
    };

    // Nagroda (XP, monety, dzień serii, zadanie dnia) tylko za rozwiązane zadanie demo – samo „Pomiń” jej nie daje
    const updatedState: UserState = solvedDemoTask ? {
      ...userState,
      xp: (userState.xp || 0) + 15,
      coins: (userState.coins || 0) + 10,
      streakDays: Math.max(1, userState.streakDays || 1),
      lastStreakDate: todayStr,
      streakActiveDates: updatedStreakDates,
      dailyTaskCounts: updatedDailyCounts,
      hasCompletedOnboarding: true,
      onboardingPreferences: prefs
    } : {
      ...userState,
      hasCompletedOnboarding: true,
      onboardingPreferences: prefs
    };

    setUserState(updatedState);
    await saveUserData(updatedState);

    try {
      localStorage.setItem('matura_quest_onboarding_completed', 'true');
      localStorage.setItem('matura_quest_onboarding_prefs', JSON.stringify(prefs));
      localStorage.setItem('matura_quest_selected_subject', 'math');
    } catch (e) {}

    // Domyślny przedmiot: Matematyka Podstawowa
    setSelectedSubjectKey('math');

    setShowGuestPrompt(false);
    setIsNewUser(false);
    setCurrentTab('dashboard');

    if (shouldOpenAuth) {
      setTimeout(() => setShowAuthModal(true), 400);

    } else if (solvedDemoTask) {
      setReward({
        xp: 15,
        coins: 10,
        title: 'Plan Nauki Uruchomiony!',
        bonusNote: 'Dzień 1 Serii rozpalony! Powodzenia w Dziale 1.'
      });
    }
  };

  const saveUserData = async (newState: UserState) => {
    if (user) {
      try {
        localStorage.setItem('matura_quest_cached_user', JSON.stringify(newState));
      } catch {}
      try {
        const userRef = doc(db, 'users', user.uid);
        const payload = buildFirestoreUserPayload(
          newState,
          completedTasks,
          taskStars,
          (userState as any).completedLessons || {},
          user
        );
        await setDoc(userRef, payload, { merge: true });
      } catch (err) {
        console.error("Failed to save user data to Firestore:", err);
      }
    } else {
      try {
        localStorage.setItem('matura_quest_guest_user', JSON.stringify(newState));
      } catch (e) {
        console.error("Failed to save guest state to localStorage:", e);
      }
    }
  };

  const handleStartTask = (task?: any, lessonTasks?: any[], lessonTitle?: string, nextLesson?: any) => {
    try {
      const stored = localStorage.getItem('matura_quest_last_viewed');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('matura_quest_last_viewed', JSON.stringify({
        ...parsed,
        viewState: 'lessons'
      }));
    } catch {}

    if (!task?.isRestoredSession) {
      clearSessionState().catch(() => {});
    }

    const isEng = Boolean(task?.isEnglish || (selectedSubjectKey === 'eng') || task?.subjectId === 'jezyk-angielski' || task?.subjectKey === 'eng');
    const isPol = !isEng && Boolean(task?.isPolish || (selectedSubjectKey === 'pol') || task?.subjectId === 'jezyk-polski' || task?.subjectKey === 'pol');

    const tasksList = lessonTasks || task?.tasks || task?.lessonTasks || (task ? [task] : []);

    setActiveTaskData({
      ...(task || {}),
      isEnglish: isEng,
      isPolish: isPol,
      subjectKey: task?.subjectKey || selectedSubjectKey,
      subjectId: task?.subjectId || (isEng ? 'jezyk-angielski' : isPol ? 'jezyk-polski' : 'matematyka-podstawowa'),
      originTab: task?.originTab || currentTab,
      isSession: true,
      tasks: tasksList,
      lessonTasks: tasksList,
      lessonTitle: lessonTitle || task?.lessonTitle || task?.topic || 'Lekcja',
      nextLesson: nextLesson || task?.nextLesson
    });
    setActiveTask(true);
  };

  const handleCancelTask = () => {
    clearSessionState().catch(() => {});
    setActiveTask(false);
    const rawOrigin = (activeTaskData?.originTab as string) || 'learn';
    const origin = (rawOrigin === 'nauka' ? 'learn' : rawOrigin === 'profile' ? 'profil' : rawOrigin) as TabState;
    setCurrentTab(origin);
    setActiveTaskData(null);
  };

  const handleStartRehabSession = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return;
    const sessionPayload = {
      isSession: true,
      isPolish: selectedSubjectKey === 'pol',
      isEnglish: selectedSubjectKey === 'eng',
      subjectId: normalizeSubjectFirestoreId(selectedSubjectKey),
      topicId: 'rehab-mistakes',
      lessonId: 'rehab',
      lessonTitle: 'Trening Błędów: Sesja Rehabilitacji',
      tasks,
      firstTask: tasks[0],
      allTasks: tasks,
      allTaskIdsToMarkCompleted: tasks.map((t: any) => t.id),
      required_correct_tasks: tasks.length,
      estimated_time_formatted: `~${tasks.length * 2} min`
    };
    handleStartTask(sessionPayload, tasks, sessionPayload.lessonTitle);
  };

  const handleCompleteDiagnostic = (assessedPercent: number, correctCount: number, _totalCount: number) => {
    const diagCoins = Math.min(50, Math.max(30, 25 + correctCount * 3));
    setUserState(prev => {
      const next: UserState = {
        ...prev,
        maturaBestScore: Math.max(prev.maturaBestScore || 0, assessedPercent),
        maturaAttempts: Math.max(1, (prev.maturaAttempts || 0) + 1),
        xp: (prev.xp || 0) + correctCount * 25 + 50,
        coins: (prev.coins || 0) + diagCoins,
      };
      saveUserData(next);
      return next;
    });
    setReward({
      xp: correctCount * 25 + 50,
      coins: diagCoins,
      title: 'Diagnoza Poziomu Zakończona!',
      description: `Twój wynik to ${assessedPercent}%. Twój Predyktor Maturalny został zaktualizowany!`
    });
  };

  // Rule 3: Single atomic write per lesson completion (No write-bombing, 0 writes during questions)
  const handleCompleteTask = async (
    taskIds?: string | string[],
    stars: number = 3,
    earnedXp: number = 30,
    earnedCoins: number = 10,
    nextLesson?: any,
    sessionDurationSeconds: number = 0,
    mistakesCount: number = 0
  ) => {
    const rawIdsToAdd = Array.isArray(taskIds) 
      ? taskIds 
      : (taskIds ? [taskIds] : []);

    // Rozdziel rzeczywiste zadania od znaczników lekcji
    const validSolvedTaskIds = filterActualTaskIds(rawIdsToAdd);
    const lessonTagsFromPayload = rawIdsToAdd.filter(id => typeof id === 'string' && id.startsWith('LESSON-'));

    let currentCompleted = [...completedTasks];
    let newTaskStars = { ...taskStars };

    // Dodaj wyłącznie poprawnie rozwiązane zadania
    validSolvedTaskIds.forEach(id => {
      if (!currentCompleted.includes(id)) {
        currentCompleted.push(id);
      }
      newTaskStars[id] = Math.max(newTaskStars[id] || 0, stars);
    });

    // Dodaj znaczniki lekcji (zawsze z prefiksem LESSON-)
    lessonTagsFromPayload.forEach(tag => {
      if (!currentCompleted.includes(tag)) {
        currentCompleted.push(tag);
      }
    });

    const todayStr = getTodayDateString();

    // Determine lesson key (e.g. "1.1") from lessonTitle or lessonId
    const rawLessonId = String(activeTaskData?.lessonId || '');
    const cleanLessonId = rawLessonId.replace(/^(?:pol|eng|mat-roz|math-roz|eng-roz)?[-_]?lesson[-_]?/i, '');
    const dotLessonId = cleanLessonId.replace('-', '.');
    const lessonTitle = activeTaskData?.lessonTitle || '';
    const match = lessonTitle.match(/(?:Lekcja\s+|[\d]+:|^)([\d]+[.-][\d]+)/i) || lessonTitle.match(/([\d]+\.[\d]+)/);
    const lessonKey = match ? match[1].replace('-', '.') : (dotLessonId || '1.1');

    // Rejestruj znaczniki ukończenia lekcji WYŁĄCZNIE z prefiksem LESSON- (żeby nie fałszowały statystyk zadań)
    const extraLessonTags = [
      `LESSON-${rawLessonId}`,
      `LESSON-${cleanLessonId}`,
      `LESSON-${dotLessonId}`,
      `LESSON-${lessonKey}`
    ].filter(Boolean);

    extraLessonTags.forEach(tag => {
      if (!currentCompleted.includes(tag)) {
        currentCompleted.push(tag);
      }
    });

    setCompletedTasks(currentCompleted);
    setTaskStars(newTaskStars);
    try {
      localStorage.setItem("matura_quest_completed_tasks", JSON.stringify(currentCompleted));
      localStorage.setItem("matura_quest_task_stars", JSON.stringify(newTaskStars));
    } catch (e) {
      console.error("Error saving local cache progress:", e);
    }

    // Update lesson mistakes record
    if (rawLessonId || lessonKey) {
      const updatedMistakes = {
        ...lessonMistakes,
        [rawLessonId]: mistakesCount,
        [cleanLessonId]: mistakesCount,
        [dotLessonId]: mistakesCount,
        [lessonKey]: mistakesCount
      };
      setLessonMistakes(updatedMistakes);
      try {
        localStorage.setItem("matura_quest_lesson_mistakes", JSON.stringify(updatedMistakes));
      } catch (e) {}
    }

    setUserState(prev => {
      const isDoubleXp = (prev.perks?.temporaryXpBoostCharges || 0) > 0;
      const xpBoostPct = prev.perks?.xpBoostPercent || 0;
      const baseXp = isDoubleXp ? earnedXp * 2 : earnedXp;
      const xpGained = Math.round(baseXp * (1 + xpBoostPct / 100));

      const coinBoostPct = prev.perks?.coinBoostPercent || 0;
      const coinsGained = Math.round(earnedCoins * (1 + coinBoostPct / 100));

      // Dzienna liczba rozwiązanych zadań zwiększa się WYŁĄCZNIE o faktycznie poprawnie rozwiązane zadania
      const newlySolvedCount = validSolvedTaskIds.length;

      // Złoty Zrzut PRO: +30 monet dziennie po ukończeniu min. 1 lekcji
      const isProDailyDropEligible = Boolean(prev.isPro && prev.lastProCoinDropDate !== todayStr);
      const proCoinsGained = isProDailyDropEligible ? 30 : 0;

      // Wyzwania Dnia: aktualizacja liczby zadań i flagi Czystej Lekcji
      const isPerfect = (mistakesCount || 0) === 0;
      const currentDailyChallengeState = prev.dailyChallengesState?.[todayStr] || {};
      const updatedDailyChallengeState = {
        ...(prev.dailyChallengesState || {}),
        [todayStr]: {
          tasksCount: ((prev.dailyTaskCounts || {})[todayStr] || 0) + newlySolvedCount,
          perfectLesson: Boolean(currentDailyChallengeState.perfectLesson || isPerfect),
          reviewOrArenaDone: Boolean(currentDailyChallengeState.reviewOrArenaDone || false)
        }
      };

      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1;

      const newCharges = isDoubleXp 
        ? Math.max(0, (prev.perks?.temporaryXpBoostCharges || 1) - 1) 
        : (prev.perks?.temporaryXpBoostCharges || 0);

      const streakCalc = calculateStreakOnTaskCompletion(
        prev.streakDays || 0,
        prev.lastStreakDate,
        prev.streakActiveDates || []
      );
      const updatedDailyCounts = {
        ...(prev.dailyTaskCounts || {}),
        [todayStr]: ((prev.dailyTaskCounts || {})[todayStr] || 0) + newlySolvedCount
      };

      const existingCompletedLessons = (prev as any).progress?.completedLessons || (prev as any).completedLessons || {};
      const lessonCompletionRecord = {
        status: 'COMPLETED' as const,
        accuracy: 100,
        xpEarned: xpGained,
        completedAt: new Date().toISOString()
      };
      const updatedCompletedLessons = {
        ...existingCompletedLessons,
        [lessonKey]: lessonCompletionRecord,
        [rawLessonId]: lessonCompletionRecord,
        [cleanLessonId]: lessonCompletionRecord,
        [dotLessonId]: lessonCompletionRecord,
        [`lesson-${cleanLessonId}`]: lessonCompletionRecord
      };

      const updatedCompletedLessonsArray = Array.from(new Set([
        ...(prev.completed_lessons || []),
        lessonKey,
        rawLessonId,
        cleanLessonId,
        dotLessonId,
        `lesson-${cleanLessonId}`,
        `lesson-${dotLessonId.replace('.', '-')}`
      ])).filter(Boolean);

      // Active Time Tracking Engine: total seconds + weekly minutes with Monday 00:00 reset
      const currentWeekKey = getCurrentIsoWeekKey();
      const isNewWeek = prev.lastWeekKey && prev.lastWeekKey !== currentWeekKey;
      const baseWeeklyMinutes = isNewWeek ? 0 : (prev.weeklyTimeSpentMinutes || 0);
      const addedMinutes = sessionDurationSeconds >= 15 
        ? Math.max(1, Math.round(sessionDurationSeconds / 60)) 
        : Math.round(sessionDurationSeconds / 60);
      const updatedWeeklyMinutes = baseWeeklyMinutes + addedMinutes;
      const updatedTotalSeconds = (prev.timeSpentTotalSeconds || 0) + sessionDurationSeconds;

      const newState: UserState = {
        ...prev,
        xp: newXp,
        coins: prev.coins + coinsGained + proCoinsGained,
        lastProCoinDropDate: isProDailyDropEligible ? todayStr : prev.lastProCoinDropDate,
        dailyChallengesState: updatedDailyChallengeState,
        level: newLevel,
        streakDays: streakCalc.newStreakDays,
        lastStreakDate: streakCalc.newLastStreakDate,
        streakActiveDates: streakCalc.newStreakActiveDates,
        dailyTaskCounts: updatedDailyCounts,
        campusRust: Math.max(0, prev.campusRust - 15),
        lastActive: Date.now(),
        timeSpentTotalSeconds: updatedTotalSeconds,
        weeklyTimeSpentMinutes: updatedWeeklyMinutes,
        lastWeekKey: currentWeekKey,
        completed_lessons: updatedCompletedLessonsArray,
        completedLessons: updatedCompletedLessons,
        perks: {
          ...prev.perks!,
          temporaryXpBoostCharges: newCharges
        }
      };

      // Rule 3: EXACTLY ONE atomic write per completed lesson to users/{userId}
      const singleDocPayload = buildFirestoreUserPayload(
        newState,
        currentCompleted,
        newTaskStars,
        updatedCompletedLessons,
        user
      );

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, singleDocPayload, { merge: true }).catch(err => {
          console.warn("Offline or sync deferred to local Firestore cache:", err);
        });

        // KROK 2: Write progress to subcollection users/{userId}/progress/{topicId}
        const topicId = activeTaskData?.topicId || 'dzial-1';
        const progressRef = doc(db, 'users', user.uid, 'progress', topicId);
        setDoc(progressRef, {
          topic_id: topicId,
          completedLessons: updatedCompletedLessons,
          completedTasks: currentCompleted,
          taskStars: newTaskStars,
          mistakesCount: mistakesCount || 0,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          console.warn("Topic progress subcollection sync deferred:", err);
        });
      } else {
        localStorage.setItem('matura_quest_guest_user', JSON.stringify(singleDocPayload));
      }

      return {
        ...newState,
        ...singleDocPayload
      };
    });

    clearSessionState().catch(() => {});

    if (nextLesson) {
      handleStartTask(
        nextLesson, 
        nextLesson.lessonTasks || [nextLesson], 
        nextLesson.lessonTitle || nextLesson.title || 'Kolejna Lekcja', 
        nextLesson.nextLesson
      );
    } else {
      setActiveTask(false);
      const rawOrigin = (activeTaskData?.originTab as string) || 'learn';
      const origin = (rawOrigin === 'nauka' ? 'learn' : rawOrigin === 'profile' ? 'profil' : rawOrigin) as TabState;
      setCurrentTab(origin);
      setActiveTaskData(null);
      if (isGuest && guestPromoSecondsLeft > 0 && !hasSeenGuestPromoModal()) {
        setTimeout(() => {
          setShowGuestPromoModal(true);
          markGuestPromoModalSeen();
        }, 600);
      }
    }
  };

  const handleCkeTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) return prev;
      const updated = [...prev, taskId];
      try {
        localStorage.setItem("matura_quest_completed_tasks", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleMaturaReward = (baseXp: number, baseCoins: number, showModal: boolean = false) => {
    setUserState(prev => {
      const xpBoostPct = prev.perks?.xpBoostPercent || 0;
      const xpGained = Math.round(baseXp * (1 + xpBoostPct / 100));

      const coinBoostPct = prev.perks?.coinBoostPercent || 0;
      const coinsGained = Math.round(baseCoins * (1 + coinBoostPct / 100));

      const newXp = prev.xp + xpGained;
      const prevLevel = prev.level;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const isLevelUp = newLevel > prevLevel;

      if (showModal || isLevelUp) {
        const bonusLabels: string[] = [];
        if (xpBoostPct > 0) bonusLabels.push(`+${xpBoostPct}% XP z Odznak`);
        if (coinBoostPct > 0) bonusLabels.push(`+${coinBoostPct}% Monet`);

        setReward({
          xp: xpGained,
          coins: coinsGained,
          levelUp: isLevelUp ? newLevel : undefined,
          bonusNote: bonusLabels.length > 0 ? bonusLabels.join(' • ') : undefined
        });
      }

      const newState = {
        ...prev,
        xp: newXp,
        coins: prev.coins + coinsGained,
        level: newLevel,
        maturaAttempts: (prev.maturaAttempts || 0) + 1,
        campusRust: Math.max(0, prev.campusRust - 25),
        lastActive: Date.now()
      };
      saveUserData(newState);
      return newState;
    });
  };

  const handlePolishLessonComplete = (lessonId: string, pointsEarned: number) => {
    const cleanId = lessonId.replace(/^lesson-/, '');
    const xpReward = Math.max(50, pointsEarned * 8);
    const coinsReward = Math.max(15, Math.round(pointsEarned * 1.5));
    handleMaturaReward(xpReward, coinsReward, true);

    setUserState(prev => {
      const prevCompleted = prev.completedLessonsPolish || [];
      const updatedCompleted = prevCompleted.includes(cleanId) ? prevCompleted : [...prevCompleted, cleanId];
      const nextPolishStats = {
        totalPoints: (prev.polishStats?.totalPoints || 0) + pointsEarned,
        completedCount: updatedCompleted.length,
        lastLessonId: cleanId
      };
      const streakResult = calculateStreakOnTaskCompletion(prev.streakDays, prev.lastStreakDate);
      const newState: UserState = {
        ...prev,
        completedLessonsPolish: updatedCompleted,
        polishStats: nextPolishStats,
        streakDays: streakResult.newStreakDays,
        lastStreakDate: streakResult.newLastStreakDate,
        streakActiveDates: streakResult.newStreakActiveDates,
        lastActive: Date.now()
      };
      saveUserData(newState);
      return newState;
    });
  };

  const handleEnglishLessonComplete = (lessonId: string, pointsEarned: number) => {
    const cleanId = lessonId.replace(/^eng-lesson-/, 'eng-');
    const xpReward = Math.max(50, pointsEarned * 8);
    const coinsReward = Math.max(15, Math.round(pointsEarned * 1.5));
    handleMaturaReward(xpReward, coinsReward, true);

    setUserState(prev => {
      const prevCompleted = prev.completedLessonsEnglish || [];
      const updatedCompleted = prevCompleted.includes(lessonId) 
        ? prevCompleted 
        : [...prevCompleted, lessonId, cleanId];
      const streakResult = calculateStreakOnTaskCompletion(prev.streakDays, prev.lastStreakDate);
      const newState: UserState = {
        ...prev,
        completedLessonsEnglish: updatedCompleted,
        streakDays: streakResult.newStreakDays,
        lastStreakDate: streakResult.newLastStreakDate,
        streakActiveDates: streakResult.newStreakActiveDates,
        lastActive: Date.now()
      };
      saveUserData(newState);
      return newState;
    });
  };

  const handlePolishTaskComplete = (taskId: string, pointsEarned: number) => {
    if (taskId.startsWith('lesson-')) {
      handlePolishLessonComplete(taskId, pointsEarned);
      return;
    }

    const xpReward = Math.max(20, pointsEarned * 5);
    const coinsReward = Math.max(5, pointsEarned);
    handleMaturaReward(xpReward, coinsReward, true);

    setUserState(prev => {
      const prevCompleted = prev.completedTasksPolish || [];
      const updatedCompleted = prevCompleted.includes(taskId) ? prevCompleted : [...prevCompleted, taskId];
      const nextPolishStats = {
        totalPoints: (prev.polishStats?.totalPoints || 0) + pointsEarned,
        completedCount: prev.completedLessonsPolish?.length || 0,
        lastLessonId: prev.polishStats?.lastLessonId
      };
      const streakResult = calculateStreakOnTaskCompletion(prev.streakDays, prev.lastStreakDate);
      const newState: UserState = {
        ...prev,
        completedTasksPolish: updatedCompleted,
        polishStats: nextPolishStats,
        streakDays: streakResult.newStreakDays,
        lastStreakDate: streakResult.newLastStreakDate,
        streakActiveDates: streakResult.newStreakActiveDates,
        lastActive: Date.now()
      };
      saveUserData(newState);
      return newState;
    });
  };

  const handleClaimAchievement = (achievementId: string, tierNumber: number) => {
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return;
    const tier = ach.tiers.find(t => t.tier === tierNumber);
    if (!tier) return;

    setUserState(prev => {
      const currentClaimed = prev.claimedAchievements?.[achievementId] || 0;
      if (currentClaimed >= tierNumber) return prev;

      const rewardXp = tier.rewardXp || 0;
      const rewardCoins = tier.rewardCoins || 0;
      const rewardTokens = tier.rewardTokens || 0;

      const newXp = prev.xp + rewardXp;
      const newCoins = prev.coins + rewardCoins;
      const newTokens = (prev.masteryTokens || 0) + rewardTokens;

      const prevLevel = prev.level;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const isLevelUp = newLevel > prevLevel;

      const perk = tier.perkEffect;
      const updatedPerks: UserPerks = {
        xpBoostPercent: (prev.perks?.xpBoostPercent || 0) + (perk?.xpBoostPercent || 0),
        coinBoostPercent: (prev.perks?.coinBoostPercent || 0) + (perk?.coinBoostPercent || 0),
        streakFreezes: (prev.perks?.streakFreezes || 0) + (perk?.streakFreezes || 0),
        arenaShields: (prev.perks?.arenaShields || 0) + (perk?.arenaShields || 0),
        arenaTokenBonusPercent: (prev.perks?.arenaTokenBonusPercent || 0) + (perk?.arenaTokenBonusPercent || 0),
        temporaryXpBoostCharges: (prev.perks?.temporaryXpBoostCharges || 0) + (perk?.temporaryXpBoostCharges || 0),
      };

      const updatedClaimed = {
        ...(prev.claimedAchievements || {}),
        [achievementId]: tierNumber
      };

      const newState: UserState = {
        ...prev,
        xp: newXp,
        coins: newCoins,
        masteryTokens: newTokens,
        level: newLevel,
        perks: updatedPerks,
        claimedAchievements: updatedClaimed
      };

      setReward({
        xp: rewardXp,
        coins: rewardCoins,
        tokens: rewardTokens,
        levelUp: isLevelUp ? newLevel : undefined,
        title: `Odznaka: ${ach.name}!`,
        description: `Odebrano nagrody za poziom ${tierNumber} oraz stały bonus do konta!`
      });

      triggerHaptic('success');
      saveUserData(newState);
      return newState;
    });
  };

  const handleBuyShopItem = (item: ShopItem, currency: 'tokens' | 'coins'): boolean => {
    let success = false;
    setUserState(prev => {
      // Egzekwowanie limitów ekwipunku: Streak Freeze (max 2), Tarcze Areny (max 3)
      if (item.effectType === 'streakFreeze' && (prev.perks?.streakFreezes || 0) >= 2) {
        return prev;
      }
      if (item.effectType === 'arenaShield' && (prev.perks?.arenaShields || 0) >= 3) {
        return prev;
      }

      if (currency === 'tokens') {
        if ((prev.masteryTokens || 0) < item.tokenPrice) return prev;
      } else {
        if (prev.coins < item.coinPrice) return prev;
      }

      success = true;
      const newTokens = currency === 'tokens' ? (prev.masteryTokens || 0) - item.tokenPrice : (prev.masteryTokens || 0);
      const newCoins = currency === 'coins' ? prev.coins - item.coinPrice : prev.coins;

      const updatedPerks: UserPerks = {
        xpBoostPercent: prev.perks?.xpBoostPercent || 0,
        coinBoostPercent: prev.perks?.coinBoostPercent || 0,
        streakFreezes: (prev.perks?.streakFreezes || 0) + (item.effectType === 'streakFreeze' ? item.amount : 0),
        arenaShields: (prev.perks?.arenaShields || 0) + (item.effectType === 'arenaShield' ? item.amount : 0),
        arenaTokenBonusPercent: prev.perks?.arenaTokenBonusPercent || 0,
        temporaryXpBoostCharges: (prev.perks?.temporaryXpBoostCharges || 0) + (item.effectType === 'xpDouble' ? item.amount : 0),
      };

      const newState: UserState = {
        ...prev,
        masteryTokens: newTokens,
        coins: newCoins,
        perks: updatedPerks
      };

      triggerHaptic('heavy');
      saveUserData(newState);
      return newState;
    });
    return success;
  };

  const handleClaimDailyChallenge = (challengeId: DailyChallengeId, rewardCoins: number) => {
    const todayStr = getTodayDateString();
    setUserState(prev => {
      const alreadyClaimed = prev.dailyChallengesClaimed?.[todayStr] || [];
      if (alreadyClaimed.includes(challengeId)) return prev;

      const updatedClaimed = {
        ...(prev.dailyChallengesClaimed || {}),
        [todayStr]: [...alreadyClaimed, challengeId]
      };

      const newState: UserState = {
        ...prev,
        coins: (prev.coins || 0) + rewardCoins,
        dailyChallengesClaimed: updatedClaimed
      };

      saveUserData(newState);
      return newState;
    });
  };

  const handleBuyBlikCoins = (pack: BlikCoinPack): boolean => {
    setUserState(prev => {
      const newState: UserState = {
        ...prev,
        coins: (prev.coins || 0) + pack.coins
      };
      saveUserData(newState);
      return newState;
    });
    return true;
  };

  const handleUseStreakFreeze = () => {
    setUserState(prev => {
      if ((prev.perks?.streakFreezes || 0) <= 0) return prev;
      const newState: UserState = {
        ...prev,
        campusRust: 0,
        perks: {
          ...prev.perks!,
          streakFreezes: Math.max(0, (prev.perks?.streakFreezes || 1) - 1)
        }
      };
      triggerHaptic('success');
      saveUserData(newState);
      return newState;
    });
  };

  const handleDeductCoins = (amount: number): boolean => {
    if ((userState.coins || 0) < amount) return false;
    const newCoins = Math.max(0, (userState.coins || 0) - amount);
    const updated = {
      ...userState,
      coins: newCoins
    };
    setUserState(updated);
    saveUserData(updated);
    return true;
  };

  const handleActivatePro = async (_code?: string): Promise<{ ok: boolean; error?: string }> => {
    setUserState(prev => {
      const updated = activatePro(prev);
      saveUserData(updated);
      return updated;
    });
    return { ok: true };
  };

  const handleDeductHeart = (): { wasDeducted: boolean; isOutOfHearts: boolean } => {
    let result = { wasDeducted: false, isOutOfHearts: false };
    setUserState(prev => {
      if (prev.isPro) {
        return prev;
      }
      const res = deductHeart(prev);
      result = {
        wasDeducted: res.wasDeducted,
        isOutOfHearts: res.isOutOfHearts
      };
      if (res.wasDeducted) {
        saveUserData(res.updatedState);
      }
      return res.updatedState;
    });
    return result;
  };

  const handleLoginClick = () => {
    triggerHaptic('light');
    setShowAuthModal(true);
  };

  const guestHasProgress = isGuest && (
    (userState.xp || 0) > 0 || 
    ((userState.completed_lessons || []).length > 0) || 
    (userState.coins || 0) > 50 || 
    completedTasks.length > 0
  );

  return (
    <div className="h-full h-[100dvh] w-full bg-surface-bg text-text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-primary/20 relative">
      <BrandBackgroundPattern />
      <ToastHost />
      <AnimatePresence>
        {loading && (
          <LoadingScreen 
            key="initial-auth-loading-screen"
            message="Autoryzacja sesji..." 
            subtext="Synchronizowanie profilu i postępów"
          />
        )}
      </AnimatePresence>

      {/* 1. NAWIGACJA (DLA DESKTOPU I TABLETU: LEWY PANEL BOCZNY; DLA MOBILNYCH: DOLNY DOCK) */}
      {!activeTask && !(currentTab === 'simulator' && isSimulatorSessionActive) && (
        <Navigation currentTab={currentTab} setTab={setCurrentTab} />
      )}

      {/* 2. GŁÓWNY OBSZAR APLIKACJI (PRZESTRONNY DLA PC/DESKTOPU) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full min-w-0">
        {!activeTask && (
          <Header 
            state={userState} 
            selectedSubjectKey={selectedSubjectKey}
            onSelectSubject={handleSelectSubject}
            currentSubject={currentSubject}
            onSelectSubjectId={handleSelectSubjectId}
            onOpenLobby={() => setShowSubjectLobbyModal(true)}
            onOpenFormulas={() => setShowFormulasModal(true)}
            onOpenDictionary={() => setShowEnglishDictionaryModal(true)}
            onOpenScratchpad={() => setShowScratchpadModal(true)}
            onProfileClick={() => setCurrentTab('profile')} 
            onLogoClick={() => {
              triggerHaptic('medium');
              setCurrentTab('dashboard');
              if (typeof document !== 'undefined') {
                const container = document.getElementById('main-scroll-container');
                if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            currentTab={currentTab} 
            onOpenParentSponsor={() => setShowParentSponsorModal(true)}
            onOpenProPopup={() => setShowProPopup(true)}
            isGuest={isGuest}
            onLoginClick={handleLoginClick}
            guestPromoSecondsLeft={isGuest ? guestPromoSecondsLeft : 0}
            onOpenGuestPromo={() => setShowGuestPromoModal(true)}
            onOpenDevHub={isDevAccessAllowed() ? () => setShowDevModal(true) : undefined}
            onOpenBlikModal={() => setShowBlikCoinModal(true)}
            onUpdateUserState={(updater) => {
              setUserState(prev => {
                const next = updater(prev);
                saveUserData(next);
                return next;
              });
            }}
          />
        )}

        {/* Pływająca pigułka promocji -50% PRO (prawy dolny róg) */}
        <PromoFloatingPill
          secondsLeft={guestPromoSecondsLeft}
          discountPercent={promoConfig.discountPercent}
          onClick={() => {
            setShowGuestPromoModal(true);
          }}
          isVisible={
            isGuest && 
            hasRealDiscount(promoConfig) &&
            guestPromoSecondsLeft > 0 && 
            !showGuestPromoModal && 
            !showAuthModal && 
            !showGuestPrompt && 
            !isNewUser &&
            !activeTask
          }
        />
        
        <main 
          id="main-scroll-container"
          tabIndex={-1}
          className={`relative w-full flex-1 min-w-0 min-h-0 flex flex-col focus:outline-none ${
            activeTask
              ? 'overflow-hidden p-0'
              : 'overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y custom-scrollbar'
          }`} 
          style={{ 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {activeTask ? (
            <SessionRunner 
              key={activeTaskData?.sessionId || activeTaskData?.lessonId || activeTaskData?.id || 'session-runner'}
              sessionData={activeTaskData?.isSession ? activeTaskData : {
                isSession: true,
                lessonId: activeTaskData?.lessonId || activeTaskData?.id || 'single-task',
                lessonTitle: activeTaskData?.lessonTitle || activeTaskData?.title || 'Zadanie',
                tasks: activeTaskData?.tasks || activeTaskData?.lessonTasks || (activeTaskData ? [activeTaskData] : []),
                ...activeTaskData
              }} 
              userState={userState} 
              guestPromoSecondsLeft={
                isGuest && 
                guestPromoSecondsLeft > 0 && 
                !showGuestPromoModal && 
                !showAuthModal && 
                !showGuestPrompt && 
                !isNewUser
                  ? guestPromoSecondsLeft
                  : undefined
              }
              onOpenGuestPromo={() => setShowGuestPromoModal(true)}
              onCompleteSession={handleCompleteTask} 
              onCancelSession={handleCancelTask}
              onDeductCoins={handleDeductCoins}
              onDeductHeart={handleDeductHeart}
              onOpenParentSponsor={() => setShowParentSponsorModal(true)}
              onOpenProPopup={() => setShowProPopup(true)}
              onOpenBlikModal={() => setShowBlikCoinModal(true)}
              onUpdateUserState={(updater) => {
                setUserState(prev => {
                  const next = updater(prev);
                  saveUserData(next);
                  return next;
                });
              }}
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                className="flex-1 flex flex-col min-h-0 w-full"
              >
                {currentTab === 'dashboard' && (
                  <DashboardView 
                    onNavigate={(tab, subTab) => {
                      if (tab === 'simulator') {
                        if (selectedSubjectKey === 'pol' || currentSubject === 'polski') {
                          setSimulatorInitialView('hub');
                        } else if (subTab) {
                          setSimulatorInitialView(subTab as any);
                        } else {
                          setSimulatorInitialView('hub');
                        }
                      }
                      if (tab === 'nauka' || (tab as string) === 'learn') {
                        if (subTab === 'synthesis') {
                          setPolishHubInitialMode('task_browser');
                          setPolishHubInitialLessonId(null);
                          setPolishHubInitialFilter({ type: 'synthesis_note' });
                          setShowPolishStudyHub(true);
                        } else if (subTab?.startsWith('epoch:')) {
                          const epochName = subTab.replace('epoch:', '') as PolishEpoch;
                          setPolishHubInitialMode('task_browser');
                          setPolishHubInitialLessonId(null);
                          setPolishHubInitialFilter({ epoch: epochName });
                          setShowPolishStudyHub(true);
                        } else if (subTab === 'task_browser') {
                          setPolishHubInitialMode('task_browser');
                          setPolishHubInitialLessonId(null);
                          setPolishHubInitialFilter(undefined);
                          setShowPolishStudyHub(true);
                        } else if (subTab?.startsWith('eng-')) {
                          setEnglishHubInitialMode('lessons');
                          setEnglishHubInitialLessonId(subTab);
                          setSelectedSubjectKey('eng');
                        } else if (subTab?.startsWith('pol-') || subTab?.startsWith('lekcja-') || subTab?.startsWith('lesson-')) {
                          setPolishHubInitialMode('lessons');
                          setPolishHubInitialLessonId(subTab);
                          setPolishHubInitialFilter(undefined);
                          setShowPolishStudyHub(false);
                          setSelectedSubjectKey('pol');
                        } else {
                          setShowPolishStudyHub(false);
                        }
                      }
                      setCurrentTab(tab as TabState);
                      if (subTab && tab === 'profil') setProfileInitialTab(subTab as any);
                    }} 
                    userState={userState}
                    completedTasks={completedTasks}
                    lessonMistakes={lessonMistakes}
                    taskStars={taskStars}
                    selectedSubjectKey={selectedSubjectKey}
                    onSelectSubject={handleSelectSubject}
                    onStartTask={handleStartTask}
                    onUpdateUserState={setUserState}
                    saveUserData={saveUserData}
                    onOpenParentSponsor={() => setShowParentSponsorModal(true)}
                    onOpenProPopup={() => setShowProPopup(true)}
                    onOpenDiagnostic={() => setShowDiagnosticModal(true)}
                    onOpenAiGenerator={() => setShowAiGeneratorModal(true)}
                    onOpenMistakesBank={() => setShowMistakesModal(true)}
                    onClaimDailyChallenge={handleClaimDailyChallenge}
                  />
                )}
                {(currentTab === 'nauka' || (currentTab as string) === 'learn') && (
                  <AnimatePresence mode="wait">
                    {/* transitionEnd czyści filtr: pozostawiony blur(0px) tworzy kontekst pozycjonowania i wyrzuca modale `fixed` poza ekran */}
                    <motion.div
                      key={`study-hub-${selectedSubjectKey || 'math'}`}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full flex-1 flex flex-col"
                    >
                      {selectedSubjectKey === 'pol' || (showPolishStudyHub && selectedSubjectKey !== 'eng') ? (
                        <PolishStudyHub
                          userState={userState}
                          onDeductCoins={handleDeductCoins}
                          onCompleteTask={handlePolishTaskComplete}
                          onCompleteLesson={handlePolishLessonComplete}
                          completedLessonIds={userState.completedLessonsPolish}
                          completedTaskIds={userState.completedTasksPolish}
                          initialMode={polishHubInitialMode}
                          initialActiveLessonId={polishHubInitialLessonId}
                          initialTaskFilter={polishHubInitialFilter}
                          onClose={() => {
                            setShowPolishStudyHub(false);
                            setCurrentTab('dashboard');
                          }}
                        />
                      ) : (
                        <LearnView 
                          userState={userState}
                          selectedSubjectKey={selectedSubjectKey}
                          onSelectSubject={handleSelectSubject}
                          onStartTask={handleStartTask} 
                          onCompleteTask={handleCompleteTask}
                          isGuest={isGuest} 
                          onLoginRequest={handleLoginClick}
                          onProRequest={() => setShowProPopup(true)}
                          completedTasks={completedTasks}
                          taskStars={taskStars}
                          lessonMistakes={lessonMistakes}
                          onBackToDashboard={() => setCurrentTab('dashboard')}
                          onSheetToggle={setIsSubjectSheetOpen}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
                {currentTab === 'simulator' && (
                  <MaturaSimulatorView 
                    initialView={simulatorInitialView}
                    onEarnReward={handleMaturaReward}
                    userState={userState}
                    onUpdateUserState={setUserState}
                    completedTasks={completedTasks}
                    onCompleteTask={handleCkeTaskComplete}
                    onActiveSessionChange={setIsSimulatorSessionActive}
                    currentSubject={currentSubject === 'polski' || selectedSubjectKey === 'pol' ? 'polski' : currentSubject === 'angielski' || selectedSubjectKey === 'eng' ? 'angielski' : 'matematyka'}
                    onSelectSubject={(subj) => {
                      if (subj === 'polski') {
                        handleSelectSubject('pol');
                        handleSelectSubjectId('polski');
                      } else if (subj === 'angielski') {
                        handleSelectSubject('eng');
                        handleSelectSubjectId('angielski');
                      } else {
                        handleSelectSubject('math');
                        handleSelectSubjectId('matematyka');
                      }
                    }}
                    onNavigateBack={() => setCurrentTab('dashboard')}
                  />
                )}
                {ARENA_ENABLED && currentTab === 'arena' && (
                  <ArenaView 
                    userState={userState} 
                    onUpdateUserState={setUserState} 
                    saveUserData={saveUserData} 
                    onNavigate={(tab) => setCurrentTab(tab)}
                  />
                )}
                {(currentTab === 'profile' || (currentTab as string) === 'profil') && (
                  <ProfileView 
                    userState={userState} 
                    completedTasks={completedTasks}
                    onClaimAchievement={handleClaimAchievement}
                    onBuyShopItem={handleBuyShopItem}
                    onUseStreakFreeze={handleUseStreakFreeze}
                    onOpenAuthModal={() => setShowAuthModal(true)}
                    onOpenOnboarding={() => setShowGuestPrompt(true)}
                    onOpenDevHub={isDevAccessAllowed() ? () => setShowDevModal(true) : undefined}
                    onOpenBlikModal={() => setShowBlikCoinModal(true)}
                    initialTab={profileInitialTab}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <AnimatePresence>
        {(showGuestPrompt || isNewUser) && (
          <OnboardingOverlay 
            onClose={() => {
              setShowGuestPrompt(false);
              setIsNewUser(false);
            }}
            onNavigate={setCurrentTab}
            onComplete={handleOnboardingComplete}
            onOpenAuthModal={() => setShowAuthModal(true)}
            hasProgress={guestHasProgress}
            onLogin={handleLoginClick}
          />
        )}
      </AnimatePresence>

      <RewardPopup reward={reward} onClose={() => setReward(null)} />
      <ProPopup 
        isOpen={showProPopup} 
        onClose={() => setShowProPopup(false)} 
        onOpenParentSponsor={() => {
          setShowProPopup(false);
          setShowParentSponsorModal(true);
        }}
        onActivatePro={handleActivatePro}
      />
      <ParentSponsorModal
        isOpen={showParentSponsorModal}
        onClose={() => setShowParentSponsorModal(false)}
        onActivatePro={handleActivatePro}
        studentName="Twój maturzysta"
      />
      <GuestPromoModal
        isOpen={showGuestPromoModal}
        onClose={() => setShowGuestPromoModal(false)}
        onClaimPromo={(promo) => {
          setShowGuestPromoModal(false);
          // Rabat przypisujemy do konta tylko wtedy, gdy promocja naprawdę istnieje
          setActiveAuthPromo(hasRealDiscount(promo) ? promo : null);
          setShowAuthModal(true);
        }}
        promoConfig={promoConfig}
      />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          setActiveAuthPromo(null);
        }} 
        promoContext={activeAuthPromo ? {
          promoConfig: activeAuthPromo,
          timeLeftFormatted: undefined
        } : undefined}
      />
      <DiagnosticTestModal
        isOpen={showDiagnosticModal}
        onClose={() => setShowDiagnosticModal(false)}
        subjectKey={selectedSubjectKey}
        onComplete={handleCompleteDiagnostic}
      />
      <AiTaskGeneratorModal
        isOpen={showAiGeneratorModal}
        onClose={() => setShowAiGeneratorModal(false)}
        currentSubjectKey={selectedSubjectKey}
        onStartCustomTask={(task) => {
          setShowAiGeneratorModal(false);
          const customSession = {
            isSession: true,
            isPolish: selectedSubjectKey === 'pol',
            isEnglish: selectedSubjectKey === 'eng',
            subjectId: normalizeSubjectFirestoreId(selectedSubjectKey),
            topicId: 'custom-ai-task',
            lessonId: 'ai-gen',
            lessonTitle: task.topic || 'Zadanie Wygenerowane przez AI',
            tasks: [task],
            firstTask: task,
            allTasks: [task],
            allTaskIdsToMarkCompleted: [task.id],
            required_correct_tasks: 1,
            estimated_time_formatted: '~3 min'
          };
          handleStartTask(customSession, [task], task.title || 'Zadanie Wygenerowane przez AI');
        }}
      />
      <MistakesBankModal
        isOpen={showMistakesModal}
        onClose={() => setShowMistakesModal(false)}
        onStartRehabSession={handleStartRehabSession}
        onNavigateToLessons={() => setCurrentTab('nauka')}
      />
      <BlikCoinModal
        isOpen={showBlikCoinModal}
        onClose={() => setShowBlikCoinModal(false)}
        onBuyCoins={handleBuyBlikCoins}
        userCoins={userState.coins || 0}
      />

      <SubjectLobbyModal
        isOpen={showSubjectLobbyModal}
        onClose={() => setShowSubjectLobbyModal(false)}
        currentSubject={currentSubject}
        onSelectSubject={(subId) => {
          handleSelectSubjectId(subId);
          setShowSubjectLobbyModal(false);
        }}
        polishStats={{ total: 1056, epochs: 11, lektury: 10 }}
        mathStats={{ total: 1500, topics: 15 }}
      />
      <CkeFormulasModal
        isOpen={showFormulasModal}
        onClose={() => setShowFormulasModal(false)}
      />
      <EnglishDictionaryModal
        isOpen={showEnglishDictionaryModal}
        onClose={() => setShowEnglishDictionaryModal(false)}
      />
      <ScratchpadModal
        isOpen={showScratchpadModal}
        onClose={() => setShowScratchpadModal(false)}
      />
      <DevHubModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        userState={userState}
        onUpdateUserState={(updater) => {
          setUserState(prev => {
            const next = updater(prev);
            saveUserData(next);
            return next;
          });
        }}
        onNavigate={(tab, subTab) => {
          setCurrentTab(tab);
          if (subTab && tab === 'profil') setProfileInitialTab(subTab as any);
        }}
        onSelectSubject={handleSelectSubject}
        onSelectSubjectId={handleSelectSubjectId}
      />

      {/* Nocturne Luminary Session Resumed Badge */}
      <AnimatePresence>
        {showResumedSessionBadge && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[max(1rem,env(safe-area-inset-top,1rem))] left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0E1522]/95 border border-[#FFB800]/40 text-[#FFDCA1] shadow-[0_4px_24px_rgba(255,184,0,0.2)] backdrop-blur-md text-xs sm:text-sm font-medium select-none pointer-events-auto"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
            <span>Wznowiono przerwaną sesję</span>
            <button 
              onClick={() => setShowResumedSessionBadge(false)}
              className="ml-1 text-slate-400 hover:text-white transition-colors p-0.5 rounded-full"
              aria-label="Zamknij powiadomienie"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
