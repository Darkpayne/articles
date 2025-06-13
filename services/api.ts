// src/services/api.ts
import { ApiError, Article, Comment } from '../types/articles';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status
      };
      throw error;
    }
    return await response.json();
  }

  async fetchPosts(): Promise<Article[]> {
    try {
      const response = await fetch(`${BASE_URL}/posts`);
      return await this.handleResponse<Article[]>(response);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async fetchComments(postId: number): Promise<Comment[]> {
    try {
      const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
      return await this.handleResponse<Comment[]>(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
}

export default new ApiService();