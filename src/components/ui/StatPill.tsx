import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatPillProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  color: string;
  bgColor: string;
  onPress?: () => void;
  label?: string;
}

export const StatPill: React.FC<StatPillProps> = ({
  icon,
  value,
  color,
  bgColor,
  onPress,
  label,
}) => {
  const content = (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      {label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 5,
  },
  value: {
    fontWeight: '800',
    fontSize: 13,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.8,
  },
});
