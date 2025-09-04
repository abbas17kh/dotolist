# Doto List - Todo Application

A full-stack todo list application built with Spring Boot and vanilla JavaScript. Clean, responsive design with complete CRUD functionality.

## Tech Stack

**Backend:**
- Spring Boot 3.5.5
- Spring Data JPA
- H2 Database (in-memory)
- Bean Validation
- Maven

**Frontend:**
- Vanilla HTML/CSS/JavaScript
- Font Awesome icons
- Responsive design

## Features

- ✅ Create, read, update, delete todos
- 🔍 Search todos by title or description  
- 📊 Filter by status (all/pending/completed)
- 📈 Real-time statistics
- ⚡ Toggle completion status
- 🎨 Modern, responsive UI
- 🛡️ Input validation and error handling

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dotolist
```

2. Run the application:
```bash
./mvnw spring-boot:run
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create new todo |
| GET | `/api/todos/{id}` | Get todo by ID |
| PUT | `/api/todos/{id}` | Update todo |
| PATCH | `/api/todos/{id}/toggle` | Toggle completion |
| DELETE | `/api/todos/{id}` | Delete todo |
| GET | `/api/todos/completed` | Get completed todos |
| GET | `/api/todos/pending` | Get pending todos |
| GET | `/api/todos/search?keyword=` | Search todos |

## Database Console

Access H2 database console at: `http://localhost:8080/h2-console`

**Connection settings:**
- JDBC URL: `jdbc:h2:mem:todolist`
- Username: `sa`
- Password: (empty)

## Project Structure

```
src/
├── main/
│   ├── java/abbas17kh/doto/dotolist/
│   │   ├── controller/    # REST controllers
│   │   ├── dto/           # Data transfer objects
│   │   ├── entity/        # JPA entities
│   │   ├── exception/     # Exception handlers
│   │   ├── repository/    # Data repositories
│   │   └── service/       # Business logic
│   └── resources/
│       ├── static/        # Frontend files
│       └── application.properties
```

## Development

The application uses:
- H2 in-memory database (data resets on restart)
- Spring Boot DevTools for hot reload
- Hibernate DDL auto-generation
- SQL logging enabled for debugging

## Build & Package

```bash
# Create JAR file
./mvnw clean package

# Run the JAR
java -jar target/dotolist-0.0.1-SNAPSHOT.jar
```