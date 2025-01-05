import { Book } from '../types/book';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of decadence and excess, Gatsby explores the American Dream.',
    condition: 'Very Good',
    image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    user_id: '1',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A classic of modern American literature.',
    condition: 'Like New',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    user_id: '1',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel.',
    condition: 'Good',
    image_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
    user_id: '2',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];