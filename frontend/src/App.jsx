export default function App() {
    const mockBooks = [
      { id: 1, title: "Clean Code", condition: "Good", status: "Available" },
      { id: 2, title: "Design Patterns", condition: "Like New", status: "Requested" },
      { id: 3, title: "Refactoring", condition: "Fair", status: "Matched" }
    ];
  
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">BookXChange Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your book exchange platform</p>
        </header>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Condition: <span className="font-medium">{book.condition}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium text-blue-600">{book.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }