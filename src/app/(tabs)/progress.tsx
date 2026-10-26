import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TopHeaderStats } from '@/components/ui/TopHeaderStats';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  getUserStats,
  getQuizHistory,
  getUnlockedBadgeIds,
  getAllLessonProgress,
} from '@/database/repository';
import { INITIAL_BADGES } from '@/constants/badges';
import { UserStats, QuizHistoryItem, Badge } from '@/types';
import { getLevelInfo } from '@/services/gamification';
import { GameButton } from '@/components/ui/GameButton';
import { useResponsive } from '@/hooks/useResponsive';
import { getLessonById } from '@/data/curriculum';

export default function ProgressScreen() {
  const { contentMaxWidth, isTablet, isDesktop } = useResponsive();
  const isLarge = isTablet || isDesktop;
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [uStats, uHistory, uBadges, uProgress] = await Promise.all([
        getUserStats(),
        getQuizHistory(),
        getUnlockedBadgeIds(),
        getAllLessonProgress(),
      ]);

      setStats(uStats);
      setHistory(uHistory);
      setUnlockedIds(new Set(uBadges));

      const count = Object.values(uProgress).filter(
        (p) => p.status === 'completed'
      ).length;
      setCompletedLessonsCount(count);
    } catch (err) {
      console.warn('Error loading progress data:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const levelInfo = getLevelInfo(stats?.xp ?? 0);
  const unlockedBadgesCount = INITIAL_BADGES.filter((b) =>
    unlockedIds.has(b.id)
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopHeaderStats stats={stats} onRefreshStats={loadData} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
        {/* Level & XP Overview Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy" size={32} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelTitle}>Level {levelInfo.level}</Text>
              <Text style={styles.levelDesc}>
                Total Akumulasi: <Text style={styles.boldText}>{stats?.xp ?? 0} XP</Text>
              </Text>
            </View>
            <View style={styles.badgeCountPill}>
              <Ionicons name="ribbon" size={14} color="#7C3AED" />
              <Text style={styles.badgeCountText}>
                {unlockedBadgesCount}/{INITIAL_BADGES.length} Lencana
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                Progres Level Berikutnya (Level {levelInfo.level + 1})
              </Text>
              <Text style={styles.progressValue}>
                {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
              </Text>
            </View>
            <ProgressBar progress={levelInfo.progressPercent} color="#F59E0B" height={10} />
          </View>
        </View>

        {/* Streak & Consistency Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakTop}>
            <View style={styles.streakFlameCircle}>
              <Ionicons name="flame" size={36} color="#EA580C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>
                {stats?.streak ?? 1} Hari Beruntun!
              </Text>
              <Text style={styles.streakDesc}>
                Belajar setiap hari mempertahankan streak dan menjaga ingatan kode tetap tajam.
              </Text>
            </View>
          </View>

          {/* Quick Streak Week Bubbles */}
          <View style={styles.weekRow}>
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
              const active = idx < (stats?.streak ?? 1);
              return (
                <View key={day} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayCircle,
                      active ? styles.dayCircleActive : styles.dayCircleInactive,
                    ]}
                  >
                    <Ionicons
                      name={active ? 'checkmark' : 'ellipse-outline'}
                      size={14}
                      color={active ? '#FFFFFF' : '#94A3B8'}
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Badges Collection Grid */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Koleksi Lencana Prestasi</Text>
          <Text style={styles.sectionSubtitle}>
            {unlockedBadgesCount} dari {INITIAL_BADGES.length} terbuka
          </Text>
        </View>

        <View style={styles.badgeGrid}>
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = unlockedIds.has(badge.id);
            return (
              <TouchableOpacity
                key={badge.id}
                activeOpacity={0.8}
                onPress={() => setSelectedBadge(badge)}
                style={[
                  styles.badgeCard,
                  isLarge && { width: '23.5%' },
                  isUnlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIconBox,
                    isUnlocked ? styles.badgeIconUnlocked : styles.badgeIconLocked,
                  ]}
                >
                  <Ionicons
                    name={badge.icon as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={isUnlocked ? '#7C3AED' : '#94A3B8'}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    isUnlocked ? styles.badgeNameUnlocked : styles.badgeNameLocked,
                  ]}
                  numberOfLines={1}
                >
                  {badge.title}
                </Text>
                <Text style={styles.badgeStatus}>
                  {isUnlocked ? '✔ Terbuka' : 'Terkunci'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quiz History Log */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Riwayat Evaluasi Terakhir</Text>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>Belum ada riwayat quiz yang tercatat.</Text>
            <Text style={styles.emptySub}>
              Selesaikan lesson dan quiz untuk melihat skor evaluasi di sini.
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {history.slice(0, 10).map((item) => {
              const lessonObj = getLessonById(item.lessonId);
              const lessonTitle = lessonObj ? lessonObj.title : `Materi: ${item.lessonId}`;
              return (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyScoreBox}>
                    <Text
                      style={[
                        styles.historyScore,
                        item.score >= 80
                          ? { color: '#10B981' }
                          : item.score >= 60
                          ? { color: '#F59E0B' }
                          : { color: '#EF4444' },
                      ]}
                    >
                      {item.score}%
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyLessonId} numberOfLines={1}>
                      {lessonTitle}
                    </Text>
                    <Text style={styles.historySub}>
                      {item.totalQuestions} Soal • +{item.xpEarned} XP diperoleh
                    </Text>
                  </View>
                  <Text style={styles.historyDate}>
                    {new Date(item.timestamp).toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        </View>
      </ScrollView>

      {/* Badge Details Modal */}
      <Modal
        visible={!!selectedBadge}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.badgeModalCard}>
            {selectedBadge && (
              <>
                <View
                  style={[
                    styles.modalBadgeIconCircle,
                    unlockedIds.has(selectedBadge.id)
                      ? { backgroundColor: '#EDE9FE' }
                      : { backgroundColor: '#F1F5F9' },
                  ]}
                >
                  <Ionicons
                    name={selectedBadge.icon as keyof typeof Ionicons.glyphMap}
                    size={48}
                    color={
                      unlockedIds.has(selectedBadge.id) ? '#7C3AED' : '#94A3B8'
                    }
                  />
                </View>
                <Text style={styles.badgeModalTitle}>{selectedBadge.title}</Text>
                <Text style={styles.badgeModalDesc}>{selectedBadge.description}</Text>

                <View style={styles.badgeCriteriaBox}>
                  <Text style={styles.badgeCriteriaLabel}>Target Syarat:</Text>
                  <Text style={styles.badgeCriteriaVal}>
                    {selectedBadge.category === 'lesson'
                      ? `${selectedBadge.targetValue} Materi Selesai (Saat ini: ${completedLessonsCount})`
                      : selectedBadge.category === 'streak'
                      ? `${selectedBadge.targetValue} Hari Streak (Saat ini: ${stats?.streak ?? 1})`
                      : selectedBadge.category === 'xp'
                      ? `${selectedBadge.targetValue} Total XP (Saat ini: ${stats?.xp ?? 0})`
                      : `${selectedBadge.targetValue} Mini Project Selesai`}
                  </Text>
                </View>

                <GameButton
                  title="Tutup"
                  variant="primary"
                  size="md"
                  onPress={() => setSelectedBadge(null)}
                  style={{ width: '100%', marginTop: 10 }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  trophyCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  levelDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  boldText: {
    fontWeight: '800',
    color: '#D97706',
  },
  badgeCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6D28D9',
  },
  progressSection: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  progressValue: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '800',
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 20,
  },
  streakTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  streakFlameCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  streakDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dayCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayCircleActive: {
    backgroundColor: '#F97316',
  },
  dayCircleInactive: {
    backgroundColor: '#F1F5F9',
  },
  dayLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  badgeCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  badgeCardUnlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD6FE',
    borderBottomColor: '#C4B5FD',
  },
  badgeCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
    opacity: 0.7,
  },
  badgeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconUnlocked: {
    backgroundColor: '#EDE9FE',
  },
  badgeIconLocked: {
    backgroundColor: '#E2E8F0',
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeNameUnlocked: {
    color: '#0F172A',
  },
  badgeNameLocked: {
    color: '#94A3B8',
  },
  badgeStatus: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  historyScoreBox: {
    width: 48,
    alignItems: 'center',
  },
  historyScore: {
    fontSize: 16,
    fontWeight: '900',
  },
  historyLessonId: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  historySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  historyDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  badgeModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalBadgeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  badgeModalDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  badgeCriteriaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 14,
  },
  badgeCriteriaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  badgeCriteriaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
});
