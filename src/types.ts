export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  department: 'Computer Science' | 'Mathematics';
  avatar: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  edition: string;
  condition: 'New' | 'Like New' | 'Very Good' | 'Good' | 'Fair';
  subject: 'Computer Science' | 'Mathematics' | 'Both';
  available: boolean;
  ownerId: string;
  owner: User;
  coverImage: string;
  description: string;
}

export interface BookRequest {
  id: string;
  bookId: string;
  requesterId: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}