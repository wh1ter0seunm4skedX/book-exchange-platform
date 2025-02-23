// Mock Books Catalog
export const mockBooks = [
  {
    id: "book1",
    title: "Introduction to Computer Science",
    courseNumber: "CS101",
    coverImage: "https://placehold.co/400x600?text=CS101",
    author: "John Smith",
    edition: "3rd"
  },
  {
    id: "book2",
    title: "Data Structures and Algorithms",
    courseNumber: "CS201",
    coverImage: "https://placehold.co/400x600?text=CS201",
    author: "Jane Wilson",
    edition: "4th"
  },
  {
    id: "book3",
    title: "Calculus for Engineers",
    courseNumber: "MATH201",
    coverImage: "https://placehold.co/400x600?text=MATH201",
    author: "Robert Johnson",
    edition: "2nd"
  },
  {
    id: "book4",
    title: "Physics for Scientists",
    courseNumber: "PHYS101",
    coverImage: "https://placehold.co/400x600?text=PHYS101",
    author: "Maria Garcia",
    edition: "5th"
  },
  {
    id: "book5",
    title: "Organic Chemistry",
    courseNumber: "CHEM201",
    coverImage: "https://placehold.co/400x600?text=CHEM201",
    author: "David Brown",
    edition: "6th"
  }
];

// Mock Users
export const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@university.edu",
    preferredLocation: "Main Library"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    preferredLocation: "Science Building"
  },
  {
    id: "user3",
    name: "Mike Johnson",
    email: "mike.johnson@university.edu",
    preferredLocation: "Student Center"
  }
];

// Mock Published Books
export const mockPublishedBooks = [
  {
    id: "pub1",
    userId: "user2",
    bookId: "book2",
    status: "active",
    createdAt: "2025-02-23T09:00:00+02:00",
    condition: "Like New",
    notes: "Used for one semester only"
  },
  {
    id: "pub2",
    userId: "user3",
    bookId: "book3",
    status: "active",
    createdAt: "2025-02-21T10:30:00+02:00",
    condition: "Good",
    notes: "Some highlighting in chapters 1-3"
  },
  {
    id: "pub3",
    userId: "user1",
    bookId: "book4",
    status: "active",
    createdAt: "2025-02-22T14:15:00.000Z",
    condition: "Excellent",
    notes: "Never used"
  }
];

// Mock Book Requests
export const mockBookRequests = [
  {
    id: "request1",
    userId: "user1",
    bookId: "book2",
    status: "active",
    createdAt: "2025-02-23T08:00:00+02:00",
    urgency: "high",
    notes: "Need for upcoming midterm"
  },
  {
    id: "request2",
    userId: "user2",
    bookId: "book5",
    status: "active",
    createdAt: "2025-02-21T15:30:00+02:00",
    urgency: "medium",
    notes: "For next semester"
  },
  {
    id: "request3",
    userId: "user3",
    bookId: "book5",
    status: "active",
    createdAt: "2025-02-23T08:45:00+02:00",
    urgency: "low",
    notes: "Interested in the subject"
  }
];

// Mock Matches
export const mockMatches = [
  {
    id: "match1",
    requestId: "request1",
    publishId: "pub1",
    status: "pending",
    createdAt: "2025-02-23T10:22:07+02:00",
    book: {
      id: "book2",
      title: "Data Structures and Algorithms",
      courseNumber: "CS201",
      coverImage: "https://placehold.co/400x600?text=CS201",
      author: "Jane Wilson",
      edition: "4th"
    },
    matchedUser: {
      id: "user2",
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      preferredLocation: "Science Building"
    }
  },
  {
    id: "match2",
    requestId: "request1",
    publishId: "pub2",
    status: "accepted",
    createdAt: "2025-02-21T16:00:00.000Z",
    book: {
      id: "book3",
      title: "Calculus for Engineers",
      courseNumber: "MATH201",
      coverImage: "https://placehold.co/400x600?text=MATH201",
      author: "Robert Johnson",
      edition: "2nd"
    }
  }
];