import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getUserProfile,
  saveUserProfile,
  resetAllProgress,
} from '@/database/repository';
import { UserProfile } from '@/types';
import { GameButton } from '@/components/ui/GameButton';
import { useResponsive } from '@/hooks/useResponsive';

export default function SettingsScreen() {
  const { contentMaxWidth } = useResponsive();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('15');
  const [saving, setSaving] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const uProfile = await getUserProfile();
      if (uProfile) {
        setProfile(uProfile);
        setName(uProfile.name);
        setGoal(String(uProfile.goalMinutes));
      }
    } catch (e) {
      console.warn('Error loading settings:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Nama pengguna tidak boleh kosong!');
      return;
    }

    setSaving(true);
    try {
      const updated = await saveUserProfile(
        name.trim(),
        profile?.avatar || 'dev_1',
        parseInt(goal, 10) || 15
      );
      setProfile(updated);
      Alert.alert('Sukses', 'Profil berhasil diperbarui!');
    } catch {
      Alert.alert('Error', 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    try {
      await resetAllProgress();
      setResetModalVisible(false);
      Alert.alert('Reset Berhasil', 'Seluruh progres belajar telah di-reset ke awal.', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch {
      Alert.alert('Error', 'Gagal me-reset progres.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="settings" size={20} color="#0F172A" />
          <Text style={styles.headerTitle}>Pengaturan & Akun</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
        {/* Profile Edit Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profil Pengguna</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nama Panggilan</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Target Belajar Harian (Menit)</Text>
            <TextInput
              style={styles.input}
              value={goal}
              onChangeText={setGoal}
              keyboardType="numeric"
              placeholder="15"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <GameButton
            title="Simpan Perubahan"
            variant="primary"
            size="md"
            loading={saving}
            onPress={handleSaveProfile}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Offline Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Offline & Penyimpanan</Text>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Penyimpanan SQLite Lokal</Text>
              <Text style={styles.infoDesc}>
                Semua progres, XP, streak, dan histori tersimpan persisten di database internal ponsel Anda.
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wifi-outline" size={20} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>100% Bebas Kuota Internet</Text>
              <Text style={styles.infoDesc}>
                Seluruh materi, quiz, dan playground dapat dijalankan tanpa koneksi internet.
              </Text>
            </View>
          </View>
        </View>

        {/* Danger Zone: Reset Progress */}
        <View style={[styles.card, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>Zona Bahaya</Text>
          <Text style={styles.dangerDesc}>
            Mereset seluruh progres akan menghapus status kelulusan lesson, XP, lencana, dan mengunci kembali semua materi ke posisi awal.
          </Text>

          <GameButton
            title="Reset Seluruh Progres Belajar"
            variant="danger"
            size="md"
            onPress={() => setResetModalVisible(true)}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* App Info Footer */}
        <View style={styles.footerBox}>
          <Image
            source={require('@/assets/images/app-logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerName}>BPROTIC Web Academy</Text>
          <Text style={styles.footerVersion}>Versi 1.0.0 (Expo SDK 58)</Text>
          <Text style={styles.footerCopy}>
            &copy; 2026 BPROTIC Educational Labs. Offline-First Mobile Learning.
          </Text>
        </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal for Reset */}
      <Modal
        visible={resetModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.warningCircle}>
              <Ionicons name="warning" size={40} color="#DC2626" />
            </View>
            <Text style={styles.confirmTitle}>Konfirmasi Reset Progres?</Text>
            <Text style={styles.confirmDesc}>
              Tindakan ini tidak dapat dibatalkan. Seluruh XP, lencana, dan riwayat belajar akan kembali ke 0.
            </Text>

            <GameButton
              title="Ya, Hapus dan Reset"
              variant="danger"
              size="md"
              onPress={handleConfirmReset}
              style={{ width: '100%', marginBottom: 10 }}
            />
            <GameButton
              title="Batalkan"
              variant="outline"
              size="md"
              onPress={() => setResetModalVisible(false)}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  dangerCard: {
    borderColor: '#FEE2E2',
    borderBottomColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 6,
  },
  dangerDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 12,
  },
  footerBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  footerLogo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  footerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  footerVersion: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  footerCopy: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  warningCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
});
