import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById } from '@/data/curriculum';
import { getUserStats } from '@/database/repository';
import { GameButton } from '@/components/ui/GameButton';
import { WorldColors } from '@/constants/theme';
import { UserStats } from '@/types';
import { LocalCodeRunner } from '@/components/playground/LocalCodeRunner';
import { useResponsive } from '@/hooks/useResponsive';

export default function LessonDetailScreen() {
  const { contentMaxWidth } = useResponsive();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const lesson = getLessonById(id || '');

  useEffect(() => {
    async function loadStats() {
      const uStats = await getUserStats();
      setStats(uStats);
    }
    loadStats();
  }, []);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Materi tidak ditemukan.</Text>
          <GameButton
            title="Kembali ke Roadmap"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const worldTheme = WorldColors[lesson.worldId] || WorldColors.html;

  const handleStartQuiz = () => {
    if ((stats?.hearts ?? 5) <= 0) {
      Alert.alert(
        'Hati Habis!',
        'Kamu memerlukan setidaknya 1 hati untuk memulai evaluasi quiz. Tunggu hati terisi atau isi ulang dari dasbor.',
        [{ text: 'Mengerti' }]
      );
      return;
    }
    router.push(`/quiz/${lesson.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.navBar}>
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.navMiddle}>
            <Text style={[styles.navWorldTag, { color: worldTheme.primary }]}>
              {lesson.worldTitle} \u2022 Level {lesson.level}
            </Text>
          </View>

          <View style={styles.navXpPill}>
            <Ionicons name="star" size={14} color="#D97706" />
            <Text style={styles.navXpText}>+{lesson.xpReward} XP</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
        {/* Lesson Title & Objectives */}
        <View style={styles.headerCard}>
          <View style={[styles.levelTag, { backgroundColor: worldTheme.light }]}>
            <Text style={[styles.levelTagText, { color: worldTheme.dark }]}>
              {lesson.levelTitle}
            </Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.desc}>{lesson.description}</Text>

          <View style={styles.objectivesBox}>
            <Text style={styles.objectivesTitle}>Target Capaian Belajar:</Text>
            {lesson.objectives.map((obj, i) => (
              <View key={i} style={styles.objectiveRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.objectiveText}>{obj}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Lesson Body Content Blocks */}
        <View style={styles.contentContainer}>
          {lesson.content.map((block, idx) => {
            switch (block.type) {
              case 'heading':
                return (
                  <Text key={idx} style={styles.contentHeading}>
                    {block.content}
                  </Text>
                );

              case 'text':
                return (
                  <Text key={idx} style={styles.contentText}>
                    {block.content}
                  </Text>
                );

              case 'code':
                return (
                  <View key={idx} style={styles.codeBlock}>
                    <View style={styles.codeHeader}>
                      <Text style={styles.codeLang}>
                        {(block.codeLanguage || 'code').toUpperCase()}
                      </Text>
                      <View style={styles.codeDots}>
                        <View style={[styles.codeDot, { backgroundColor: '#EF4444' }]} />
                        <View style={[styles.codeDot, { backgroundColor: '#F59E0B' }]} />
                        <View style={[styles.codeDot, { backgroundColor: '#10B981' }]} />
                      </View>
                    </View>
                    <Text style={styles.codeContent}>{block.content}</Text>
                  </View>
                );

              case 'callout':
                return (
                  <View
                    key={idx}
                    style={[
                      styles.calloutBox,
                      block.calloutType === 'tip'
                        ? styles.calloutTip
                        : block.calloutType === 'warning'
                        ? styles.calloutWarn
                        : styles.calloutInfo,
                    ]}
                  >
                    <Ionicons
                      name={
                        block.calloutType === 'tip'
                          ? 'bulb'
                          : block.calloutType === 'warning'
                          ? 'alert-circle'
                          : 'information-circle'
                      }
                      size={20}
                      color={
                        block.calloutType === 'tip'
                          ? '#059669'
                          : block.calloutType === 'warning'
                          ? '#D97706'
                          : '#0284C7'
                      }
                    />
                    <Text style={styles.calloutText}>{block.content}</Text>
                  </View>
                );

              default:
                return null;
            }
          })}
        </View>

        {/* Interactive Snippet Live Preview Toggle */}
        {lesson.playgroundStarter && (
          <View style={styles.livePreviewCard}>
            <View style={styles.livePreviewTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.livePreviewTitle}>Laboratorium Interaktif</Text>
                <Text style={styles.livePreviewSub}>
                  Lihat bagaimana kode materi ini dirender di peramban secara lokal.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLivePreview(!showLivePreview)}
                style={styles.togglePreviewBtn}
              >
                <Ionicons
                  name={showLivePreview ? 'eye-off' : 'eye'}
                  size={16}
                  color="#0284C7"
                />
                <Text style={styles.togglePreviewText}>
                  {showLivePreview ? 'Tutup Preview' : 'Uji Visual'}
                </Text>
              </TouchableOpacity>
            </View>

            {showLivePreview && (
              <View style={styles.previewContainer}>
                <LocalCodeRunner
                  htmlCode={lesson.playgroundStarter.html}
                  cssCode={lesson.playgroundStarter.css}
                  jsCode={lesson.playgroundStarter.js}
                />
              </View>
            )}
          </View>
        )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Quiz CTA */}
      <View style={styles.bottomBar}>
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
          <GameButton
            title={`Uji Pemahaman (${lesson.questions.length} Soal) \u2192`}
            variant="primary"
            size="lg"
            onPress={handleStartQuiz}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 6,
  },
  navMiddle: {
    alignItems: 'center',
  },
  navWorldTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  navXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  navXpText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 20,
  },
  levelTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  levelTagText: {
    fontWeight: '800',
    fontSize: 11,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  objectivesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  objectivesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 2,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  objectiveText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  contentContainer: {
    gap: 14,
  },
  contentHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 10,
  },
  contentText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 4,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  codeLang: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  codeDots: {
    flexDirection: 'row',
    gap: 6,
  },
  codeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  codeContent: {
    padding: 14,
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  calloutBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
  },
  calloutTip: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  calloutInfo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  calloutWarn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  calloutText: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  livePreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 14,
  },
  livePreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePreviewTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  livePreviewSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  togglePreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  togglePreviewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  previewContainer: {
    height: 220,
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
  },
});
