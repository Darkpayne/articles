import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import ApiService from '../services/api';
import { Article, Comment } from '../types/articles';

interface ArticlesState {
  articles: Article[];
  filteredArticles: Article[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  comments: Record<number, Comment[]>;
  loadingComments: Record<number, boolean>;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  filterArticles: () => void;
  fetchArticles: (forceRefresh?: boolean) => Promise<void>;
  fetchComments: (postId: number) => Promise<Comment[]>;
  clearSearch: () => void;
}

export const useArticlesStore = create<ArticlesState>()(
  persist(
    (set, get) => ({
      
      articles: [],
      filteredArticles: [],
      searchQuery: '',
      isLoading: false,
      error: null,
      comments: {},
      loadingComments: {},

      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error }),
      
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
        get().filterArticles();
      },

      filterArticles: () => {
        const { articles, searchQuery } = get();
        if (!searchQuery) {
          set({ filteredArticles: articles });
        } else {
          const filtered = articles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          set({ filteredArticles: filtered });
        }
      },

      fetchArticles: async (forceRefresh = false) => {
        const { articles, setLoading, setError, filterArticles } = get();
        
        if (articles.length > 0 && !forceRefresh) {
          filterArticles();
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const fetchedArticles = await ApiService.fetchPosts();
          set({ 
            articles: fetchedArticles,
            error: null 
          });
          filterArticles();
        } catch (error) {
          setError('Failed to fetch articles. Please try again.');
        } finally {
          setLoading(false);
        }
      },

      fetchComments: async (postId: number): Promise<Comment[]> => {
        const { comments, loadingComments } = get();
        
        if (comments[postId]) {
          return comments[postId];
        }

        if (loadingComments[postId]) {
          return [];
        }

        set({ 
          loadingComments: { ...loadingComments, [postId]: true } 
        });

        try {
          const fetchedComments = await ApiService.fetchComments(postId);
          set({
            comments: { ...get().comments, [postId]: fetchedComments },
            loadingComments: { ...get().loadingComments, [postId]: false }
          });
          return fetchedComments;
        } catch (error) {
          console.error('Error fetching comments:', error);
          set({
            loadingComments: { ...get().loadingComments, [postId]: false }
          });
          return [];
        }
      },

      clearSearch: () => {
        set({ searchQuery: '' });
        get().filterArticles();
      }
    }),
    {
      name: 'articles-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        articles: state.articles,
        comments: state.comments
      })
    }
  )
);
