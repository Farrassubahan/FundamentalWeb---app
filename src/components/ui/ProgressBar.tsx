import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  bgColor?: string;
  height?: number;
  showText?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#10B981',
  bgColor = '#E2E8F0',
  height = 12,
  showText = false,
  style,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.track, { backgroundColor: bgColor, height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        >
          {/* Gloss highlight */}
          <View style={styles.gloss} />
        </View>
      </View>
      {showText && (
        <Text style={styles.percentText}>{clamped}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    minWidth: 35,
    textAlign: 'right',
  },
});
