import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton';

interface FeedbackBannerProps {
  isCorrect: boolean;
  correctAnswerText: string;
  explanation: string;
  onNext: () => void;
  isLastQuestion?: boolean;
  buttonTitle?: string;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  correctAnswerText,
  explanation,
  onNext,
  isLastQuestion = false,
  buttonTitle,
}) => {
  const bg = isCorrect ? '#D1FAE5' : '#FEE2E2';
  const textColor = isCorrect ? '#065F46' : '#991B1B';
  const iconName = isCorrect ? 'checkmark-circle' : 'close-circle';
  const iconColor = isCorrect ? '#10B981' : '#EF4444';
  const title = isCorrect ? 'Luar Biasa! Benar!' : 'Kurang Tepat!';

  const resolvedButtonTitle =
    buttonTitle ||
    (!isCorrect
      ? 'Coba Lagi'
      : isLastQuestion
      ? 'Lihat Hasil Akhir →'
      : 'Lanjutkan →');

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.contentRow}>
        <Ionicons name={iconName} size={36} color={iconColor} />
        <View style={styles.textColumn}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {!isCorrect && (
            <Text style={styles.correctAnswerLabel}>
              Jawaban Benar: <Text style={styles.correctAnswerVal}>{correctAnswerText}</Text>
            </Text>
          )}
          <Text style={[styles.explanation, { color: textColor }]}>{explanation}</Text>
        </View>
      </View>

      <GameButton
        title={resolvedButtonTitle}
        variant={isCorrect ? 'primary' : 'danger'}
        size="lg"
        onPress={onNext}
        style={styles.btn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  correctAnswerLabel: {
    fontSize: 13,
    color: '#7F1D1D',
    fontWeight: '600',
    marginBottom: 4,
  },
  correctAnswerVal: {
    fontWeight: '800',
    color: '#991B1B',
  },
  explanation: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  btn: {
    width: '100%',
  },
});
