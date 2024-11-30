# BookXChange

BookXChange is a platform that enables students to easily share and search for books they no longer need or are looking for. By offering a free book exchange system, the platform promotes sustainability and collaboration among students.

---

## **Features (MVP)**

1. **Book Donation**: Students can list books they no longer need and make them available to others.
2. **Book Search**: Students can search for books based on title, author, or category.
3. **User Dashboard**: A personalized dashboard for tracking donated and requested books.
4. **Authentication**: Secure login and signup system using JWT.

---

## **Technology Stack**

### **Frontend**
- Framework: React
- Styling: TailwindCSS

### **Backend**
- Framework: Spring Boot
- Database: MySQL
- Connectivity: JDBC
- Authentication: JWT

---

## **Database Structure**
### **Core Tables**
1. **Users**: Manages student accounts.
2. **Books**: Stores book details.
3. **User_Books**: Tracks book donations and requests.

**Example Relationships**:
- Users can donate or request multiple books (`Users` → `User_Books` → `Books`).

---

## **Project Status**
- **Current Stage**: MVP Development
- **Focus**: Book donation and search functionalities.

---

## **License**
This project is open-source and available under the MIT License.

---

## **Contributors**
- Michael: Lead Developer (Frontend and Backend)
- Guy: Lead Developer (Database and Backend)
