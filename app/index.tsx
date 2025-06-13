import ArticleCard from '@/components/ArticleCard';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import { useArticlesStore } from '@/store/articleStore';
import { Article } from '@/types/articles';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

export default function Page() {
  const router = useRouter();
  const {
    filteredArticles,
    searchQuery,
    isLoading,
    error,
    fetchArticles,
    setSearchQuery,
    clearSearch
  } = useArticlesStore();

  useFocusEffect(
    useCallback(() => {
      fetchArticles();
    }, [])
  );

  const handleArticlePress = (article: Article) => {
    router.push({
      // @ts-ignore
      pathname: `/articles/${article.id}`,
      params: { title: article.title }
    });  };

  const handleRefresh = () => {
    fetchArticles(true);
  };

  const handleRetry = () => {
    fetchArticles(true);
  };

  const renderArticle = ({ item }: { item: Article }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticlePress(item)}
    />
  );

  if (isLoading && filteredArticles.length === 0) {
    return <LoadingSpinner message="Fetching articles..." />;
  }

  if (error && filteredArticles.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={clearSearch}
      />
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticle}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#2563eb"
            colors={['#2563eb']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    paddingBottom: 16,
  },
});