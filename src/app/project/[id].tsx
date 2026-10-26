import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProjectById } from '@/data/curriculum';
import {
  saveProjectSubmission,
  getProjectSubmission,
  addXP,
  getUserStats,
} from '@/database/repository';
import { checkAndAwardBadges } from '@/services/gamification';
import { GameButton } from '@/components/ui/GameButton';
import { LocalCodeRunner } from '@/components/playground/LocalCodeRunner';
import { CelebrationModal } from '@/components/ui/CelebrationModal';
import { Badge } from '@/types';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = getProjectById(id || '');

  const [activeTab, setActiveTab] = useState<'criteria' | 'editor' | 'preview'>('criteria');
  const [editorLang, setEditorLang] = useState<'html' | 'css' | 'js'>('html');

  const [htmlCode, setHtmlCode] = useState(project?.starterCode.html || '');
  const [cssCode, setCssCode] = useState(project?.starterCode.css || '');
  const [jsCode, setJsCode] = useState(project?.starterCode.js || '');

  const [runnerHtml, setRunnerHtml] = useState(project?.starterCode.html || '');
  const [runnerCss, setRunnerCss] = useState(project?.starterCode.css || '');
  const [runnerJs, setRunnerJs] = useState(project?.starterCode.js || '');

  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    async function loadSaved() {
      if (!project) return;
      const saved = await getProjectSubmission(project.id);
      if (saved) {
        setHtmlCode(saved.htmlCode);
        setCssCode(saved.cssCode);
        setJsCode(saved.jsCode);
        setRunnerHtml(saved.htmlCode);
        setRunnerCss(saved.cssCode);
        setRunnerJs(saved.jsCode);
        setIsCompleted(saved.completed);
      }
    }
    loadSaved();
  }, [project]);

  if (!project) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <Text style={styles.centerText}>Project tidak ditemukan.</Text>
          <GameButton
            title="Kembali"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const toggleCriteria = (idx: number) => {
    setCheckedCriteria((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleRun = () => {
    setRunnerHtml(htmlCode);
    setRunnerCss(cssCode);
    setRunnerJs(jsCode);
    setActiveTab('preview');
  };

  const handleSubmit = async () => {
    const allChecked = project.criteria.every((_, idx) => checkedCriteria[idx]);
    if (!allChecked) {
      Alert.alert(
        'Belum Selesai',
        'Pastikan kamu telah menguji dan mencentang semua kriteria acceptance checklist sebelum mengumpulkan proyek!',
        [{ text: 'Lanjut Periksa' }]
      );
      return;
    }

    try {
      await saveProjectSubmission(project.id, htmlCode, cssCode, jsCode, true);
      await addXP(project.xpReward);

      // Check badges
      const stats = await getUserStats();
      const newBadges = await checkAndAwardBadges(stats, 0, 1);
      if (newBadges.length > 0) {
        setUnlockedBadge(newBadges[0]);
      }

      setIsCompleted(true);
      setShowCelebration(true);
    } catch {
      Alert.alert('Error', 'Gagal menyimpan hasil submission.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <Text style={styles.projectCategory}>Mini Project Web</Text>
          <Text style={styles.projectTitle} numberOfLines={1}>
            {project.title}
          </Text>
        </View>

        <View style={styles.xpPill}>
          <Ionicons name="star" size={14} color="#D97706" />
          <Text style={styles.xpText}>+{project.xpReward} XP</Text>
        </View>
      </View>

      {/* Main Mode Tabs */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('criteria')}
          style={[styles.modeTab, activeTab === 'criteria' && styles.modeTabActive]}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={activeTab === 'criteria' ? '#7C3AED' : '#64748B'}
          />
          <Text
            style={[
              styles.modeTabText,
              activeTab === 'criteria' && styles.modeTabTextActive,
            ]}
          >
            Kriteria
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('editor')}
          style={[styles.modeTab, activeTab === 'editor' && styles.modeTabActive]}
        >
          <Ionicons
            name="code-slash-outline"
            size={16}
            color={activeTab === 'editor' ? '#7C3AED' : '#64748B'}
          />
          <Text
            style={[
              styles.modeTabText,
              activeTab === 'editor' && styles.modeTabTextActive,
            ]}
          >
            Editor Kode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRun}
          style={[styles.modeTab, activeTab === 'preview' && styles.modeTabActive]}
        >
          <Ionicons
            name="eye-outline"
            size={16}
            color={activeTab === 'preview' ? '#7C3AED' : '#64748B'}
          />
          <Text
            style={[
              styles.modeTabText,
              activeTab === 'preview' && styles.modeTabTextActive,
            ]}
          >
            Live Preview
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Criteria & Instructions */}
      {activeTab === 'criteria' && (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Deskripsi Proyek</Text>
            <Text style={styles.descText}>{project.description}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Checklist Acceptance Criteria:</Text>
            <Text style={styles.subText}>
              Sentuh centang setelah kamu berhasil mengimplementasikan fitur tersebut:
            </Text>
            <View style={styles.criteriaList}>
              {project.criteria.map((item, idx) => {
                const checked = !!checkedCriteria[idx];
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => toggleCriteria(idx)}
                    style={[
                      styles.criteriaItem,
                      checked && styles.criteriaItemChecked,
                    ]}
                  >
                    <Ionicons
                      name={checked ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={checked ? '#7C3AED' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.criteriaText,
                        checked && styles.criteriaTextChecked,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Petunjuk & Tips:</Text>
            {project.hints.map((hint, idx) => (
              <View key={idx} style={styles.hintRow}>
                <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionBox}>
            <GameButton
              title="Mulai Tulis Kode di Editor \u2192"
              variant="purple"
              size="lg"
              onPress={() => setActiveTab('editor')}
              style={{ width: '100%', marginBottom: 12 }}
            />
            <GameButton
              title={isCompleted ? '\u2714\ufe0f Proyek Sudah Diselesaikan' : 'Submit & Nilai Proyek'}
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      )}

      {/* Tab 2: Code Editor */}
      {activeTab === 'editor' && (
        <KeyboardAvoidingView
          style={styles.flexBox}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Editor Language Selector */}
          <View style={styles.editorSubBar}>
            <TouchableOpacity
              onPress={() => setEditorLang('html')}
              style={[
                styles.editorSubTab,
                editorLang === 'html' && { borderBottomColor: '#EA580C' },
              ]}
            >
              <Text
                style={[
                  styles.editorSubTabText,
                  editorLang === 'html' && { color: '#EA580C', fontWeight: '800' },
                ]}
              >
                index.html
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditorLang('css')}
              style={[
                styles.editorSubTab,
                editorLang === 'css' && { borderBottomColor: '#0284C7' },
              ]}
            >
              <Text
                style={[
                  styles.editorSubTabText,
                  editorLang === 'css' && { color: '#0284C7', fontWeight: '800' },
                ]}
              >
                style.css
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditorLang('js')}
              style={[
                styles.editorSubTab,
                editorLang === 'js' && { borderBottomColor: '#16A34A' },
              ]}
            >
              <Text
                style={[
                  styles.editorSubTabText,
                  editorLang === 'js' && { color: '#16A34A', fontWeight: '800' },
                ]}
              >
                script.js
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editorRunBtn} onPress={handleRun}>
              <Ionicons name="play" size={14} color="#FFFFFF" />
              <Text style={styles.editorRunText}>Run</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.editorInputContainer}>
            <TextInput
              style={styles.editorInput}
              multiline={true}
              value={editorLang === 'html' ? htmlCode : editorLang === 'css' ? cssCode : jsCode}
              onChangeText={(text) => {
                if (editorLang === 'html') setHtmlCode(text);
                else if (editorLang === 'css') setCssCode(text);
                else setJsCode(text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              placeholderTextColor="#64748B"
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Tab 3: Live Preview */}
      {activeTab === 'preview' && (
        <View style={styles.flexBox}>
          <View style={styles.previewContainer}>
            <LocalCodeRunner
              htmlCode={runnerHtml}
              cssCode={runnerCss}
              jsCode={runnerJs}
            />
          </View>
          <View style={styles.previewBottomBar}>
            <GameButton
              title="Kembali Edit Kode"
              variant="outline"
              size="md"
              onPress={() => setActiveTab('editor')}
              style={{ flex: 1 }}
            />
            <GameButton
              title="Submit Proyek \u2192"
              variant="primary"
              size="md"
              onPress={handleSubmit}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        visible={showCelebration}
        type="lesson_complete"
        xpEarned={project.xpReward}
        badge={unlockedBadge || undefined}
        onClose={() => {
          setShowCelebration(false);
          router.replace('/(tabs)/learn');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 6,
  },
  projectCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modeTabActive: {
    borderBottomColor: '#7C3AED',
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#7C3AED',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  criteriaList: {
    gap: 10,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  criteriaItemChecked: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  criteriaText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  criteriaTextChecked: {
    color: '#6D28D9',
    fontWeight: '700',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  actionBox: {
    marginTop: 8,
  },
  flexBox: {
    flex: 1,
  },
  editorSubBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  editorSubTab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  editorSubTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  editorRunBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
    gap: 4,
  },
  editorRunText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  editorInputContainer: {
    flex: 1,
    backgroundColor: '#090D16',
    padding: 12,
  },
  editorInput: {
    flex: 1,
    color: '#F8FAFC',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  previewContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F1F5F9',
  },
  previewBottomBar: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerText: {
    fontSize: 16,
    color: '#64748B',
  },
});
