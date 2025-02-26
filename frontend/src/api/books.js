const API_BASE_URL = 'http://localhost:8080/api';

export const booksApi = {
  getAllBooks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },
  
};