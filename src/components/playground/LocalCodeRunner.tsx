import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LocalCodeRunnerProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  onConsoleMessage?: (msg: { type: 'log' | 'error' | 'warn'; text: string }) => void;
}

export const LocalCodeRunner: React.FC<LocalCodeRunnerProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  onConsoleMessage,
}) => {
  const bundledHtml = useMemo(() => {
    // Sanitize script closing tags inside user js code to prevent breaking the wrapper
    const safeJs = jsCode.replace(/<\/script>/gi, '<\\/script>');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      word-wrap: break-word;
    }
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    (function() {
      function send(type, text) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, text: text }));
        }
      }

      window.onerror = function(msg, url, lineNo) {
        send('error', 'Runtime Error: ' + msg + (lineNo ? ' (baris: ' + lineNo + ')' : ''));
        return true;
      };

      var origLog = console.log;
      console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        var formatted = args.map(function(item) {
          try {
            return typeof item === 'object' ? JSON.stringify(item) : String(item);
          } catch(e) {
            return String(item);
          }
        }).join(' ');
        origLog.apply(console, arguments);
        send('log', formatted);
      };

      var origErr = console.error;
      console.error = function() {
        var args = Array.prototype.slice.call(arguments);
        origErr.apply(console, arguments);
        send('error', args.join(' '));
      };

      try {
        ${safeJs}
      } catch (err) {
        send('error', (err.name || 'Error') + ': ' + (err.message || String(err)));
      }
    })();
  <\/script>
</body>
</html>`;
  }, [htmlCode, cssCode, jsCode]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: bundledHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={false}
        allowUniversalAccessFromFileURLs={false}
        allowFileAccessFromFileURLs={false}
        scalesPageToFit={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (onConsoleMessage && data.type && data.text) {
              onConsoleMessage(data);
            }
          } catch {
            // Ignore non-json messages
          }
        }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
