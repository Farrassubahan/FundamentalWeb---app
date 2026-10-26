import React, { useState, useRef } from 'react';
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
type ViewMode = 'editor' | 'preview' | 'split';

interface ConsoleLog {
  id: number;
  type: 'log' | 'error' | 'warn';
  text: string;
}

export default function PlaygroundScreen() {
  const { isTablet, isDesktop, width } = useResponsive();
  const isLargeScreen = isTablet || isDesktop;

  const [activeLang, setActiveLang] = useState<ActiveLang>('html');
  const [viewMode, setViewMode] = useState<ViewMode>(isLargeScreen ? 'split' : 'editor');
  const [templateModalVisible, setTemplateModalVisible] = useState(false);

  // Default code from first template
  const initial = PLAYGROUND_TEMPLATES[0];
  const [htmlCode, setHtmlCode] = useState(initial.html);
  const [cssCode, setCssCode] = useState(initial.css);
  const [jsCode, setJsCode] = useState(initial.js);

  // Executed code state for WebView runner
  const [runnerHtml, setRunnerHtml] = useState(initial.html);
  const [runnerCss, setRunnerCss] = useState(initial.css);
  const [runnerJs, setRunnerJs] = useState(initial.js);

  // Console output state
  const logIdRef = useRef(10);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { id: 1, type: 'log', text: 'BPROTIC Dev Environment siap. Tekan "Jalankan" untuk mengeksekusi.' },
  ]);

  const handleRun = () => {
    setRunnerHtml(htmlCode);
    setRunnerCss(cssCode);
    setRunnerJs(jsCode);
    setConsoleLogs((prev) => [
      ...prev,
      { id: ++logIdRef.current, type: 'log', text: '--- Eksekusi Kode Dijalankan ---' },
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
    setConsoleLogs([
      { id: ++logIdRef.current, type: 'log', text: 'Kode berhasil di-reset ke template dasar.' },
    ]);
  };

  const handleSelectTemplate = (template: PlaygroundTemplate) => {
    setHtmlCode(template.html);
    setCssCode(template.css);
    setJsCode(template.js);
    setRunnerHtml(template.html);
    setRunnerCss(template.css);
    setRunnerJs(template.js);
    setConsoleLogs([
      { id: ++logIdRef.current, type: 'log', text: `Template "${template.name}" dimuat.` },
    ]);
    setTemplateModalVisible(false);
  };

  const handleConsoleMsg = (msg: { type: 'log' | 'error' | 'warn'; text: string }) => {
    setConsoleLogs((prev) => [
      ...prev.slice(-30),
      { id: ++logIdRef.current, type: msg.type, text: msg.text },
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
      {/* Top Application Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleBox}>
          <View style={styles.brandBadge}>
            <Ionicons name="terminal" size={16} color="#10B981" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Offline Code IDE</Text>
            <Text style={styles.headerSubtitle}>HTML5 \u2022 CSS3 \u2022 ES6 JavaScript</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.templateBtn}
            onPress={() => setTemplateModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="albums-outline" size={16} color="#38BDF8" />
            <Text style={styles.templateBtnText}>Template</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={handleReset} activeOpacity={0.8}>
            <Ionicons name="refresh" size={16} color="#F87171" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.runBtn} onPress={handleRun} activeOpacity={0.8}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.runBtnText}>Jalankan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Mode Bar: Visible on phones, or allows toggling split on tablets */}
      <View style={styles.modeBar}>
        <View style={styles.langTabsRow}>
          <TouchableOpacity
            onPress={() => setActiveLang('html')}
            style={[styles.langTab, activeLang === 'html' && styles.langTabActiveHtml]}
          >
            <View style={[styles.langDot, { backgroundColor: '#EA580C' }]} />
            <Text style={[styles.langTabText, activeLang === 'html' && styles.langTabTextActive]}>
              index.html
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveLang('css')}
            style={[styles.langTab, activeLang === 'css' && styles.langTabActiveCss]}
          >
            <View style={[styles.langDot, { backgroundColor: '#0284C7' }]} />
            <Text style={[styles.langTabText, activeLang === 'css' && styles.langTabTextActive]}>
              style.css
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveLang('js')}
            style={[styles.langTab, activeLang === 'js' && styles.langTabActiveJs]}
          >
            <View style={[styles.langDot, { backgroundColor: '#16A34A' }]} />
            <Text style={[styles.langTabText, activeLang === 'js' && styles.langTabTextActive]}>
              script.js
            </Text>
          </TouchableOpacity>
        </View>

        {/* View Mode Toggle */}
        <View style={styles.viewModeToggle}>
          {!isLargeScreen ? (
            <>
              <TouchableOpacity
                onPress={() => setViewMode('editor')}
                style={[styles.toggleBtn, viewMode === 'editor' && styles.toggleBtnActive]}
              >
                <Ionicons name="code" size={14} color={viewMode === 'editor' ? '#FFFFFF' : '#94A3B8'} />
                <Text style={[styles.toggleBtnText, viewMode === 'editor' && styles.toggleBtnTextActive]}>
                  Editor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('preview')}
                style={[styles.toggleBtn, viewMode === 'preview' && styles.toggleBtnActive]}
              >
                <Ionicons name="eye" size={14} color={viewMode === 'preview' ? '#FFFFFF' : '#94A3B8'} />
                <Text style={[styles.toggleBtnText, viewMode === 'preview' && styles.toggleBtnTextActive]}>
                  Preview
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'split' ? 'editor' : 'split')}
              style={[styles.toggleBtn, viewMode === 'split' && styles.toggleBtnActive]}
            >
              <Ionicons name="browsers-outline" size={14} color={viewMode === 'split' ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.toggleBtnText, viewMode === 'split' && styles.toggleBtnTextActive]}>
                {viewMode === 'split' ? 'Split View (2 Kolom)' : 'Editor Penuh'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Workspace Body Area */}
      <KeyboardAvoidingView
        style={styles.workspace}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {viewMode === 'split' ? (
          /* Side-by-side split view on tablet/desktop */
          <View style={styles.splitLayout}>
            {/* Left: Code Editor */}
            <View style={styles.splitColumn}>
              <ProCodeEditor
                code={activeCode}
                onChangeCode={setActiveCode}
                language={activeLang}
              />
            </View>

            {/* Right: Live Preview & Console */}
            <View style={styles.splitColumn}>
              <View style={styles.previewPanel}>
                <View style={styles.panelHeader}>
                  <Ionicons name="globe-outline" size={14} color="#38BDF8" />
                  <Text style={styles.panelTitle}>Live Browser Output</Text>
                </View>
                <View style={styles.previewBox}>
                  <LocalCodeRunner
                    htmlCode={runnerHtml}
                    cssCode={runnerCss}
                    jsCode={runnerJs}
                    onConsoleMessage={handleConsoleMsg}
                  />
                </View>
              </View>

              {/* Console Panel */}
              <View style={styles.consolePanel}>
                <View style={styles.panelHeader}>
                  <Ionicons name="terminal-outline" size={14} color="#94A3B8" />
                  <Text style={styles.panelTitle}>Console Output</Text>
                  <TouchableOpacity onPress={() => setConsoleLogs([])} style={{ marginLeft: 'auto' }}>
                    <Text style={styles.clearLogsText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.consoleScroll}>
                  {consoleLogs.map((log) => (
                    <Text
                      key={log.id}
                      style={[
                        styles.logText,
                        log.type === 'error' && styles.logError,
                        log.type === 'warn' && styles.logWarn,
                      ]}
                    >
                      {log.type === 'error' ? '\u2718 ' : '> '}
                      {log.text}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ) : viewMode === 'editor' ? (
          /* Editor Full View */
          <View style={styles.fullEditorContainer}>
            <ProCodeEditor
              code={activeCode}
              onChangeCode={setActiveCode}
              language={activeLang}
            />
          </View>
        ) : (
          /* Preview Full View */
          <View style={styles.fullPreviewContainer}>
            <View style={styles.previewBox}>
              <LocalCodeRunner
                htmlCode={runnerHtml}
                cssCode={runnerCss}
                jsCode={runnerJs}
                onConsoleMessage={handleConsoleMsg}
              />
            </View>

            {/* Bottom Console Panel on Mobile */}
            <View style={styles.mobileConsolePanel}>
              <View style={styles.panelHeader}>
                <Ionicons name="terminal" size={14} color="#94A3B8" />
                <Text style={styles.panelTitle}>Console & Log</Text>
                <TouchableOpacity onPress={() => setConsoleLogs([])} style={{ marginLeft: 'auto' }}>
                  <Text style={styles.clearLogsText}>Bersihkan</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.consoleScroll}>
                {consoleLogs.map((log) => (
                  <Text
                    key={log.id}
                    style={[
                      styles.logText,
                      log.type === 'error' && styles.logError,
                      log.type === 'warn' && styles.logWarn,
                    ]}
                  >
                    {log.type === 'error' ? '\u2718 ' : '> '}
                    {log.text}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Template Modal */}
      <Modal
        visible={templateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTemplateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: Math.min(width - 32, 500) }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="albums" size={20} color="#38BDF8" />
                <Text style={styles.modalTitle}>Koleksi Template Kode</Text>
              </View>
              <TouchableOpacity onPress={() => setTemplateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              {PLAYGROUND_TEMPLATES.map((tpl) => (
                <TouchableOpacity
                  key={tpl.id}
                  onPress={() => handleSelectTemplate(tpl)}
                  style={styles.templateItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.templateItemHeader}>
                    <Text style={styles.templateItemTitle}>{tpl.name}</Text>
                    <View style={styles.templateItemBadge}>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  templateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  iconBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  runBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  runBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D131F',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 10,
  },
  langTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  langTabActiveHtml: {
    borderBottomColor: '#EA580C',
    backgroundColor: '#1E1B18',
  },
  langTabActiveCss: {
    borderBottomColor: '#0284C7',
    backgroundColor: '#121E2C',
  },
  langTabActiveJs: {
    borderBottomColor: '#16A34A',
    backgroundColor: '#13211B',
  },
  langDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  langTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  langTabTextActive: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 2,
    borderRadius: 8,
    gap: 2,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: '#0284C7',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  workspace: {
    flex: 1,
    padding: 8,
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
  fullEditorContainer: {
    flex: 1,
  },
  fullPreviewContainer: {
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
  previewBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 6,
  },
  consolePanel: {
    flex: 2,
    backgroundColor: '#090D15',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  mobileConsolePanel: {
    height: 160,
    backgroundColor: '#090D15',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    gap: 6,
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 0.3,
  },
  clearLogsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  consoleScroll: {
    flex: 1,
    padding: 10,
  },
  logText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 17,
  },
  logError: {
    color: '#F87171',
    fontWeight: '700',
  },
  logWarn: {
    color: '#FBBF24',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  templateItem: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  templateItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  templateItemBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  templateItemBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  templateItemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
