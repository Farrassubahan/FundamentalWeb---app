import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatPill } from './StatPill';
import { UserStats } from '@/types';
import { getHeartRegenCountdown } from '@/services/gamification';
import { refillHearts } from '@/database/repository';
import { GameButton } from './GameButton';

interface TopHeaderStatsProps {
  stats: UserStats | null;
  onRefreshStats?: () => void;
  showWorldSelector?: boolean;
}

export const TopHeaderStats: React.FC<TopHeaderStatsProps> = ({
  stats,
  onRefreshStats,
}) => {
  const [heartModalVisible, setHeartModalVisible] = useState(false);
  const [refilling, setRefilling] = useState(false);

  const streak = stats?.streak ?? 1;
  const xp = stats?.xp ?? 0;
  const hearts = stats?.hearts ?? 5;
  const maxHearts = stats?.maxHearts ?? 5;
  const regenTime = stats ? getHeartRegenCountdown(stats.heartsLastRegen) : '--:--';

  const handleRefill = async () => {
    setRefilling(true);
    try {
      await refillHearts();
      if (onRefreshStats) onRefreshStats();
      setHeartModalVisible(false);
    } finally {
      setRefilling(false);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        {/* Brand logo / title */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBracket}>&lt;</Text>
            <Text style={styles.logoText}>B</Text>
            <Text style={styles.logoBracket}>/&gt;</Text>
          </View>
          <Text style={styles.brandName}>Web Academy</Text>
        </View>

        {/* Stats cluster */}
        <View style={styles.statsCluster}>
          <StatPill
            icon="flame"
            value={streak}
            color="#EA580C"
            bgColor="#FFEDD5"
          />
          <StatPill
            icon="star"
            value={xp}
            color="#D97706"
            bgColor="#FEF3C7"
          />
          <StatPill
            icon="heart"
            value={`${hearts}/${maxHearts}`}
            color="#DC2626"
            bgColor="#FEE2E2"
            onPress={() => setHeartModalVisible(true)}
          />
        </View>
      </View>

      {/* Heart Info Modal */}
      <Modal
        visible={heartModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setHeartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="heart" size={48} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Kesehatan Hati</Text>
            <Text style={styles.modalDesc}>
              Hati digunakan saat menjawab salah di quiz. Setiap hati akan beregenerasi otomatis setiap 30 menit.
            </Text>

            <View style={styles.heartRow}>
              {Array.from({ length: maxHearts }).map((_, idx) => (
                <Ionicons
                  key={idx}
                  name="heart"
                  size={32}
                  color={idx < hearts ? '#EF4444' : '#CBD5E1'}
                  style={{ marginHorizontal: 4 }}
                />
              ))}
            </View>

            {hearts < maxHearts && (
              <View style={styles.timerBox}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text style={styles.timerText}>
                  Hati berikutnya pulih dalam: <Text style={styles.timerBold}>{regenTime}</Text>
                </Text>
              </View>
            )}

            <View style={styles.modalActionRow}>
              {hearts < maxHearts && (
                <GameButton
                  title="Isi Penuh Sekarang"
                  variant="primary"
                  size="md"
                  loading={refilling}
                  onPress={handleRefill}
                  style={{ marginBottom: 10, width: '100%' }}
                />
              )}
              <GameButton
                title="Tutup"
                variant="outline"
                size="md"
                onPress={() => setHeartModalVisible(false)}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerInner: {
    maxWidth: 1040,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  logoBracket: {
    color: '#D1FAE5',
    fontWeight: '900',
    fontSize: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    marginHorizontal: 1,
  },
  brandName: {
    fontWeight: '800',
    fontSize: 15,
    color: '#0F172A',
  },
  statsCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  heartRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 12,
    color: '#64748B',
  },
  timerBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  modalActionRow: {
    width: '100%',
  },
});
