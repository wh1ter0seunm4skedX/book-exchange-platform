// Mock Books Catalog
export const mockBooks = [
  {
    id: "book1",
    title: "Discrete Mathematics: Set Theory, Combinatorics and Graph Theory",
    courseNumber: "20476",
    coverImage: "https://placehold.co/400x600?text=Discrete+Mathematics:+Set+Theory,+Combinatorics+and+Graph+Theory"
  },
  {
    id: "book2",
    title: "Linear Algebra I",
    courseNumber: "20109",
    coverImage: "https://placehold.co/400x600?text=Linear+Algebra+I"
  },
  {
    id: "book3",
    title: "Infinitesimal Calculus I",
    courseNumber: "20106",
    coverImage: "https://placehold.co/400x600?text=Infinitesimal+Calculus+I"
  },
  {
    id: "book4",
    title: "Differential and Integral Calculus II",
    courseNumber: "20423",
    coverImage: "https://placehold.co/400x600?text=Differential+and+Integral+Calculus+II"
  },
  {
    id: "book5",
    title: "Probability for Computer Science Students",
    courseNumber: "20425",
    coverImage: "https://placehold.co/400x600?text=Probability+for+Computer+Science+Students"
  },
  {
    id: "book6",
    title: "Logic for Computer Science",
    courseNumber: "20466",
    coverImage: "https://placehold.co/400x600?text=Logic+for+Computer+Science"
  },
  {
    id: "book7",
    title: "Introduction to Computer Science Using Java",
    courseNumber: "20441",
    coverImage: "https://placehold.co/400x600?text=Introduction+to+Computer+Science+Using+Java"
  },
  {
    id: "book8",
    title: "Data Structures and Introduction to Algorithms",
    courseNumber: "20407",
    coverImage: "https://placehold.co/400x600?text=Data+Structures+and+Introduction+to+Algorithms"
  },
  {
    id: "book9",
    title: "Algorithms",
    courseNumber: "20417",
    coverImage: "https://placehold.co/400x600?text=Algorithms"
  },
  {
    id: "book10",
    title: "Automata Theory and Formal Languages",
    courseNumber: "20440",
    coverImage: "https://placehold.co/400x600?text=Automata+Theory+and+Formal+Languages"
  },
  {
    id: "book11",
    title: "System Programming Laboratory",
    courseNumber: "20465",
    coverImage: "https://placehold.co/400x600?text=System+Programming+Laboratory"
  },
  {
    id: "book12",
    title: "Introduction to the Theory of Computation and Complexity",
    courseNumber: "20585",
    coverImage: "https://placehold.co/400x600?text=Introduction+to+the+Theory+of+Computation+and+Complexity"
  },
  {
    id: "book13",
    title: "Operating Systems",
    courseNumber: "20594",
    coverImage: "https://placehold.co/400x600?text=Operating+Systems"
  }
];

// Mock Users
export const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@university.edu",
    preferredLocation: "Tel Aviv"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    preferredLocation: "Rehovot"
  },
  {
    id: "user3",
    name: "Mike Johnson",
    email: "mike.johnson@university.edu",
    preferredLocation: "Haifa"
  }
];

// Mock Published Books
export const mockPublishedBooks = [
  {
    id: "pub1",
    userId: "user2",
    bookId: "book8",
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
    bookId: "book7",
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
    bookId: "book8",
    status: "active",
    createdAt: "2025-02-23T08:00:00+02:00",
    urgency: "high",
    notes: "Need for upcoming midterm"
  },
  {
    id: "request2",
    userId: "user2",
    bookId: "book9",
    status: "active",
    createdAt: "2025-02-21T15:30:00+02:00",
    urgency: "medium",
    notes: "For next semester"
  },
  {
    id: "request3",
    userId: "user3",
    bookId: "book9",
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
      id: "book8",
      title: "Data Structures and Introduction to Algorithms",
      courseNumber: "20407",
      coverImage: "https://placehold.co/400x600?text=Data+Structures+and+Introduction+to+Algorithms"
    },
    matchedUser: {
      id: "user2",
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      preferredLocation: "Rehovot"
    }
  },
  {
    id: "match2",
    requestId: "request1",
    publishId: "pub2",
    status: "pending",
    createdAt: "2025-02-21T16:00:00.000Z",
    book: {
      id: "book3",
      title: "Infinitesimal Calculus I",
      courseNumber: "20106",
      coverImage: "https://placehold.co/400x600?text=Infinitesimal+Calculus+I"
    },
    matchedUser: {
      id: "user3",
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      preferredLocation: "Tel Aviv"
    }
  }
];