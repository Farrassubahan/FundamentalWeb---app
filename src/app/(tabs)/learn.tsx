import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TopHeaderStats } from '@/components/ui/TopHeaderStats';
import { PathNode } from '@/components/ui/PathNode';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  getUserStats,
  getAllLessonProgress,
} from '@/database/repository';
import {
  WORLDS_META,
  getLessonsByWorld,
  getAllProjects,
} from '@/data/curriculum';
import { UserStats, LessonProgress, WorldId, Lesson, WebProject } from '@/types';
import { WorldColors } from '@/constants/theme';

export default function LearnScreen() {
  const [activeWorld, setActiveWorld] = useState<WorldId>('html');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});

  const loadData = useCallback(async () => {
    try {
      const [uStats, uProgress] = await Promise.all([
        getUserStats(),
        getAllLessonProgress(),
      ]);
      setStats(uStats);
      setProgressMap(uProgress);
    } catch (err) {
      console.warn('Error loading learn data:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const currentMeta = WORLDS_META.find((w) => w.id === activeWorld) || WORLDS_META[0];
  const worldTheme = WorldColors[activeWorld];

  const lessons = getLessonsByWorld(activeWorld);
  const projects = getAllProjects();

  const handleLessonPress = (lesson: Lesson) => {
    const status = progressMap[lesson.id]?.status || (lesson.id === 'html-101' ? 'unlocked' : 'locked');
    if (status === 'locked') {
      Alert.alert(
        'Materi Terkunci',
        'Selesaikan materi sebelumnya terlebih dahulu untuk membuka pelajaran ini!',
        [{ text: 'Baiklah' }]
      );
      return;
    }
    router.push(`/lesson/${lesson.id}`);
  };

  const handleProjectPress = (project: WebProject) => {
    router.push(`/project/${project.id}`);
  };

  // Calculate world progress percentage
  const completedCount = lessons.filter(
    (l) => progressMap[l.id]?.status === 'completed'
  ).length;
  const progressPercent = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  // Zigzag offsets for Duolingo serpentine path (-35, 0, 35, 0, -35...)
  const getZigzagOffset = (index: number) => {
    const pattern = [0, 35, 0, -35];
    return pattern[index % pattern.length];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopHeaderStats stats={stats} onRefreshStats={loadData} />

      {/* World Selector Tabs */}
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {WORLDS_META.map((w) => {
            const isSelected = activeWorld === w.id;
            const tabCol = WorldColors[w.id];
            return (
              <TouchableOpacity
                key={w.id}
                onPress={() => setActiveWorld(w.id)}
                style={[
                  styles.tabItem,
                  isSelected && {
                    backgroundColor: tabCol.light,
                    borderColor: tabCol.primary,
                  },
                ]}
              >
                <Ionicons
                  name={w.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={isSelected ? tabCol.primary : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabItemText,
                    isSelected && { color: tabCol.dark, fontWeight: '800' },
                  ]}
                >
                  {w.id.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* World Header Card */}
        <View style={[styles.worldHeaderCard, { backgroundColor: worldTheme.light, borderColor: worldTheme.primary }]}>
          <View style={styles.worldHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.worldTagline, { color: worldTheme.dark }]}>
                {currentMeta.tagline}
              </Text>
              <Text style={[styles.worldTitle, { color: worldTheme.dark }]}>
                {currentMeta.title}
              </Text>
            </View>
            <View style={[styles.iconBox, { backgroundColor: worldTheme.primary }]}>
              <Ionicons
                name={currentMeta.icon as keyof typeof Ionicons.glyphMap}
                size={28}
                color="#FFFFFF"
              />
            </View>
          </View>
          <Text style={styles.worldDesc}>{currentMeta.description}</Text>

          <View style={styles.progressRow}>
            <ProgressBar
              progress={activeWorld === 'projects' ? 25 : progressPercent}
              color={worldTheme.primary}
              height={10}
              showText={true}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Learning Roadmap Nodes */}
        {activeWorld !== 'projects' ? (
          <View style={styles.pathContainer}>
            {lessons.map((lesson, idx) => {
              const status =
                progressMap[lesson.id]?.status ||
                (lesson.id === 'html-101' ? 'unlocked' : 'locked');
              const offset = getZigzagOffset(idx);

              return (
                <View key={lesson.id} style={styles.nodeWrapper}>
                  {idx > 0 && <View style={styles.connectingLine} />}
                  <PathNode
                    order={lesson.order}
                    title={lesson.title}
                    status={status}
                    color={worldTheme.primary}
                    shadowColor={worldTheme.shadow}
                    offsetHorizontal={offset}
                    onPress={() => handleLessonPress(lesson)}
                  />
                </View>
              );
            })}

            {/* Final World Milestone Trophy */}
            <View style={styles.milestoneBox}>
              <View style={[styles.trophyCircle, { backgroundColor: worldTheme.light }]}>
                <Ionicons name="trophy" size={36} color={worldTheme.primary} />
              </View>
              <Text style={styles.milestoneTitle}>Ujian Akhir {currentMeta.title}</Text>
              <Text style={styles.milestoneSub}>
                Selesaikan semua materi di atas untuk menguji keahlianmu!
              </Text>
            </View>
          </View>
        ) : (
          /* World 4: Web Projects List */
          <View style={styles.projectsContainer}>
            <Text style={styles.projectsIntro}>
              Pilih proyek web mandiri di bawah ini. Tulis HTML, CSS, dan JavaScript secara offline di playground terpadu!
            </Text>

            {projects.map((proj, idx) => (
              <TouchableOpacity
                key={proj.id}
                activeOpacity={0.8}
                onPress={() => handleProjectPress(proj)}
                style={styles.projectCard}
              >
                <View style={styles.projectTop}>
                  <View style={styles.projectBadge}>
                    <Text style={styles.projectBadgeText}>{proj.difficulty}</Text>
                  </View>
                  <View style={styles.projectXp}>
                    <Ionicons name="star" size={14} color="#D97706" />
                    <Text style={styles.projectXpText}>+{proj.xpReward} XP</Text>
                  </View>
                </View>

                <Text style={styles.projectTitle}>
                  {idx + 1}. {proj.title}
                </Text>
                <Text style={styles.projectDesc} numberOfLines={2}>
                  {proj.description}
                </Text>

                <View style={styles.projectCriteriaSummary}>
                  <Ionicons name="checkbox-outline" size={16} color="#7C3AED" />
                  <Text style={styles.criteriaCountText}>
                    {proj.criteria.length} kriteria pengujian
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  worldHeaderCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderBottomWidth: 4,
    marginBottom: 24,
  },
  worldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  worldTagline: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  worldTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  worldDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  nodeWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  connectingLine: {
    width: 6,
    height: 24,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  milestoneBox: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    width: '100%',
  },
  trophyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  milestoneSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  projectsContainer: {
    gap: 14,
  },
  projectsIntro: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  projectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  projectBadgeText: {
    color: '#6D28D9',
    fontWeight: '800',
    fontSize: 11,
  },
  projectXp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  projectXpText: {
    color: '#92400E',
    fontWeight: '800',
    fontSize: 11,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  projectCriteriaSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  criteriaCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
