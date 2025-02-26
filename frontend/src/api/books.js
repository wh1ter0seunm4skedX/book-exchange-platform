const API_BASE_URL = 'http://localhost:8080/book_exchange_platform';

export const booksApi = {

    getAllBooks: async () => {
        const response = await fetch(`${API_BASE_URL}/books/all`.{
        headers: {
            'Autorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }

    return await response.json();
    } catch (error) {
        console.error('Error fetching all books:', error);
        throw error;
    }

}