import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TopHeaderStats } from '@/components/ui/TopHeaderStats';
import { GameButton } from '@/components/ui/GameButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  getUserProfile,
  getUserStats,
  getAllLessonProgress,
} from '@/database/repository';
import { ALL_LESSONS, WORLDS_META } from '@/data/curriculum';
import { UserProfile, UserStats, LessonProgress, Lesson } from '@/types';
import { getLevelInfo } from '@/services/gamification';
import { useResponsive } from '@/hooks/useResponsive';

export default function DashboardScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [uProfile, uStats, uProgress] = await Promise.all([
        getUserProfile(),
        getUserStats(),
        getAllLessonProgress(),
      ]);

      setProfile(uProfile);
      setStats(uStats);
      setProgressMap(uProgress);

      // Find the first unlocked or in-progress lesson
      const active =
        ALL_LESSONS.find(
          (l) => uProgress[l.id]?.status === 'unlocked'
        ) ||
        ALL_LESSONS.find(
          (l) => !uProgress[l.id] || uProgress[l.id]?.status !== 'completed'
        ) ||
        ALL_LESSONS[0];

      setCurrentLesson(active);
    } catch (err) {
      console.warn('Failed loading dashboard data:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const levelInfo = getLevelInfo(stats?.xp ?? 0);
  const completedLessonsCount = Object.values(progressMap).filter(
    (p) => p.status === 'completed'
  ).length;

  const { contentMaxWidth, isTablet, isDesktop } = useResponsive();
  const isLarge = isTablet || isDesktop;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopHeaderStats stats={stats} onRefreshStats={loadData} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
          {/* Welcome Greeting & Level Header */}
          <View style={styles.greetingCard}>
            <View style={styles.greetingHeader}>
              <View>
                <Text style={styles.greetingSmall}>Selamat Belajar,</Text>
                <Text style={styles.greetingName}>{profile?.name ?? 'Web Developer'}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Ionicons name="ribbon" size={16} color="#7C3AED" />
                <Text style={styles.levelBadgeText}>Level {levelInfo.level}</Text>
              </View>
            </View>

            {/* Level Progress */}
            <View style={styles.levelProgressBox}>
              <View style={styles.levelProgressInfo}>
                <Text style={styles.levelProgressLabel}>Progres ke Level {levelInfo.level + 1}</Text>
                <Text style={styles.levelProgressVal}>
                  {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
                </Text>
              </View>
              <ProgressBar progress={levelInfo.progressPercent} color="#7C3AED" height={10} />
            </View>
          </View>

          {/* Quick Continue Lesson Card */}
          {currentLesson && (
            <View style={styles.continueCard}>
              <View style={styles.continueBadgeRow}>
                <View style={styles.continuePill}>
                  <Text style={styles.continuePillText}>LANJUTKAN BELAJAR</Text>
                </View>
                <View style={styles.xpPill}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={styles.xpPillText}>+{currentLesson.xpReward} XP</Text>
                </View>
              </View>

              <Text style={styles.continueWorld}>{currentLesson.worldTitle}</Text>
              <Text style={styles.continueTitle}>{currentLesson.title}</Text>
              <Text style={styles.continueDesc} numberOfLines={2}>
                {currentLesson.description}
              </Text>

              <View style={styles.continueActionRow}>
                <GameButton
                  title="Mulai Materi →"
                  variant="primary"
                  size="md"
                  onPress={() => router.push(`/lesson/${currentLesson.id}`)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}

          {/* Worlds Learning Roadmap Overview */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>4 Dunia Web Programming</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
              <Text style={styles.sectionLink}>Buka Roadmap →</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.worldsGrid, isLarge && styles.worldsGridLarge]}>
            {WORLDS_META.map((w) => {
              const worldLessons = ALL_LESSONS.filter((l) => l.worldId === w.id);
              const total = worldLessons.length || (w.id === 'projects' ? 4 : 1);
              const done = worldLessons.filter(
                (l) => progressMap[l.id]?.status === 'completed'
              ).length;
              const percent = Math.round((done / total) * 100);

              const getColor = () => {
                switch (w.id) {
                  case 'html':
                    return { bg: '#FFEDD5', border: '#EA580C', text: '#9A3412', icon: '#EA580C' };
                  case 'css':
                    return { bg: '#E0F2FE', border: '#0284C7', text: '#075985', icon: '#0284C7' };
                  case 'javascript':
                    return { bg: '#DCFCE7', border: '#16A34A', text: '#166534', icon: '#16A34A' };
                  case 'projects':
                  default:
                    return { bg: '#EDE9FE', border: '#7C3AED', text: '#5B21B6', icon: '#7C3AED' };
                }
              };
              const col = getColor();

              return (
                <TouchableOpacity
                  key={w.id}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/learn')}
                  style={[
                    styles.worldCard,
                    isLarge && styles.worldCardLarge,
                    { borderColor: col.border + '40' },
                  ]}
                >
                  <View style={styles.worldCardTop}>
                    <View style={[styles.worldIconCircle, { backgroundColor: col.bg }]}>
                      <Ionicons
                        name={w.icon as keyof typeof Ionicons.glyphMap}
                        size={22}
                        color={col.icon}
                      />
                    </View>
                    <Text style={styles.worldProgressText}>{done}/{total} Selesai</Text>
                  </View>

                  <Text style={styles.worldTitle}>{w.title}</Text>
                  <Text style={styles.worldTagline}>{w.tagline}</Text>

                  <ProgressBar progress={percent} color={col.icon} height={8} style={{ marginTop: 8 }} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Offline Playground Banner */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/playground')}
            style={styles.playgroundBanner}
          >
            <View style={styles.playgroundBannerText}>
              <View style={styles.bannerPill}>
                <Text style={styles.bannerPillText}>OFFLINE PLAYGROUND</Text>
              </View>
              <Text style={styles.playgroundBannerTitle}>Coba Kode HTML, CSS & JS</Text>
              <Text style={styles.playgroundBannerDesc}>
                Eksperimen langsung di browser WebView lokal tanpa perlu server eksternal.
              </Text>
            </View>
            <View style={styles.playgroundBannerIcon}>
              <Ionicons name="code-slash" size={32} color="#0284C7" />
            </View>
          </TouchableOpacity>

          {/* Quick Stats Grid */}
          <View style={styles.statsSummaryGrid}>
            <View style={styles.statSummaryCard}>
              <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
              <Text style={styles.statSummaryVal}>{completedLessonsCount}</Text>
              <Text style={styles.statSummaryLabel}>Materi Tuntas</Text>
            </View>
            <View style={styles.statSummaryCard}>
              <Ionicons name="flame" size={24} color="#F97316" />
              <Text style={styles.statSummaryVal}>{stats?.streak ?? 1} Hari</Text>
              <Text style={styles.statSummaryLabel}>Streak Aktif</Text>
            </View>
            <View style={styles.statSummaryCard}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={styles.statSummaryVal}>{stats?.xp ?? 0}</Text>
              <Text style={styles.statSummaryLabel}>Total XP</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  greetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 16,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greetingSmall: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  levelBadgeText: {
    color: '#6D28D9',
    fontWeight: '800',
    fontSize: 12,
  },
  levelProgressBox: {
    marginTop: 4,
  },
  levelProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelProgressLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  levelProgressVal: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '800',
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 20,
  },
  continueBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  continuePill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  continuePillText: {
    color: '#065F46',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  xpPillText: {
    color: '#92400E',
    fontWeight: '800',
    fontSize: 11,
  },
  continueWorld: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  continueTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
    marginBottom: 6,
  },
  continueDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  continueActionRow: {
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
  worldsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  worldsGridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  worldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  worldCardLarge: {
    width: '48.5%',
  },
  worldCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  worldIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  worldProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  worldTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  worldTagline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  playgroundBanner: {
    backgroundColor: '#E0F2FE',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderBottomWidth: 4,
    borderBottomColor: '#7DD3FC',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playgroundBannerText: {
    flex: 1,
  },
  bannerPill: {
    backgroundColor: '#0284C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerPillText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  playgroundBannerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0369A1',
    marginBottom: 4,
  },
  playgroundBannerDesc: {
    fontSize: 12,
    color: '#075985',
    lineHeight: 16,
  },
  playgroundBannerIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  statSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  statSummaryVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  statSummaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
});
