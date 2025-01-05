import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';

export function BookForm() {
  const { addBook } = useBooks();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: 'האוניברסיטה הפתוחה',
    description: '',
    condition: 'כמו חדש',
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      addBook(formData);
      setFormData({
        title: '',
        author: 'The Open University Of Israel',
        description: '',
        condition: 'כמו חדש',
        image_url: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            שם הספר
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="רשמו את שם הספר כאן"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            הוצאה
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="רשמו את שם ההוצאה כאן"
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
            מצב
          </label>
          <select
            id="condition"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option>כמעט חדש</option>
            <option>ממש טוב</option>
            <option>אחלה</option>
            <option>סביר</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            הערות
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="אם יש הערות מסוימות (לא חובה)"
          />
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
            לינק לתמונה של הכריכה
          </label>
          <input
            type="url"
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="קישור לתמונת הכריכה של הספר"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 mt-6 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'מוסיף את הספר למאגר שלנו' : 'להוספת הספר'}
        </button>
      </div>
    </form>
  );
}
