import { useArticlesStore } from '@/store/articleStore';
import { Comment } from '@/types/articles';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function ArticleDetailScreen() {
  const { id,title } = useLocalSearchParams<{ id: string, title:string }>();
  const { articles, fetchComments, comments, loadingComments } = useArticlesStore();
  const [fadeAnim] = useState(new Animated.Value(0));

  const article = articles.find(a => a.id === parseInt(id));
  const navigation = useNavigation();
  useEffect(() => {
    if (article) {
      navigation.setOptions({ title: title as string });
      fetchComments(article.id);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [article?.id]);

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  const articleComments = comments[article.id] || [];
  const isLoadingComments = loadingComments[article.id] || false;

  const renderComment = (comment: Comment, index: number) => (
    <View key={comment.id} style={styles.commentCard}>
      <Text style={styles.commentName}>{comment.name}</Text>
      <Text style={styles.commentEmail}>{comment.email}</Text>
      <Text style={styles.commentBody}>{comment.body}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.articleContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.body}>{article.body}</Text>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({articleComments.length})
          </Text>
          
          {isLoadingComments ? (
            <View style={styles.loadingComments}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.loadingText}>Loading comments...</Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {articleComments.map(renderComment)}
            </View>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  articleContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 32,
    textTransform: 'capitalize',
  },
  body: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  commentsSection: {
    margin: 16,
    marginTop: 0,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  loadingComments: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  commentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  commentEmail: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 8,
  },
  commentBody: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 50,
  },
});