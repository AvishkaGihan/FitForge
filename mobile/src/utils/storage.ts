import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User } from '@types'; // Import the User type

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  WORKOUT_CACHE: 'workout_cache',
  CHAT_CACHE: 'chat_cache',
  ONBOARDING_COMPLETE: 'onboarding_complete',
};

export const storage = {
  // Secure storage for sensitive data
  async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Secure storage error:', error);
      throw error;
    }
  },

  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Secure storage error:', error);
      return null;
    }
  },

  async deleteSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  },

  // Regular storage for non-sensitive data
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  // Helper methods for specific data
  async setAuthToken(token: string): Promise<void> {
    await this.setSecure(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return await this.getSecure(STORAGE_KEYS.AUTH_TOKEN);
  },

  async clearAuthToken(): Promise<void> {
    await this.deleteSecure(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setUserData(user: User): Promise<void> {
    // Use the User type
    await this.set(STORAGE_KEYS.USER_DATA, user);
  },

  async getUserData(): Promise<User | null> {
    // Use the User type
    return await this.get<User>(STORAGE_KEYS.USER_DATA);
  },

  async setOnboardingComplete(complete: boolean): Promise<void> {
    await this.set(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
  },

  async isOnboardingComplete(): Promise<boolean> {
    return (await this.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE)) || false;
  },
};

export { STORAGE_KEYS };
