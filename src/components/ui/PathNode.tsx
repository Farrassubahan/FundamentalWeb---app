import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LessonStatus } from '@/types';

interface PathNodeProps {
  order: number;
  title: string;
  status: LessonStatus;
  color: string;
  shadowColor: string;
  onPress: () => void;
  offsetHorizontal?: number; // S-curve zigzag offset: e.g. -40, 0, 40
}

export const PathNode: React.FC<PathNodeProps> = ({
  order,
  title,
  status,
  color,
  shadowColor,
  onPress,
  offsetHorizontal = 0,
}) => {
  const isCompleted = status === 'completed';
  const isUnlocked = status === 'unlocked';
  const isLocked = status === 'locked';

  const getNodeStyles = () => {
    if (isCompleted) {
      return {
        bg: color,
        borderBottom: shadowColor,
        iconColor: '#FFFFFF',
      };
    }
    if (isUnlocked) {
      return {
        bg: color,
        borderBottom: shadowColor,
        iconColor: '#FFFFFF',
      };
    }
    return {
      bg: '#E2E8F0',
      borderBottom: '#CBD5E1',
      iconColor: '#94A3B8',
    };
  };

  const styleConfig = getNodeStyles();

  return (
    <View style={[styles.wrapper, { transform: [{ translateX: offsetHorizontal }] }]}>
      {/* Crown or Active Floating Callout */}
      {isUnlocked && (
        <View style={[styles.activeBubble, { backgroundColor: color }]}>
          <Text style={styles.activeBubbleText}>MULAI</Text>
          <View style={[styles.bubbleArrow, { borderTopColor: color }]} />
        </View>
      )}

      {/* Tactile Circle Node */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={isLocked}
        style={[
          styles.circle,
          {
            backgroundColor: styleConfig.bg,
            borderBottomColor: styleConfig.borderBottom,
          },
          isUnlocked && styles.unlockedGlow,
        ]}
      >
        {isCompleted ? (
          <Ionicons name="checkmark-sharp" size={32} color="#FFFFFF" />
        ) : isUnlocked ? (
          <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 3 }} />
        ) : (
          <Ionicons name="lock-closed" size={26} color="#94A3B8" />
        )}
      </TouchableOpacity>

      {/* Lesson Title Caption */}
      <Text
        style={[
          styles.titleText,
          isLocked && styles.titleLocked,
          isUnlocked && styles.titleActive,
        ]}
        numberOfLines={2}
      >
        {order}. {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 14,
    width: 140,
    alignSelf: 'center',
  },
  activeBubble: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    position: 'relative',
    alignItems: 'center',
  },
  activeBubbleText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderBottomWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  unlockedGlow: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  titleText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 16,
  },
  titleLocked: {
    color: '#94A3B8',
  },
  titleActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
});
