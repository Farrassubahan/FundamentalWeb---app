import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

interface ProCodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  language: 'html' | 'css' | 'js';
  placeholder?: string;
}

// Quick insertion symbols grouped by language
const SYMBOLS_BY_LANG: Record<'html' | 'css' | 'js', string[]> = {
  html: [
    '<div>',
    '</div>',
    '<h1>',
    '</h1>',
    '<p>',
    '</p>',
    '<button>',
    '</button>',
    '<span>',
    '</span>',
    'class=""',
    'id=""',
    'style=""',
    'src=""',
    'href=""',
    '<',
    '>',
    '</',
    '/>',
    '="',
    '"',
  ],
  css: [
    '{',
    '}',
    ':',
    ';',
    '.',
    '#',
    'px',
    '%',
    'rem',
    'color:',
    'background:',
    'display: flex;',
    'padding:',
    'margin:',
    'border-radius:',
    'font-size:',
    'width:',
    'height:',
  ],
  js: [
    '()',
    '{}',
    '[]',
    '=>',
    '===',
    '!==',
    ';',
    'const ',
    'let ',
    'console.log(',
    'document.getElementById("',
    'addEventListener("click", () => {',
    'function',
    'if ()',
    'return',
  ],
};

export const ProCodeEditor: React.FC<ProCodeEditorProps> = ({
  code,
  onChangeCode,
  language,
  placeholder,
}) => {
  const [fontSize, setFontSize] = useState(13);

  // Calculate line numbers
  const linesCount = useMemo(() => {
    return Math.max(1, code.split('\n').length);
  }, [code]);

  const lineNumbersString = useMemo(() => {
    return Array.from({ length: linesCount }, (_, i) => i + 1).join('\n');
  }, [linesCount]);

  const handleInsertSymbol = (symbol: string) => {
    onChangeCode(code + symbol);
  };

  const handleTabIndent = () => {
    onChangeCode(code + '  '); // 2 spaces indent
  };

  const changeFontSize = (delta: number) => {
    setFontSize((prev) => Math.min(20, Math.max(11, prev + delta)));
  };

  const symbols = SYMBOLS_BY_LANG[language] || SYMBOLS_BY_LANG.html;

  const langBadgeColor =
    language === 'html' ? '#EA580C' : language === 'css' ? '#0284C7' : '#16A34A';

  return (
    <View style={styles.container}>
      {/* Editor Control Bar: File stats, Zoom font, Indent tab */}
      <View style={styles.topControlBar}>
        <View style={styles.statsRow}>
          <View style={[styles.fileLangDot, { backgroundColor: langBadgeColor }]} />
          <Text style={styles.statsText} numberOfLines={1}>
            {language.toUpperCase()} • {linesCount} Baris
          </Text>
        </View>

        <View style={styles.controlsCluster}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleTabIndent}
            activeOpacity={0.7}
          >
            <Text style={styles.controlBtnText}>Tab ⇥</Text>
          </TouchableOpacity>

          <View style={styles.zoomCluster}>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => changeFontSize(-1)}
              disabled={fontSize <= 11}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 4 }}
            >
              <Text style={[styles.zoomBtnText, fontSize <= 11 && styles.btnDisabled]}>A-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeText}>{fontSize}px</Text>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => changeFontSize(1)}
              disabled={fontSize >= 20}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 6 }}
            >
              <Text style={[styles.zoomBtnText, fontSize >= 20 && styles.btnDisabled]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Insert Symbols Bar */}
      <View style={styles.symbolsBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.symbolsScroll}
          keyboardShouldPersistTaps="always"
        >
          {symbols.map((sym, idx) => (
            <TouchableOpacity
              key={`${language}-${idx}-${sym}`}
              onPress={() => handleInsertSymbol(sym)}
              style={styles.symbolChip}
              activeOpacity={0.65}
            >
              <Text style={styles.symbolChipText}>{sym}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Editor Main Canvas: Gutter + Input */}
      <View style={styles.canvasWrapper}>
        <ScrollView
          style={styles.editorScrollView}
          contentContainerStyle={styles.editorScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.editorInnerRow}>
            {/* Line Numbers Gutter */}
            <View style={styles.gutter}>
              <Text style={[styles.gutterText, { fontSize, lineHeight: fontSize * 1.55 }]}>
                {lineNumbersString}
              </Text>
            </View>

            {/* Code Input */}
            <TextInput
              style={[
                styles.input,
                {
                  fontSize,
                  lineHeight: fontSize * 1.55,
                },
              ]}
              multiline={true}
              value={code}
              onChangeText={onChangeCode}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              placeholder={placeholder || 'Ketik kode di sini...'}
              placeholderTextColor="#475569"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  topControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileLangDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  controlsCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  controlBtn: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  controlBtnText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '700',
  },
  zoomCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  zoomBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  zoomBtnText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  fontSizeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  symbolsBar: {
    backgroundColor: '#151D2C',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    paddingVertical: 6,
  },
  symbolsScroll: {
    paddingHorizontal: 10,
    gap: 6,
  },
  symbolChip: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  symbolChipText: {
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  canvasWrapper: {
    flex: 1,
  },
  editorScrollView: {
    flex: 1,
  },
  editorScrollContent: {
    flexGrow: 1,
  },
  editorInnerRow: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  gutter: {
    width: 42,
    backgroundColor: '#090D15',
    paddingVertical: 12,
    paddingRight: 8,
    alignItems: 'flex-end',
    borderRightWidth: 1,
    borderRightColor: '#1E293B',
  },
  gutterText: {
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
  },
  input: {
    flex: 1,
    backgroundColor: '#0B0F19',
    color: '#F8FAFC',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
});
