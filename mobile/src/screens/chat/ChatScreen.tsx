import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useChat } from '@/hooks/useChat';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { formatDate } from '@/utils/helpers';
import { ChatMessage } from '@/types';

const SUGGESTED_QUESTIONS = [
  'How do I improve my squat form?',
  "What's a good warm-up routine?",
  'How can I build muscle faster?',
  'Tips for staying motivated?',
];

export function ChatScreen() {
  const { colors } = useTheme();
  const { messages, loading, sending, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  async function handleSend() {
    if (inputText.trim() && !sending) {
      const message = inputText.trim();
      setInputText('');
      try {
        await sendMessage(message);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }

  function handleSuggestedQuestion(question: string) {
    setInputText(question);
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? colors.primary : colors.surface,
            },
          ]}
        >
          <Text style={[styles.messageText, { color: '#FFFFFF' }]}>{item.content}</Text>
          <Text style={[styles.messageTime, { color: 'rgba(255,255,255,0.6)' }]}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Coach</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Your personal fitness assistant
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="chat-question"
              title="Ask me anything!"
              description="I'm here to help with workouts, nutrition, form, and motivation"
            />
            <View style={styles.suggestedQuestions}>
              <Text style={[styles.suggestedTitle, { color: colors.textSecondary }]}>
                Try asking:
              </Text>
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestedChip, { backgroundColor: colors.surface }]}
                  onPress={() => handleSuggestedQuestion(question)}
                >
                  <Text style={[styles.suggestedText, { color: colors.text }]}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a question..."
            placeholderTextColor={colors.textDisabled}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.surfaceVariant },
            ]}
          >
            {sending ? (
              <MaterialCommunityIcons name="loading" size={24} color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons name="send" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  keyboardView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  suggestedQuestions: {
    marginTop: 32,
  },
  suggestedTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  suggestedChip: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestedText: {
    fontSize: 14,
  },
  messagesList: {
    padding: 24,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    margin: 16,
    borderRadius: 24,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
