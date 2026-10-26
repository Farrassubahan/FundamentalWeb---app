import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton';
import { Question } from '@/types';
import { getRandomRefillChallenge } from '@/data/curriculum/refillChallenges';
import { refillHearts } from '@/database/repository';

interface RefillChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RefillChallengeContent: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [question, setQuestion] = useState<Question>(() => getRandomRefillChallenge());
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (val: any) => {
    if (hasSubmitted) return;
    setSelectedAnswer(val);
  };

  const handleCheck = () => {
    if (selectedAnswer === null || selectedAnswer === undefined) {
      Alert.alert('Pilih Jawaban', 'Silakan pilih jawabanmu terlebih dahulu!');
      return;
    }

    let correct = false;
    if (question.type === 'true_false') {
      correct = selectedAnswer === question.correctAnswer;
    } else {
      correct =
        String(selectedAnswer).trim().toLowerCase() ===
        String(question.correctAnswer).trim().toLowerCase();
    }

    setIsCorrect(correct);
    setHasSubmitted(true);
  };

  const handleRetryWithNewChallenge = () => {
    setQuestion(getRandomRefillChallenge(question.id));
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  };

  const handleChangeQuestion = () => {
    setQuestion(getRandomRefillChallenge(question.id));
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  };

  const handleClaimHearts = async () => {
    try {
      await refillHearts();
      onSuccess();
    } catch {
      Alert.alert('Gagal Mengisi Nyawa', 'Terjadi kesalahan saat memulihkan nyawa.');
    }
  };

  const handleCloseAttempt = () => {
    Alert.alert(
      'Batalkan Latihan?',
      'Jika kamu membatalkan latihan sekarang, nyawamu belum terisi dan kamu akan kembali ke menu.',
      [
        { text: 'Lanjut Latihan', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: onClose,
        },
      ]
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCloseAttempt}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Latihan Pemulihan</Text>
          </View>

          <View style={styles.heartRewardBadge}>
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text style={styles.heartRewardText}>+5 ❤️</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle / Drill Mission with Shuffle Option */}
          <View style={styles.missionBanner}>
            <Ionicons name="sparkles" size={18} color="#D97706" />
            <Text style={styles.missionText}>
              Jawab benar tantangan ini untuk mengisi ulang 5 nyawa penuh!
            </Text>
            {!hasSubmitted && (
              <TouchableOpacity
                onPress={handleChangeQuestion}
                style={styles.shufflePill}
                activeOpacity={0.7}
              >
                <Ionicons name="shuffle" size={14} color="#D97706" />
                <Text style={styles.shuffleText}>Acak</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Question Prompt */}
          <Text style={styles.prompt}>{question.prompt}</Text>

          {/* Multiple Choice Options */}
          {question.type === 'multiple_choice' && question.options && (
            <View style={styles.optionsList}>
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    disabled={hasSubmitted}
                    onPress={() => handleSelectOption(opt)}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                      hasSubmitted &&
                        isCorrect &&
                        isSelected &&
                        styles.optionCardCorrect,
                      hasSubmitted &&
                        !isCorrect &&
                        isSelected &&
                        styles.optionCardWrong,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* True / False Options */}
          {question.type === 'true_false' && (
            <View style={styles.tfRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={hasSubmitted}
                onPress={() => handleSelectOption(true)}
                style={[
                  styles.tfCard,
                  selectedAnswer === true && styles.tfCardSelectedTrue,
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={36}
                  color={selectedAnswer === true ? '#10B981' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.tfText,
                    selectedAnswer === true && { color: '#065F46', fontWeight: '900' },
                  ]}
                >
                  BENAR
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={hasSubmitted}
                onPress={() => handleSelectOption(false)}
                style={[
                  styles.tfCard,
                  selectedAnswer === false && styles.tfCardSelectedFalse,
                ]}
              >
                <Ionicons
                  name="close-circle"
                  size={36}
                  color={selectedAnswer === false ? '#EF4444' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.tfText,
                    selectedAnswer === false && { color: '#991B1B', fontWeight: '900' },
                  ]}
                >
                  SALAH
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Feedback Banners when submitted */}
          {hasSubmitted && isCorrect && (
            <View style={styles.successBanner}>
              <View style={styles.bannerRow}>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.successBannerTitle}>Luar Biasa! Benar!</Text>
                  <Text style={styles.successBannerSub}>{question.explanation}</Text>
                </View>
              </View>
            </View>
          )}

          {hasSubmitted && !isCorrect && (
            <View style={styles.wrongBanner}>
              <View style={styles.bannerRow}>
                <Ionicons name="close-circle" size={32} color="#EF4444" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.wrongBannerTitle}>Kurang Tepat!</Text>
                  <Text style={styles.wrongAnswerLabel}>
                    Jawaban Benar:{' '}
                    <Text style={styles.wrongAnswerVal}>
                      {String(question.correctAnswer)}
                    </Text>
                  </Text>
                  <Text style={styles.wrongBannerSub}>{question.explanation}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          {!hasSubmitted ? (
            <GameButton
              title="Periksa Jawaban"
              variant="primary"
              size="lg"
              disabled={selectedAnswer === null || selectedAnswer === undefined}
              onPress={handleCheck}
              style={{ width: '100%' }}
            />
          ) : isCorrect ? (
            <GameButton
              title="⚡ Klaim +5 ❤️ & Lanjut Quiz"
              variant="primary"
              size="lg"
              onPress={handleClaimHearts}
              style={{ width: '100%' }}
            />
          ) : (
            <View style={styles.wrongActionsRow}>
              <GameButton
                title="Coba Tantangan Baru 🔄"
                variant="danger"
                size="lg"
                onPress={handleRetryWithNewChallenge}
                style={{ width: '100%' }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export const RefillChallengeModal: React.FC<RefillChallengeModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <RefillChallengeContent onClose={onClose} onSuccess={onSuccess} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  heartRewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  heartRewardText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  scroll: {
    maxHeight: 460,
  },
  scrollContent: {
    padding: 20,
  },
  missionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 16,
  },
  missionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
  },
  shufflePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  shuffleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  prompt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 18,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    gap: 12,
  },
  optionCardSelected: {
    borderColor: '#3B82F6',
    borderBottomColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionCardCorrect: {
    borderColor: '#10B981',
    borderBottomColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  optionCardWrong: {
    borderColor: '#EF4444',
    borderBottomColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#3B82F6',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  optionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  tfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    gap: 8,
  },
  tfCardSelectedTrue: {
    borderColor: '#10B981',
    borderBottomColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  tfCardSelectedFalse: {
    borderColor: '#EF4444',
    borderBottomColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  tfText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  successBannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
    marginBottom: 4,
  },
  successBannerSub: {
    fontSize: 12,
    lineHeight: 18,
    color: '#065F46',
  },
  wrongBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },
  wrongBannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#991B1B',
    marginBottom: 4,
  },
  wrongAnswerLabel: {
    fontSize: 12,
    color: '#7F1D1D',
    fontWeight: '600',
    marginBottom: 4,
  },
  wrongAnswerVal: {
    fontWeight: '800',
    color: '#991B1B',
  },
  wrongBannerSub: {
    fontSize: 12,
    lineHeight: 18,
    color: '#991B1B',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  wrongActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
