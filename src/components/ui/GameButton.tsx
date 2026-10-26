import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getColors = () => {
    if (disabled) {
      return {
        bg: '#E2E8F0',
        border: '#CBD5E1',
        text: '#94A3B8',
      };
    }
    switch (variant) {
      case 'secondary':
        return {
          bg: '#0284C7',
          border: '#0369A1',
          text: '#FFFFFF',
        };
      case 'accent':
        return {
          bg: '#F59E0B',
          border: '#D97706',
          text: '#FFFFFF',
        };
      case 'danger':
        return {
          bg: '#EF4444',
          border: '#DC2626',
          text: '#FFFFFF',
        };
      case 'purple':
        return {
          bg: '#7C3AED',
          border: '#6D28D9',
          text: '#FFFFFF',
        };
      case 'outline':
        return {
          bg: '#FFFFFF',
          border: '#CBD5E1',
          text: '#0F172A',
        };
      case 'primary':
      default:
        return {
          bg: '#10B981',
          border: '#059669',
          text: '#FFFFFF',
        };
    }
  };

  const colors = getColors();

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13, borderBottomWidth: 3 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 17, borderBottomWidth: 5 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 20, fontSize: 15, borderBottomWidth: 4 };
    }
  };

  const sizing = getPadding();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: colors.bg,
          borderBottomColor: colors.border,
          borderBottomWidth: sizing.borderBottomWidth,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              {
                color: colors.text,
                fontSize: sizing.fontSize,
                marginLeft: icon ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
