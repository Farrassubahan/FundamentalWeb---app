import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton';

interface OutOfHeartsModalProps {
  visible: boolean;
  onStartRefill: () => void;
  onQuit: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  visible,
  onStartRefill,
  onQuit,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Heart Broken Icon Badge */}
          <View style={styles.iconCircle}>
            <Ionicons name="heart-dislike" size={54} color="#EF4444" />
            <View style={styles.zeroBadge}>
              <Text style={styles.zeroBadgeText}>0 ❤️</Text>
            </View>
          </View>

          <Text style={styles.title}>Kehabisan Nyawa!</Text>
          <Text style={styles.description}>
            Kamu kehilangan semua nyawa karena salah menjawab beberapa kali.
            Tapi tenang, kamu bisa mengisi ulang nyawamu sekarang!
          </Text>

          {/* Reward Feature Highlight */}
          <View style={styles.highlightBox}>
            <View style={styles.highlightItem}>
              <Ionicons name="flash" size={20} color="#F59E0B" />
              <Text style={styles.highlightText}>
                Selesaikan 1 tantangan kilat web dasar
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Ionicons name="heart" size={20} color="#EF4444" />
              <Text style={styles.highlightText}>
                Nyawa terisi penuh kembali (+5 ❤️)
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Ionicons name="arrow-redo-circle" size={20} color="#10B981" />
              <Text style={styles.highlightText}>
                Lanjutkan soal kuis ini tanpa reset progres
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <GameButton
              title="⚡ Tantangan Isi Nyawa (+5 ❤️)"
              variant="primary"
              size="lg"
              onPress={onStartRefill}
              style={styles.primaryBtn}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onQuit}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryBtnText}>Kembali ke Roadmap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 4,
    borderColor: '#FECACA',
  },
  zeroBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  zeroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  highlightBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  actionContainer: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
