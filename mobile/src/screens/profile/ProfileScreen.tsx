import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStats } from '@/hooks/useStats';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';

export function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { stats } = useStats();

  async function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar name={user?.email} size={80} />
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={32} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.current_streak || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="dumbbell" size={32} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.total_workouts || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
          </Card>
        </View>

        {/* Profile Info */}
        <Card style={styles.infoCard}>
          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="target" size={24} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Fitness Goal
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.fitness_goal || 'Not set'}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="speedometer" size={24} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Fitness Level
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.fitness_level || 'Not set'}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Workout Duration
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.time_per_workout || 30} minutes
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.settingRow}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.settingRow}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.settingRow}>
            <MaterialCommunityIcons name="information-outline" size={24} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>About</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface }]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textDisabled }]}>FitForge v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  infoCard: {
    marginHorizontal: 24,
    padding: 4,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  settingsCard: {
    marginHorizontal: 24,
    padding: 4,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  version: {
    fontSize: 12,
  },
});
