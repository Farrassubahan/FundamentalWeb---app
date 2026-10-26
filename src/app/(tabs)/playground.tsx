import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LocalCodeRunner } from '@/components/playground/LocalCodeRunner';
import { ProCodeEditor } from '@/components/playground/ProCodeEditor';
import { PLAYGROUND_TEMPLATES, PlaygroundTemplate } from '@/data/playgroundTemplates';
import { useResponsive } from '@/hooks/useResponsive';

type ActiveLang = 'html' | 'css' | 'js';
type ViewMode = 'editor' | 'preview' | 'console' | 'split';
type ConsoleFilter = 'all' | 'log' | 'error' | 'warn';

interface ConsoleLog {
  id: number;
  type: 'log' | 'error' | 'warn';
  text: string;
  time: string;
}

export default function PlaygroundScreen() {
  const { isTablet, isDesktop, width } = useResponsive();
  const isLargeScreen = isTablet || isDesktop;

  const [activeLang, setActiveLang] = useState<ActiveLang>('html');
  const [viewMode, setViewMode] = useState<ViewMode>(isLargeScreen ? 'split' : 'editor');
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>('all');
  const [previewKey, setPreviewKey] = useState(0);

  // Default code from first template
  const initial = PLAYGROUND_TEMPLATES[0];
  const [htmlCode, setHtmlCode] = useState(initial.html);
  const [cssCode, setCssCode] = useState(initial.css);
  const [jsCode, setJsCode] = useState(initial.js);

  // Executed code state for WebView runner
  const [runnerHtml, setRunnerHtml] = useState(initial.html);
  const [runnerCss, setRunnerCss] = useState(initial.css);
  const [runnerJs, setRunnerJs] = useState(initial.js);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  // Console output state
  const logIdRef = useRef(10);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    {
      id: 1,
      type: 'log',
      text: 'BPROTIC Dev Environment siap. Tekan "Jalankan" untuk mengeksekusi.',
      time: getCurrentTime(),
    },
  ]);

  const errorCount = useMemo(
    () => consoleLogs.filter((l) => l.type === 'error').length,
    [consoleLogs]
  );

  const filteredLogs = useMemo(() => {
    if (consoleFilter === 'all') return consoleLogs;
    return consoleLogs.filter((l) => l.type === consoleFilter);
  }, [consoleLogs, consoleFilter]);

  const handleRun = () => {
    setRunnerHtml(htmlCode);
    setRunnerCss(cssCode);
    setRunnerJs(jsCode);
    setPreviewKey((k) => k + 1);
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: ++logIdRef.current,
        type: 'log',
        text: '--- Eksekusi Kode Dijalankan ---',
        time: getCurrentTime(),
      },
    ]);
    if (!isLargeScreen) {
      setViewMode('preview');
    }
  };

  const handleReset = () => {
    setHtmlCode(initial.html);
    setCssCode(initial.css);
    setJsCode(initial.js);
    setRunnerHtml(initial.html);
    setRunnerCss(initial.css);
    setRunnerJs(initial.js);
    setPreviewKey((k) => k + 1);
    setConsoleLogs([
      {
        id: ++logIdRef.current,
        type: 'log',
        text: 'Kode berhasil di-reset ke template dasar.',
        time: getCurrentTime(),
      },
    ]);
  };

  const handleSelectTemplate = (template: PlaygroundTemplate) => {
    setHtmlCode(template.html);
    setCssCode(template.css);
    setJsCode(template.js);
    setRunnerHtml(template.html);
    setRunnerCss(template.css);
    setRunnerJs(template.js);
    setPreviewKey((k) => k + 1);
    setConsoleLogs([
      {
        id: ++logIdRef.current,
        type: 'log',
        text: `Template "${template.name}" dimuat.`,
        time: getCurrentTime(),
      },
    ]);
    setTemplateModalVisible(false);
  };

  const handleConsoleMsg = (msg: { type: 'log' | 'error' | 'warn'; text: string }) => {
    setConsoleLogs((prev) => [
      ...prev.slice(-40),
      {
        id: ++logIdRef.current,
        type: msg.type,
        text: msg.text,
        time: getCurrentTime(),
      },
    ]);
  };

  const handleReloadPreview = () => {
    setPreviewKey((k) => k + 1);
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: ++logIdRef.current,
        type: 'log',
        text: 'Browser preview dimuat ulang.',
        time: getCurrentTime(),
      },
    ]);
  };

  const activeCode = activeLang === 'html' ? htmlCode : activeLang === 'css' ? cssCode : jsCode;
  const setActiveCode = (newVal: string) => {
    if (activeLang === 'html') setHtmlCode(newVal);
    else if (activeLang === 'css') setCssCode(newVal);
    else setJsCode(newVal);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* TIER 1: TOP APP HEADER */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleBox}>
          <View style={styles.brandBadge}>
            <Ionicons name="terminal" size={16} color="#10B981" />
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Playground
            </Text>
            {width >= 370 && (
              <View style={styles.ideTag}>
                <Text style={styles.ideTagText}>Web IDE</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setTemplateModalVisible(true)}
            activeOpacity={0.75}
            accessibilityLabel="Pilih Template"
          >
            <Ionicons name="albums-outline" size={16} color="#38BDF8" />
            {(isLargeScreen || width >= 410) && (
              <Text style={styles.actionBtnText}>Template</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleReset}
            activeOpacity={0.75}
            accessibilityLabel="Reset Kode"
          >
            <Ionicons name="refresh-outline" size={16} color="#F87171" />
            {(isLargeScreen || width >= 460) && (
              <Text style={[styles.actionBtnText, { color: '#F87171' }]}>Reset</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.runBtn}
            onPress={handleRun}
            activeOpacity={0.8}
            accessibilityLabel="Jalankan Kode"
          >
            <Ionicons name="play" size={14} color="#FFFFFF" />
            <Text style={styles.runBtnText}>
              {width < 340 ? 'Run' : 'Jalankan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TIER 2: PRIMARY NAVIGATION BAR (Segmented Control) */}
      <View style={styles.navBar}>
        {!isLargeScreen ? (
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              onPress={() => setViewMode('editor')}
              style={[
                styles.segmentTab,
                viewMode === 'editor' && styles.segmentTabActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="code-slash"
                size={14}
                color={viewMode === 'editor' ? '#38BDF8' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  viewMode === 'editor' && styles.segmentTabTextActive,
                ]}
              >
                Editor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode('preview')}
              style={[
                styles.segmentTab,
                viewMode === 'preview' && styles.segmentTabActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="eye"
                size={14}
                color={viewMode === 'preview' ? '#10B981' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  viewMode === 'preview' && styles.segmentTabTextActive,
                ]}
              >
                Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode('console')}
              style={[
                styles.segmentTab,
                viewMode === 'console' && styles.segmentTabActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="terminal"
                size={14}
                color={viewMode === 'console' ? '#A78BFA' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  viewMode === 'console' && styles.segmentTabTextActive,
                ]}
              >
                Console
              </Text>
              {errorCount > 0 ? (
                <View style={styles.errorDotBadge}>
                  <Text style={styles.badgeText}>{errorCount}</Text>
                </View>
              ) : consoleLogs.length > 0 ? (
                <View style={styles.neutralDotBadge} />
              ) : null}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              onPress={() => setViewMode('split')}
              style={[
                styles.segmentTab,
                viewMode === 'split' && styles.segmentTabActive,
              ]}
            >
              <Ionicons
                name="browsers-outline"
                size={14}
                color={viewMode === 'split' ? '#38BDF8' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  viewMode === 'split' && styles.segmentTabTextActive,
                ]}
              >
                Split View (2 Kolom)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode('editor')}
              style={[
                styles.segmentTab,
                viewMode === 'editor' && styles.segmentTabActive,
              ]}
            >
              <Ionicons
                name="code-slash"
                size={14}
                color={viewMode === 'editor' ? '#38BDF8' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  viewMode === 'editor' && styles.segmentTabTextActive,
                ]}
              >
                Editor Penuh
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode('preview')}
              style={[
                styles.segmentTab,
                viewMode === 'preview' && styles.segmentTabActive,
              ]}
            >
              <Ionicons
                name="eye"
                size={14}
                color={viewMode === 'preview' ? '#10B981' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  viewMode === 'preview' && styles.segmentTabTextActive,
                ]}
              >
                Preview Penuh
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* TIER 3: FILE SELECTION TABS (Dedicated full width, zero text cut off) */}
      {(viewMode === 'editor' || viewMode === 'split') && (
        <View style={styles.fileBar}>
          <TouchableOpacity
            onPress={() => setActiveLang('html')}
            style={[
              styles.fileTab,
              activeLang === 'html' && styles.fileTabActiveHtml,
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.langDot, { backgroundColor: '#EA580C' }]} />
            <Text
              style={[
                styles.fileTabText,
                activeLang === 'html' && styles.fileTabTextActive,
              ]}
              numberOfLines={1}
            >
              index.html
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveLang('css')}
            style={[
              styles.fileTab,
              activeLang === 'css' && styles.fileTabActiveCss,
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.langDot, { backgroundColor: '#0284C7' }]} />
            <Text
              style={[
                styles.fileTabText,
                activeLang === 'css' && styles.fileTabTextActive,
              ]}
              numberOfLines={1}
            >
              style.css
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveLang('js')}
            style={[
              styles.fileTab,
              activeLang === 'js' && styles.fileTabActiveJs,
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.langDot, { backgroundColor: '#16A34A' }]} />
            <Text
              style={[
                styles.fileTabText,
                activeLang === 'js' && styles.fileTabTextActive,
              ]}
              numberOfLines={1}
            >
              script.js
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* WORKSPACE BODY AREA */}
      <KeyboardAvoidingView
        style={styles.workspace}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {viewMode === 'split' ? (
          /* Large Screen Side-by-Side */
          <View style={styles.splitLayout}>
            <View style={styles.splitColumn}>
              <ProCodeEditor
                code={activeCode}
                onChangeCode={setActiveCode}
                language={activeLang}
              />
            </View>

            <View style={styles.splitColumn}>
              {/* Preview Box */}
              <View style={styles.previewPanel}>
                <View style={styles.browserBar}>
                  <View style={styles.browserAddress}>
                    <Ionicons name="globe-outline" size={13} color="#38BDF8" />
                    <Text style={styles.browserUrl}>bprotic://localhost:3000</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.browserReloadBtn}
                    onPress={handleReloadPreview}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="reload" size={13} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.previewBox}>
                  <LocalCodeRunner
                    key={previewKey}
                    htmlCode={runnerHtml}
                    cssCode={runnerCss}
                    jsCode={runnerJs}
                    onConsoleMessage={handleConsoleMsg}
                  />
                </View>
              </View>

              {/* Console Panel on Split */}
              <View style={styles.consolePanel}>
                <View style={styles.panelHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="terminal-outline" size={14} color="#A78BFA" />
                    <Text style={styles.panelTitle}>Console Output</Text>
                    {errorCount > 0 && (
                      <View style={styles.errorPill}>
                        <Text style={styles.errorPillText}>{errorCount} error</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => setConsoleLogs([])}>
                    <Text style={styles.clearLogsText}>Bersihkan</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.consoleScroll}>
                  {consoleLogs.map((log) => (
                    <View key={log.id} style={styles.logRow}>
                      <Text style={styles.logTime}>{log.time}</Text>
                      <Text
                        style={[
                          styles.logText,
                          log.type === 'error' && styles.logError,
                          log.type === 'warn' && styles.logWarn,
                        ]}
                      >
                        {log.type === 'error' ? '✘ ' : '> '}
                        {log.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ) : viewMode === 'editor' ? (
          /* Editor View on Mobile */
          <View style={styles.fullContainer}>
            <ProCodeEditor
              code={activeCode}
              onChangeCode={setActiveCode}
              language={activeLang}
            />
          </View>
        ) : viewMode === 'preview' ? (
          /* Preview View on Mobile */
          <View style={styles.fullContainer}>
            <View style={styles.previewContainer}>
              {/* Mock Browser Header */}
              <View style={styles.browserBar}>
                <View style={styles.browserAddress}>
                  <Ionicons name="globe-outline" size={13} color="#10B981" />
                  <Text style={styles.browserUrl} numberOfLines={1}>
                    bprotic://localhost:3000
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity
                    style={styles.browserReloadBtn}
                    onPress={handleReloadPreview}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="reload" size={14} color="#94A3B8" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickConsoleBtn}
                    onPress={() => setViewMode('console')}
                  >
                    <Ionicons name="terminal" size={12} color="#A78BFA" />
                    <Text style={styles.quickConsoleBtnText}>
                      Log ({consoleLogs.length})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* WebView */}
              <View style={styles.previewBox}>
                <LocalCodeRunner
                  key={previewKey}
                  htmlCode={runnerHtml}
                  cssCode={runnerCss}
                  jsCode={runnerJs}
                  onConsoleMessage={handleConsoleMsg}
                />
              </View>
            </View>

            {/* Floating Action Button to return to editor easily */}
            <TouchableOpacity
              style={styles.backToEditorFab}
              onPress={() => setViewMode('editor')}
              activeOpacity={0.85}
            >
              <Ionicons name="code-slash" size={16} color="#FFFFFF" />
              <Text style={styles.backToEditorFabText}>Edit Kode</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Console View on Mobile */
          <View style={styles.fullContainer}>
            <View style={styles.consoleCard}>
              <View style={styles.panelHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="terminal" size={15} color="#A78BFA" />
                  <Text style={styles.panelTitle}>JavaScript Console</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setConsoleLogs([])}
                  style={styles.clearBtn}
                >
                  <Ionicons name="trash-outline" size={13} color="#94A3B8" />
                  <Text style={styles.clearLogsText}>Bersihkan</Text>
                </TouchableOpacity>
              </View>

              {/* Filter Tabs */}
              <View style={styles.consoleFilterBar}>
                {(['all', 'log', 'warn', 'error'] as ConsoleFilter[]).map((filter) => {
                  const count =
                    filter === 'all'
                      ? consoleLogs.length
                      : consoleLogs.filter((l) => l.type === filter).length;
                  const label =
                    filter === 'all'
                      ? 'Semua'
                      : filter === 'log'
                      ? 'Info'
                      : filter === 'warn'
                      ? 'Warning'
                      : 'Error';

                  return (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setConsoleFilter(filter)}
                      style={[
                        styles.filterChip,
                        consoleFilter === filter && styles.filterChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          consoleFilter === filter && styles.filterChipTextActive,
                        ]}
                      >
                        {label} ({count})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Log List */}
              {filteredLogs.length === 0 ? (
                <View style={styles.emptyConsole}>
                  <Ionicons name="terminal-outline" size={40} color="#334155" />
                  <Text style={styles.emptyConsoleTitle}>Tidak ada log</Text>
                  <Text style={styles.emptyConsoleSubtitle}>
                    {consoleFilter === 'all'
                      ? 'Jalankan kode untuk melihat output JavaScript console.'
                      : `Tidak ada log bertipe "${consoleFilter}".`}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.consoleScroll}>
                  {filteredLogs.map((log) => (
                    <View
                      key={log.id}
                      style={[
                        styles.logRow,
                        log.type === 'error' && styles.logRowError,
                        log.type === 'warn' && styles.logRowWarn,
                      ]}
                    >
                      <View style={styles.logMeta}>
                        <Ionicons
                          name={
                            log.type === 'error'
                              ? 'close-circle'
                              : log.type === 'warn'
                              ? 'warning'
                              : 'chevron-forward'
                          }
                          size={13}
                          color={
                            log.type === 'error'
                              ? '#F87171'
                              : log.type === 'warn'
                              ? '#FBBF24'
                              : '#38BDF8'
                          }
                        />
                        <Text style={styles.logTime}>{log.time}</Text>
                      </View>
                      <Text
                        style={[
                          styles.logText,
                          log.type === 'error' && styles.logError,
                          log.type === 'warn' && styles.logWarn,
                        ]}
                      >
                        {log.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* TEMPLATE MODAL */}
      <Modal
        visible={templateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTemplateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: Math.min(width - 32, 520) }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalIconWrap}>
                  <Ionicons name="albums" size={18} color="#38BDF8" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Koleksi Template Kode</Text>
                  <Text style={styles.modalSubtitle}>Pilih starter project praktis</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setTemplateModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {PLAYGROUND_TEMPLATES.map((tpl) => (
                <TouchableOpacity
                  key={tpl.id}
                  onPress={() => handleSelectTemplate(tpl)}
                  style={styles.templateItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.templateItemHeader}>
                    <Text style={styles.templateItemTitle}>{tpl.name}</Text>
                    <View
                      style={[
                        styles.templateItemBadge,
                        tpl.category === 'HTML' && { backgroundColor: '#7C2D12' },
                        tpl.category === 'CSS' && { backgroundColor: '#075985' },
                        tpl.category === 'JavaScript' && { backgroundColor: '#14532D' },
                      ]}
                    >
                      <Text style={styles.templateItemBadgeText}>{tpl.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.templateItemDesc}>{tpl.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#090D16',
  },

  /* Top App Bar */
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  brandBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  ideTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ideTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
    minHeight: 32,
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F87171',
  },
  runBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    minHeight: 32,
    elevation: 2,
  },
  runBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Primary Navigation Bar (Segmented Control) */
  navBar: {
    backgroundColor: '#0D131F',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#151D2C',
    padding: 3,
    borderRadius: 9,
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 7,
    gap: 5,
  },
  segmentTabActive: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  segmentTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  errorDotBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  neutralDotBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
    marginLeft: 2,
  },

  /* File Selection Tabs */
  fileBar: {
    flexDirection: 'row',
    backgroundColor: '#0B0F19',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 6,
  },
  fileTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  fileTabActiveHtml: {
    borderBottomColor: '#EA580C',
    backgroundColor: '#181411',
  },
  fileTabActiveCss: {
    borderBottomColor: '#0284C7',
    backgroundColor: '#0F1A26',
  },
  fileTabActiveJs: {
    borderBottomColor: '#16A34A',
    backgroundColor: '#101C16',
  },
  langDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  fileTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fileTabTextActive: {
    color: '#F8FAFC',
    fontWeight: '800',
  },

  /* Workspace */
  workspace: {
    flex: 1,
    padding: 8,
  },
  fullContainer: {
    flex: 1,
  },
  splitLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  splitColumn: {
    flex: 1,
    gap: 8,
  },
  previewPanel: {
    flex: 3,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  previewBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  browserBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  browserAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  browserUrl: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  browserReloadBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#1F2937',
  },
  quickConsoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  quickConsoleBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A78BFA',
  },
  backToEditorFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backToEditorFabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Console Panel */
  consolePanel: {
    flex: 2,
    backgroundColor: '#090D15',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  consoleCard: {
    flex: 1,
    backgroundColor: '#090D15',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 0.3,
  },
  errorPill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  errorPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearLogsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  consoleFilterBar: {
    flexDirection: 'row',
    backgroundColor: '#0D131F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  filterChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#1E293B',
  },
  filterChipActive: {
    backgroundColor: '#334155',
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterChipTextActive: {
    color: '#F8FAFC',
  },
  consoleScroll: {
    flex: 1,
    padding: 10,
  },
  logRow: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#151D2C',
  },
  logRowError: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  logRowWarn: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  logTime: {
    fontSize: 9,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  logError: {
    color: '#F87171',
    fontWeight: '700',
  },
  logWarn: {
    color: '#FBBF24',
  },
  emptyConsole: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyConsoleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  emptyConsoleSubtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 16,
  },

  /* Template Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
  },
  modalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  modalCloseBtn: {
    padding: 4,
  },
  templateItem: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  templateItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  templateItemBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  templateItemBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  templateItemDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
});
