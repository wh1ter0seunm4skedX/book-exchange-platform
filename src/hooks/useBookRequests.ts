import { useState } from 'react';

export function useBookRequests() {
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const requestBook = async (bookId: string) => {
    setPendingRequests(prev => new Set(prev).add(bookId));
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate API call success
      return true;
    } catch (error) {
      console.error('Failed to request book:', error);
      return false;
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  return {
    requestBook,
    isRequesting: (bookId: string) => pendingRequests.has(bookId)
  };
}
