import React from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton';
import { Badge } from '@/types';

interface CelebrationModalProps {
  visible: boolean;
  type: 'level_up' | 'badge_unlocked' | 'lesson_complete';
  badge?: Badge;
  newLevel?: number;
  xpEarned?: number;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  type,
  badge,
  newLevel,
  xpEarned,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {type === 'level_up' ? (
            <>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="trophy" size={54} color="#F59E0B" />
              </View>
              <Text style={styles.subtitle}>SELAMAT! NAIK LEVEL!</Text>
              <Text style={styles.mainTitle}>Level {Math.max(1, Math.round(Number(newLevel) || 1))}</Text>
              <Text style={styles.desc}>
                Kerja kerasmu membuahkan hasil! Kamu semakin dekat menjadi Master Web Developer.
              </Text>
            </>
          ) : type === 'badge_unlocked' && badge ? (
            <>
              <View style={[styles.iconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons
                  name={(badge.icon as keyof typeof Ionicons.glyphMap) || 'ribbon'}
                  size={54}
                  color="#7C3AED"
                />
              </View>
              <Text style={styles.subtitle}>LENCANA BARU DIBUKA!</Text>
              <Text style={styles.mainTitle}>{badge.title}</Text>
              <Text style={styles.desc}>{badge.description}</Text>
            </>
          ) : (
            <>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="sparkles" size={54} color="#10B981" />
              </View>
              <Text style={styles.subtitle}>MATERI SELESAI!</Text>
              <Text style={styles.mainTitle}>+{Math.max(0, Math.round(Number(xpEarned) || 30))} XP</Text>
              <Text style={styles.desc}>
                Hebat! Satu langkah maju dalam petualangan belajarmu hari ini.
              </Text>
            </>
          )}

          <GameButton
            title="Lanjutkan Belajar →"
            variant="primary"
            size="lg"
            onPress={onClose}
            style={styles.btn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1,
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  btn: {
    width: '100%',
  },
});
