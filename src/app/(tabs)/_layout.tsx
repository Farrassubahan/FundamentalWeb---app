import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabItemProps {
  name: keyof typeof Ionicons.glyphMap;
  activeName: keyof typeof Ionicons.glyphMap;
  title: string;
  focused: boolean;
  activeColor: string;
  activeBg: string;
}

function TabItem({
  name,
  activeName,
  title,
  focused,
  activeColor,
  activeBg,
}: TabItemProps) {
  return (
    <View style={styles.tabItemContainer}>
      <View
        style={[
          styles.iconPill,
          focused && {
            backgroundColor: activeBg,
            borderColor: activeColor + '40',
            borderWidth: 1.5,
          },
        ]}
      >
        <Ionicons
          name={focused ? activeName : name}
          size={focused ? 21 : 20}
          color={focused ? activeColor : '#64748B'}
        />
      </View>
      <Text
        style={[
          styles.tabLabel,
          focused
            ? [styles.tabLabelActive, { color: activeColor }]
            : styles.tabLabelInactive,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isTablet, isDesktop } = useResponsive();
  const isLarge = isTablet || isDesktop;

  // Dynamically adapt to Android 3-button navbar (back, home, recents), gesture bars, or iOS home indicator
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 8);
  const tabHeight = 60 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: bottomInset,
          },
          isLarge && [styles.tabBarLarge, { marginBottom: Math.max(insets.bottom, 16) }],
        ],
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ focused }) => (
            <TabItem
              name="home-outline"
              activeName="home"
              title="Beranda"
              focused={focused}
              activeColor="#059669"
              activeBg="#D1FAE5"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Belajar',
          tabBarIcon: ({ focused }) => (
            <TabItem
              name="map-outline"
              activeName="map"
              title="Belajar"
              focused={focused}
              activeColor="#EA580C"
              activeBg="#FFEDD5"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="playground"
        options={{
          title: 'Playground',
          tabBarIcon: ({ focused }) => (
            <TabItem
              name="code-slash-outline"
              activeName="code-slash"
              title="Playground"
              focused={focused}
              activeColor="#7C3AED"
              activeBg="#EDE9FE"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progres',
          tabBarIcon: ({ focused }) => (
            <TabItem
              name="trophy-outline"
              activeName="trophy"
              title="Progres"
              focused={focused}
              activeColor="#D97706"
              activeBg="#FEF3C7"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ focused }) => (
            <TabItem
              name="settings-outline"
              activeName="settings"
              title="Pengaturan"
              focused={focused}
              activeColor="#0284C7"
              activeBg="#E0F2FE"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBarLarge: {
    maxWidth: 620,
    width: '92%',
    alignSelf: 'center',
    marginHorizontal: 'auto',
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  tabBarItem: {
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
    paddingVertical: 2,
  },
  iconPill: {
    width: 46,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10.5,
    lineHeight: 14,
    textAlign: 'center',
  },
  tabLabelInactive: {
    color: '#64748B',
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
});
