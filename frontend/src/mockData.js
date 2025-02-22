export const mockBooks = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    description: 'A comprehensive guide to algorithms used in computer science, covering both theory and practical applications.',
    coverImage: 'https://placehold.co/400x600?text=Introduction+to+Algorithms',
    condition: 'Good',
    available: true,
    owner: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    description: 'A well-structured textbook on discrete mathematics, focusing on logic, set theory, combinatorics, and graph theory.',
    coverImage: 'https://placehold.co/400x600?text=Discrete+Mathematics+and+Its+Applications',
    condition: 'New',
    available: false,
    owner: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  },
  {
    id: '3',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    description: 'A comprehensive introduction to the field of artificial intelligence, covering fundamental topics and modern developments.',
    coverImage: 'https://placehold.co/400x600?text=Artificial+Intelligence+A+Modern+Approach',
    condition: 'Used',
    available: true,
    owner: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '4',
    title: 'Linear Algebra Done Right',
    author: 'Sheldon Axler',
    description: 'An in-depth introduction to linear algebra, focusing on vector spaces, linear maps, and eigenvalues, with a more conceptual approach.',
    coverImage: 'https://placehold.co/400x600?text=Linear+Algebra+Done+Right',
    condition: 'Good',
    available: true,
    owner: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  }
];

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  bio: 'CS enthusiast and aspiring mathematician',
  booksOwned: ['1', '3'],
  booksRequested: ['2']
};

export const mockMatches = [
  {
    id: '1',
    bookId: '2',
    requesterId: '1',
    ownerId: '2',
    status: 'pending',
    createdAt: '2025-02-22T22:00:00Z'
  }
];