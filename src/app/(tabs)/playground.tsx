import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalCodeRunner } from '@/components/playground/LocalCodeRunner';
import { PLAYGROUND_TEMPLATES, PlaygroundTemplate } from '@/data/playgroundTemplates';

type ActiveTab = 'html' | 'css' | 'js';
type ViewMode = 'editor' | 'preview' | 'split';

interface ConsoleLog {
  id: number;
  type: 'log' | 'error' | 'warn';
  text: string;
}

export default function PlaygroundScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('html');
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
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
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { id: 1, type: 'log', text: 'Playground siap. Tekan "Jalankan" untuk mengeksekusi.' },
  ]);

  const logIdRef = React.useRef(10);

  const handleRun = () => {
    setRunnerHtml(htmlCode);
    setRunnerCss(cssCode);
    setRunnerJs(jsCode);
    setConsoleLogs((prev) => [
      ...prev,
      { id: ++logIdRef.current, type: 'log', text: '--- Eksekusi Kode Dijalankan ---' },
    ]);
    setViewMode('preview');
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
      ...prev.slice(-30), // keep last 30 logs
      { id: ++logIdRef.current, type: msg.type, text: msg.text },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Playground Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
          <Ionicons name="code-slash" size={20} color="#10B981" />
          <Text style={styles.headerTitle}>Offline Playground</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.templateBtn}
            onPress={() => setTemplateModalVisible(true)}
          >
            <Ionicons name="albums-outline" size={16} color="#0284C7" />
            <Text style={styles.templateBtnText}>Template</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={16} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.runBtn} onPress={handleRun}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.runBtnText}>Jalankan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode View Switcher: Editor vs Hasil Preview */}
      <View style={styles.viewModeBar}>
        <TouchableOpacity
          onPress={() => setViewMode('editor')}
          style={[styles.viewModeItem, viewMode === 'editor' && styles.viewModeItemActive]}
        >
          <Ionicons
            name="create-outline"
            size={16}
            color={viewMode === 'editor' ? '#10B981' : '#64748B'}
          />
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'editor' && styles.viewModeTextActive,
            ]}
          >
            Editor Kode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode('preview')}
          style={[styles.viewModeItem, viewMode === 'preview' && styles.viewModeItemActive]}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={16}
            color={viewMode === 'preview' ? '#10B981' : '#64748B'}
          />
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'preview' && styles.viewModeTextActive,
            ]}
          >
            Hasil Visual (Live)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Editor Content Area */}
      {viewMode === 'editor' ? (
        <KeyboardAvoidingView
          style={styles.flexArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Editor Language Sub-tabs */}
          <View style={styles.subTabBar}>
            <TouchableOpacity
              onPress={() => setActiveTab('html')}
              style={[styles.subTab, activeTab === 'html' && styles.subTabActiveHtml]}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeTab === 'html' && { color: '#EA580C', fontWeight: '800' },
                ]}
              >
                index.html
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('css')}
              style={[styles.subTab, activeTab === 'css' && styles.subTabActiveCss]}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeTab === 'css' && { color: '#0284C7', fontWeight: '800' },
                ]}
              >
                style.css
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('js')}
              style={[styles.subTab, activeTab === 'js' && styles.subTabActiveJs]}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeTab === 'js' && { color: '#16A34A', fontWeight: '800' },
                ]}
              >
                script.js
              </Text>
            </TouchableOpacity>
          </View>

          {/* Text Input Editor */}
          <View style={styles.editorBox}>
            <TextInput
              style={styles.editorInput}
              multiline={true}
              value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
              onChangeText={(text) => {
                if (activeTab === 'html') setHtmlCode(text);
                else if (activeTab === 'css') setCssCode(text);
                else setJsCode(text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              placeholder={`Tulis kode ${activeTab.toUpperCase()} di sini...`}
              placeholderTextColor="#64748B"
            />
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* Preview & Console Area */
        <View style={styles.flexArea}>
          <View style={styles.runnerBox}>
            <LocalCodeRunner
              htmlCode={runnerHtml}
              cssCode={runnerCss}
              jsCode={runnerJs}
              onConsoleMessage={handleConsoleMsg}
            />
          </View>

          {/* Console / Error Panel */}
          <View style={styles.consoleBox}>
            <View style={styles.consoleHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="terminal" size={14} color="#64748B" />
                <Text style={styles.consoleTitle}>Console Output & Error</Text>
              </View>
              <TouchableOpacity onPress={() => setConsoleLogs([])}>
                <Text style={styles.clearLogsText}>Bersihkan</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.consoleLogsScroll}>
              {consoleLogs.map((log) => (
                <Text
                  key={log.id}
                  style={[
                    styles.logText,
                    log.type === 'error' && styles.logError,
                    log.type === 'warn' && styles.logWarn,
                  ]}
                >
                  {log.type === 'error' ? '\u274c ' : '> '}
                  {log.text}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Template Selector Modal */}
      <Modal
        visible={templateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTemplateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Template Eksperimen</Text>
              <TouchableOpacity onPress={() => setTemplateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {PLAYGROUND_TEMPLATES.map((tpl) => (
                <TouchableOpacity
                  key={tpl.id}
                  onPress={() => handleSelectTemplate(tpl)}
                  style={styles.templateOption}
                >
                  <View style={styles.templateOptionTop}>
                    <Text style={styles.templateOptionName}>{tpl.name}</Text>
                    <View style={styles.templateCatBadge}>
                      <Text style={styles.templateCatText}>{tpl.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.templateOptionDesc}>{tpl.description}</Text>
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
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
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
  resetBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  runBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  runBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewModeBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  viewModeItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  viewModeItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  viewModeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  viewModeTextActive: {
    color: '#10B981',
    fontWeight: '800',
  },
  flexArea: {
    flex: 1,
  },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 8,
  },
  subTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabActiveHtml: {
    borderBottomColor: '#EA580C',
  },
  subTabActiveCss: {
    borderBottomColor: '#0284C7',
  },
  subTabActiveJs: {
    borderBottomColor: '#16A34A',
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  editorBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#090D16',
  },
  editorInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  runnerBox: {
    flex: 2,
    padding: 10,
    backgroundColor: '#0F172A',
  },
  consoleBox: {
    flex: 1,
    backgroundColor: '#090D16',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    padding: 10,
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consoleTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  clearLogsText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  consoleLogsScroll: {
    flex: 1,
  },
  logText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  templateOption: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateOptionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  templateOptionName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  templateCatBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  templateCatText: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '700',
  },
  templateOptionDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
