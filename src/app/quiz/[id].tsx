import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById, getNextLesson } from '@/data/curriculum';
import {
  getUserStats,
  deductHeart,
  addXP,
  updateLessonProgress,
  unlockLesson,
  addQuizHistory,
  getAllLessonProgress,
} from '@/database/repository';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { GameButton } from '@/components/ui/GameButton';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { CelebrationModal } from '@/components/ui/CelebrationModal';
import { OutOfHeartsModal } from '@/components/ui/OutOfHeartsModal';
import { RefillChallengeModal } from '@/components/ui/RefillChallengeModal';
import { QuitConfirmModal } from '@/components/ui/QuitConfirmModal';
import { evaluateAnswer, calculateQuizScore } from '@/services/quizEngine';
import { checkAndAwardBadges } from '@/services/gamification';
import { Question, UserStats, Badge } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';

export default function QuizScreen() {
  const { contentMaxWidth } = useResponsive();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id || '');

  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [correctCount, setCorrectCount] = useState(0);

  // Reorder lines state for 'order_lines' question
  const [orderedLines, setOrderedLines] = useState<string[]>(() => {
    const firstQ = lesson?.questions[0];
    if (firstQ?.type === 'order_lines' && firstQ.lines) {
      return [...firstQ.lines].sort(() => Math.random() - 0.5);
    }
    return [];
  });

  // Completion states
  const [quizFinished, setQuizFinished] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [isLeveledUp, setIsLeveledUp] = useState(false);
  const [newLevelNum, setNewLevelNum] = useState(1);

  // Duolingo out of hearts & refill challenge states
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [showRefillChallenge, setShowRefillChallenge] = useState(false);
  const [showQuitConfirmModal, setShowQuitConfirmModal] = useState(false);

  useEffect(() => {
    async function init() {
      const uStats = await getUserStats();
      setStats(uStats);
      if (uStats.hearts <= 0) {
        setShowOutOfHeartsModal(true);
      }
    }
    init();
  }, []);

  const handleQuit = () => {
    setShowQuitConfirmModal(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitConfirmModal(false);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/learn');
    }
  };

  useEffect(() => {
    const onBack = () => {
      if (quizFinished) {
        router.replace('/(tabs)/learn');
        return true;
      }
      setShowQuitConfirmModal(true);
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [quizFinished]);

  if (!lesson || !lesson.questions.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centerBox}>
          <Text style={styles.centerText}>Tidak ada soal evaluasi untuk materi ini.</Text>
          <GameButton
            title="Kembali ke Roadmap"
            variant="outline"
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)/learn');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentQ: Question = lesson.questions[currentIdx];
  const progressPercent = Math.round(
    ((currentIdx + (hasSubmitted && evaluation?.isCorrect ? 1 : 0)) /
      lesson.questions.length) *
      100
  );

  const handleCheckAnswer = async () => {
    let answer = userAnswer;
    if (currentQ.type === 'order_lines' && (answer === null || answer === undefined)) {
      answer = orderedLines;
      setUserAnswer(orderedLines);
    }

    if (answer === null || answer === undefined || answer === '') {
      Alert.alert('Pilih Jawaban', 'Silakan pilih atau ketik jawabanmu terlebih dahulu!');
      return;
    }

    const evalRes = evaluateAnswer(currentQ, answer);
    setEvaluation(evalRes);
    setHasSubmitted(true);

    if (evalRes.isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      // Deduct heart
      const remainingHearts = await deductHeart();
      setStats((prev) => (prev ? { ...prev, hearts: remainingHearts } : prev));
    }
  };

  const handleNextStep = async () => {
    if (!evaluation?.isCorrect) {
      // Check if user has run out of hearts
      if ((stats?.hearts ?? 0) <= 0) {
        setShowOutOfHeartsModal(true);
        return;
      }

      // DUOLINGO FLOW: User answered incorrectly, DO NOT advance!
      // Stay on the same question, reset selection so they can retry.
      setHasSubmitted(false);
      setEvaluation(null);
      setUserAnswer(null);

      if (currentQ.type === 'order_lines' && currentQ.lines) {
        setOrderedLines([...currentQ.lines].sort(() => Math.random() - 0.5));
      }
      return;
    }

    // User answered correctly -> Advance to next question or finish quiz
    if (currentIdx < lesson.questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setUserAnswer(null);
      setHasSubmitted(false);
      setEvaluation(null);

      const nextQ = lesson.questions[nextIdx];
      if (nextQ?.type === 'order_lines' && nextQ.lines) {
        setOrderedLines([...nextQ.lines].sort(() => Math.random() - 0.5));
      }
    } else {
      // Finish Quiz
      await finishQuiz();
    }
  };

  const handleStartRefill = () => {
    setShowOutOfHeartsModal(false);
    setShowRefillChallenge(true);
  };

  const handleRefillSuccess = async () => {
    const updatedStats = await getUserStats();
    setStats(updatedStats);
    setShowRefillChallenge(false);
    setShowOutOfHeartsModal(false);

    // Reset current question attempt so user can retry immediately with full hearts
    setHasSubmitted(false);
    setEvaluation(null);
    setUserAnswer(null);
    if (currentQ.type === 'order_lines' && currentQ.lines) {
      setOrderedLines([...currentQ.lines].sort(() => Math.random() - 0.5));
    }
  };

  const handleQuitFromOutOfHearts = () => {
    setShowOutOfHeartsModal(false);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/learn');
    }
  };

  const finishQuiz = async () => {
    const finalScore = calculateQuizScore(
      correctCount + (evaluation?.isCorrect ? 0 : 0),
      lesson.questions.length
    );

    if (finalScore.passed) {
      // 1. Mark lesson completed
      await updateLessonProgress(lesson.id, 'completed', finalScore.score);

      // 2. Unlock next lesson
      const nextL = getNextLesson(lesson.id);
      if (nextL) {
        await unlockLesson(nextL.id);
      }

      // 3. Award XP
      const { newLevel, leveledUp } = await addXP(lesson.xpReward);
      if (leveledUp) {
        setIsLeveledUp(true);
        setNewLevelNum(newLevel);
      }

      // 4. Record Quiz history
      await addQuizHistory(
        lesson.id,
        finalScore.score,
        lesson.questions.length,
        lesson.xpReward
      );

      // 5. Check badges
      const uProgress = await getAllLessonProgress();
      const completedCount = Object.values(uProgress).filter(
        (p) => p.status === 'completed'
      ).length;
      const latestStats = await getUserStats();
      const newBadges = await checkAndAwardBadges(latestStats, completedCount, 0);

      if (newBadges.length > 0) {
        setCelebrationBadge(newBadges[0]);
      }
    }

    setQuizFinished(true);
  };

  // Reorder lines item swap helper
  const moveLine = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedLines.length) return;
    const updated = [...orderedLines];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    setOrderedLines(updated);
    setUserAnswer(updated);
  };

  // ----------------- RENDER FINISHED STATE -----------------
  if (quizFinished) {
    const scoreInfo = calculateQuizScore(correctCount, lesson.questions.length);
    const passed = scoreInfo.passed;

    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.finishedContainer}>
          <View
            style={[
              styles.finishedIconCircle,
              { backgroundColor: passed ? '#D1FAE5' : '#FEE2E2' },
            ]}
          >
            <Ionicons
              name={passed ? 'trophy' : 'refresh-circle'}
              size={64}
              color={passed ? '#10B981' : '#EF4444'}
            />
          </View>

          <Text style={styles.finishedTitle}>
            {passed ? 'Latihan Selesai!' : 'Perlu Sedikit Latihan Lagi'}
          </Text>
          <Text style={styles.finishedSub}>
            {passed
              ? `Hebat! Kamu berhasil menguasai materi ${lesson.title}.`
              : 'Skor belum mencapai batas kelulusan 60%. Coba baca kembali materi dan coba lagi!'}
          </Text>

          {/* Stats Summary Cards */}
          <View style={styles.finishStatsRow}>
            <View style={styles.finishStatCard}>
              <Text style={styles.finishStatLabel}>Akurasi</Text>
              <Text
                style={[
                  styles.finishStatValue,
                  { color: passed ? '#10B981' : '#EF4444' },
                ]}
              >
                {scoreInfo.score}%
              </Text>
            </View>
            <View style={styles.finishStatCard}>
              <Text style={styles.finishStatLabel}>XP Diperoleh</Text>
              <Text style={[styles.finishStatValue, { color: '#F59E0B' }]}>
                +{passed ? lesson.xpReward : 5} XP
              </Text>
            </View>
            <View style={styles.finishStatCard}>
              <Text style={styles.finishStatLabel}>Soal Benar</Text>
              <Text style={[styles.finishStatValue, { color: '#0284C7' }]}>
                {correctCount}/{lesson.questions.length}
              </Text>
            </View>
          </View>

          <View style={styles.finishActionBox}>
            <GameButton
              title={passed ? 'Lanjut ke Roadmap →' : 'Pelajari Ulang Materi'}
              variant="primary"
              size="lg"
              onPress={() => {
                if (passed) {
                  router.replace('/(tabs)/learn');
                } else {
                  router.replace(`/lesson/${lesson.id}`);
                }
              }}
              style={{ width: '100%', marginBottom: passed ? 0 : 10 }}
            />
            {!passed && (
              <GameButton
                title="Kembali ke Roadmap"
                variant="outline"
                size="md"
                onPress={() => router.replace('/(tabs)/learn')}
                style={{ width: '100%' }}
              />
            )}
          </View>
        </View>

        {/* Level Up Celebration Modal */}
        {isLeveledUp && (
          <CelebrationModal
            visible={isLeveledUp}
            type="level_up"
            newLevel={newLevelNum}
            onClose={() => setIsLeveledUp(false)}
          />
        )}

        {/* Badge Unlocked Celebration Modal */}
        {celebrationBadge && (
          <CelebrationModal
            visible={!!celebrationBadge}
            type="badge_unlocked"
            badge={celebrationBadge}
            onClose={() => setCelebrationBadge(null)}
          />
        )}
      </SafeAreaView>
    );
  }

  // ----------------- RENDER QUESTION STATE -----------------
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top Bar: Quit, Progress, Hearts */}
      <View style={styles.topBar}>
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={handleQuit} style={styles.quitBtn}>
            <Ionicons name="close" size={26} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.progressBox}>
            <ProgressBar
              progress={progressPercent}
              color="#10B981"
              height={12}
              style={{ flex: 1 }}
            />
          </View>

          <TouchableOpacity
            style={styles.heartPill}
            activeOpacity={0.7}
            onPress={() => {
              if ((stats?.hearts ?? 5) < 5) {
                setShowOutOfHeartsModal(true);
              }
            }}
          >
            <Ionicons name="heart" size={18} color="#EF4444" />
            <Text style={styles.heartText}>{stats?.hearts ?? 5}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
        {/* Question Prompt */}
        <Text style={styles.prompt}>{currentQ.prompt}</Text>

        {/* Code Snippet (if any) */}
        {currentQ.codeSnippet && (
          <View style={styles.codeSnippetCard}>
            <Text style={styles.snippetText}>{currentQ.codeSnippet}</Text>
          </View>
        )}

        {/* 1. Multiple Choice */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <View style={styles.optionsList}>
            {currentQ.options.map((opt, i) => {
              const isSelected = userAnswer === opt;
              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  disabled={hasSubmitted}
                  onPress={() => setUserAnswer(opt)}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 2. True / False */}
        {currentQ.type === 'true_false' && (
          <View style={styles.tfRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={hasSubmitted}
              onPress={() => setUserAnswer(true)}
              style={[
                styles.tfCard,
                userAnswer === true && styles.tfCardSelectedTrue,
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={36}
                color={userAnswer === true ? '#10B981' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tfText,
                  userAnswer === true && { color: '#065F46', fontWeight: '900' },
                ]}
              >
                BENAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={hasSubmitted}
              onPress={() => setUserAnswer(false)}
              style={[
                styles.tfCard,
                userAnswer === false && styles.tfCardSelectedFalse,
              ]}
            >
              <Ionicons
                name="close-circle"
                size={36}
                color={userAnswer === false ? '#EF4444' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tfText,
                  userAnswer === false && { color: '#991B1B', fontWeight: '900' },
                ]}
              >
                SALAH
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. Fill in the Blank */}
        {currentQ.type === 'fill_blank' && (
          <View style={styles.fillBlankBox}>
            <Text style={styles.fillBlankLabel}>Ketikkan jawaban / tag kodenya:</Text>
            <TextInput
              style={styles.fillBlankInput}
              value={userAnswer || ''}
              onChangeText={setUserAnswer}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Ketik kode di sini..."
              placeholderTextColor="#94A3B8"
              editable={!hasSubmitted}
            />
          </View>
        )}

        {/* 4. Order Lines */}
        {currentQ.type === 'order_lines' && (
          <View style={styles.orderLinesBox}>
            <Text style={styles.orderLinesLabel}>
              Gunakan tombol panah (↑ / ↓) untuk menyusun baris kode dengan urutan yang benar:
            </Text>
            {orderedLines.map((line, idx) => (
              <View key={idx} style={styles.orderLineItem}>
                <Text style={styles.orderIndexText}>{idx + 1}.</Text>
                <Text style={styles.orderLineCode}>{line}</Text>
                {!hasSubmitted && (
                  <View style={styles.orderControls}>
                    <TouchableOpacity
                      onPress={() => moveLine(idx, idx - 1)}
                      disabled={idx === 0}
                      style={[styles.arrowBtn, idx === 0 && { opacity: 0.3 }]}
                    >
                      <Ionicons name="chevron-up" size={18} color="#0F172A" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => moveLine(idx, idx + 1)}
                      disabled={idx === orderedLines.length - 1}
                      style={[
                        styles.arrowBtn,
                        idx === orderedLines.length - 1 && { opacity: 0.3 },
                      ]}
                    >
                      <Ionicons name="chevron-down" size={18} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 5. Find Bug */}
        {currentQ.type === 'find_bug' && currentQ.codeSnippet && (
          <View style={styles.findBugBox}>
            <Text style={styles.findBugLabel}>
              Sentuh baris kode yang mengandung kesalahan (bug):
            </Text>
            {currentQ.codeSnippet.split('\n').map((line, lineIdx) => {
              const isSelected = userAnswer === lineIdx;
              return (
                <TouchableOpacity
                  key={lineIdx}
                  activeOpacity={0.8}
                  disabled={hasSubmitted}
                  onPress={() => setUserAnswer(lineIdx)}
                  style={[
                    styles.buggyLineRow,
                    isSelected && styles.buggyLineSelected,
                  ]}
                >
                  <Text style={styles.buggyLineNum}>{lineIdx + 1}</Text>
                  <Text
                    style={[
                      styles.buggyLineText,
                      isSelected && styles.buggyLineTextSelected,
                    ]}
                  >
                    {line}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        </View>
      </ScrollView>

      {/* Footer Area: Submit Button OR Feedback Banner */}
      {!hasSubmitted ? (
        <View style={styles.footerBar}>
          <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
            <GameButton
              title="Periksa Jawaban"
              variant="primary"
              size="lg"
              disabled={userAnswer === null || userAnswer === undefined || userAnswer === ''}
              onPress={handleCheckAnswer}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      ) : (
        <FeedbackBanner
          isCorrect={evaluation.isCorrect}
          correctAnswerText={evaluation.correctAnswerSummary}
          explanation={evaluation.explanation}
          onNext={handleNextStep}
          isLastQuestion={currentIdx === lesson.questions.length - 1}
          buttonTitle={
            !evaluation.isCorrect
              ? (stats?.hearts ?? 5) <= 0
                ? '⚡ Isi Ulang Nyawa (+5 ❤️)'
                : 'Coba Lagi'
              : undefined
          }
        />
      )}

      {/* Duolingo Out of Hearts Modal */}
      <OutOfHeartsModal
        visible={showOutOfHeartsModal}
        onStartRefill={handleStartRefill}
        onQuit={handleQuitFromOutOfHearts}
      />

      {/* Refill Challenge Drill Modal */}
      <RefillChallengeModal
        visible={showRefillChallenge}
        onClose={() => {
          setShowRefillChallenge(false);
          setShowOutOfHeartsModal(true);
        }}
        onSuccess={handleRefillSuccess}
      />

      {/* Interactive Quit Confirmation Modal */}
      <QuitConfirmModal
        visible={showQuitConfirmModal}
        onConfirm={handleConfirmQuit}
        onCancel={() => setShowQuitConfirmModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  quitBtn: {
    padding: 4,
  },
  progressBox: {
    flex: 1,
  },
  heartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  heartText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 18,
  },
  codeSnippetCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  snippetText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    gap: 14,
  },
  optionCardSelected: {
    borderColor: '#10B981',
    borderBottomColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#10B981',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  optionTextSelected: {
    color: '#065F46',
    fontWeight: '800',
  },
  tfRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  tfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    gap: 10,
  },
  tfCardSelectedTrue: {
    borderColor: '#10B981',
    borderBottomColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  tfCardSelectedFalse: {
    borderColor: '#EF4444',
    borderBottomColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  tfText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748B',
  },
  fillBlankBox: {
    marginTop: 10,
  },
  fillBlankLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  fillBlankInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: '#0F172A',
    fontFamily: 'monospace',
    backgroundColor: '#F8FAFC',
  },
  orderLinesBox: {
    gap: 8,
  },
  orderLinesLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  orderLineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  orderIndexText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
  },
  orderLineCode: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#0F172A',
  },
  orderControls: {
    flexDirection: 'row',
    gap: 4,
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  findBugBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    padding: 8,
  },
  findBugLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  buggyLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 12,
  },
  buggyLineSelected: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  buggyLineNum: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'monospace',
    width: 20,
    textAlign: 'right',
  },
  buggyLineText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontFamily: 'monospace',
  },
  buggyLineTextSelected: {
    color: '#FCA5A5',
    fontWeight: 'bold',
  },
  footerBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  centerText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  finishedIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  finishedTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  finishedSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  finishStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    width: '100%',
  },
  finishStatCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  finishStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 4,
  },
  finishStatValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  finishActionBox: {
    width: '100%',
  },
});
