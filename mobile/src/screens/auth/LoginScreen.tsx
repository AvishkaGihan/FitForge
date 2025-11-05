import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { loginSchema } from '@/utils/validation';

export function LoginScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { login, loginWithBiometric, isBiometricAvailable } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  interface ValidationError {
    errors?: Array<{ path: (string | number)[]; message: string }>;
    message?: string;
  }

  async function handleLogin() {
    try {
      setErrors({});
      loginSchema.parse({ email, password });

      setLoading(true);
      await login(email, password);
    } catch (error) {
      const err = error as ValidationError;
      if (err.errors) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          fieldErrors[String(e.path[0])] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert('Login Failed', err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleBiometricLogin() {
    try {
      await loginWithBiometric();
    } catch (error) {
      const err = error as { message?: string };
      Alert.alert('Biometric Login Failed', err.message || 'An error occurred');
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.logo, { color: colors.primary }]}>💪</Text>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to continue your fitness journey
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="email"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock"
              error={errors.password}
            />

            <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.button} />

            {isBiometricAvailable && (
              <TouchableOpacity onPress={handleBiometricLogin} style={styles.biometricButton}>
                <MaterialCommunityIcons name="fingerprint" size={24} color={colors.primary} />
                <Text style={[styles.biometricText, { color: colors.textSecondary }]}>
                  Use Biometric Login
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  biometricText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
