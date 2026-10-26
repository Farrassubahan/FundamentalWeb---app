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

interface QuitConfirmModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuitConfirmModal: React.FC<QuitConfirmModalProps> = ({
  visible,
  title = 'Keluar dari Sesi Kuis?',
  description = 'Jangan menyerah dulu! Progres latihan pada sesi ini tidak akan disimpan jika kamu keluar sekarang.',
  confirmText = 'Keluar Sekarang',
  cancelText = 'Tetap Lanjut Belajar 🚀',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Warning Icon Badge */}
          <View style={styles.iconCircle}>
            <Ionicons name="sad-outline" size={48} color="#F59E0B" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Action Buttons */}
          <View style={styles.btnStack}>
            {/* Primary Action: Keep learning */}
            <GameButton
              title={cancelText}
              variant="primary"
              size="lg"
              onPress={onCancel}
              style={styles.fullWidth}
            />

            {/* Secondary Action: Confirm exit */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onConfirm}
              style={styles.exitBtn}
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.exitBtnText}>{confirmText}</Text>
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
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FDE68A',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  btnStack: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  exitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
});
