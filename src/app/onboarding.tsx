import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { saveUserProfile } from '@/database/repository';
import { GameButton } from '@/components/ui/GameButton';

const AVATARS = [
  { id: 'dev_1', icon: 'terminal', label: 'Coder', color: '#10B981' },
  { id: 'dev_2', icon: 'code-slash', label: 'Frontend', color: '#0284C7' },
  { id: 'dev_3', icon: 'flash', label: 'JS Ninja', color: '#F59E0B' },
  { id: 'dev_4', icon: 'rocket', label: 'Innovator', color: '#7C3AED' },
  { id: 'dev_5', icon: 'color-palette', label: 'Stylist', color: '#EC4899' },
  { id: 'dev_6', icon: 'shield-checkmark', label: 'Architect', color: '#059669' },
];

const GOALS = [
  { minutes: 10, label: 'Santai', desc: '10 menit/hari' },
  { minutes: 15, label: 'Reguler', desc: '15 menit/hari (Rekomendasi)' },
  { minutes: 25, label: 'Intensif', desc: '25 menit/hari' },
];

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('dev_1');
  const [goalMinutes, setGoalMinutes] = useState(15);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = async () => {
    if (!name.trim()) {
      setErrorMsg('Silakan masukkan nama atau panggilanmu!');
      return;
    }

    setLoading(true);
    try {
      await saveUserProfile(name.trim(), selectedAvatar, goalMinutes);
      router.replace('/(tabs)');
    } catch {
      setErrorMsg('Gagal menyimpan profil lokal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Header */}
          <View style={styles.heroBox}>
            <Image
              source={require('@/assets/images/app-logo.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <View style={styles.badgeTop}>
              <Text style={styles.badgeTopText}>100% OFFLINE-FIRST</Text>
            </View>
            <Text style={styles.brandTitle}>BPROTIC</Text>
            <Text style={styles.appTitle}>Web Academy</Text>
            <Text style={styles.subtitle}>
              Belajar HTML, CSS, dan JavaScript dari nol dengan petualangan gamified yang menyenangkan!
            </Text>
          </View>

          {/* Step 1: Name Input */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Siapa Nama Panggilanmu?</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Budi Coder"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errorMsg) setErrorMsg('');
              }}
              autoCapitalize="words"
            />
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>

          {/* Step 2: Choose Avatar */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Pilih Avatar Karaktermu</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <TouchableOpacity
                    key={av.id}
                    onPress={() => setSelectedAvatar(av.id)}
                    style={[
                      styles.avatarItem,
                      isSelected && { borderColor: av.color, backgroundColor: '#F8FAFC' },
                    ]}
                  >
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: av.color + '20' },
                      ]}
                    >
                      <Ionicons
                        name={av.icon as keyof typeof Ionicons.glyphMap}
                        size={28}
                        color={av.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.avatarLabel,
                        isSelected && { color: av.color, fontWeight: '800' },
                      ]}
                    >
                      {av.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 3: Learning Goal */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Target Belajar Harian</Text>
            <View style={styles.goalList}>
              {GOALS.map((g) => {
                const isSelected = goalMinutes === g.minutes;
                return (
                  <TouchableOpacity
                    key={g.minutes}
                    onPress={() => setGoalMinutes(g.minutes)}
                    style={[
                      styles.goalItem,
                      isSelected && styles.goalItemSelected,
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? '#10B981' : '#94A3B8'}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.goalTitle,
                          isSelected && { color: '#065F46', fontWeight: '800' },
                        ]}
                      >
                        {g.label}
                      </Text>
                      <Text style={styles.goalDesc}>{g.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Start CTA Button */}
          <View style={styles.ctaBox}>
            <GameButton
              title="Mulai Petualangan Belajar →"
              variant="primary"
              size="lg"
              loading={loading}
              onPress={handleStart}
              style={{ width: '100%' }}
            />
            <Text style={styles.offlineNote}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" /> Semua materi & playground dapat diakses tanpa koneksi internet
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  heroLogo: {
    width: 104,
    height: 104,
    marginBottom: 12,
  },
  badgeTop: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeTopText: {
    color: '#065F46',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 2,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
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
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  avatarItem: {
    width: '31%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  goalList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  goalItemSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  goalDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  ctaBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  offlineNote: {
    marginTop: 12,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
