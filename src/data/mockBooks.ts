import { Book } from '../types/book';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'חשבון אינפינטסימלי 2',
    author: 'האוניברסיטה הפתוחה',
    description: 'אינפי 2 - מה עוד יש להגיד',
    condition: 'Very Good',
    image_url: 'https://simania.co.il/bookimages/covers100/1001302.jpg',
    user_id: '1',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'אלגברה לינארית 1',
    author: 'האוניברסיטה הפתוחה',
    description: 'לינארית 1',
    condition: 'Like New',
    image_url: 'https://simania.co.il/bookimages/covers100/1001303.jpg',
    user_id: '1',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'אלגברה לינארית 2',
    author: 'האוניברסיטה הפתוחה',
    description: 'לינארית 2',
    condition: 'Good',
    image_url: 'https://www.findabook.co.il/assets/images/detail/410931_2_det.jpg',
    user_id: '2',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];