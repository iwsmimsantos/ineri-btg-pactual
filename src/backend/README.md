# 🏗️ INERI Investment API - Backend Documentation

## 📋 **Project Overview**

ASP.NET Core 9.0 Web API for investment management platform with PostgreSQL database, following Clean Architecture principles and Test-Driven Development (TDD).

### **🎯 Key Features**
- ✅ Investment portfolio management
- ✅ Client-advisor relationship management
- ✅ Risk profiling (declared vs calculated)
- ✅ Investment recommendations system
- ✅ JSONB support for complex risk data
- ✅ PostgreSQL enum integration
- ✅ Repository pattern with clean architecture
- ✅ Swagger/OpenAPI documentation

---

## 🚀 **Quick Start**

### **Prerequisites**
- .NET 9.0 SDK
- PostgreSQL 12+
- Visual Studio Code / Visual Studio / Rider

### **1. Clone & Setup**
```bash
git clone <repository-url>
cd src/backend
```

### **2. Database Configuration**
Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=investment_db;Username=your_username;Password=your_password;Port=5432;"
  }
}
```

### **3. Install EF Tools (First Time Only)**
```bash
dotnet tool install --global dotnet-ef
export PATH="$PATH:$HOME/.dotnet/tools"
```

### **4. Apply Database Migrations**
```bash
dotnet ef database update
```

### **5. Start Development Server**
```bash
./start-dev.sh
# OR manually:
export ASPNETCORE_ENVIRONMENT=Development
dotnet run --urls="http://localhost:5000"
```

---

## 🏗️ **Architecture Overview**

```
INERI.Backend/
├── 📁 controllers/          # API Controllers (REST endpoints)
├── 📁 models/              # Entity models & enums
├── 📁 Data/                # DbContext & configurations
├── 📁 repositories/        # Repository pattern implementation
├── 📁 services/            # Business logic services
├── 📁 Migrations/          # EF Core migrations
├── 📄 Program.cs           # Application startup
├── 📄 appsettings.json     # Configuration
├── 📄 start-dev.sh         # Development startup script
└── 📄 initial-data.sql     # Test data for database
```

### **🔗 Domain Models**
| Entity | Description | Key Relationships |
|--------|-------------|-------------------|
| `Assessor` | Financial advisors | Has many `Clientes` |
| `Cliente` | Investment clients | Belongs to `Assessor` |
| `Ativo` | Financial assets | Used in `Investimentos` |
| `Investimento` | Investment positions | Links `Cliente` + `Ativo` |
| `HistoricoRiscoDeclarado` | Client risk surveys | JSONB data |
| `HistoricoRiscoCalculado` | Calculated risk profiles | JSONB data |
| `Recomendacao` | Investment recommendations | Links `Cliente` + `Ativo` |

---

## 🔧 **Daily Development Workflows**

### **🟢 Starting Development**
```bash
# Option 1: One-command startup
./start-dev.sh

# Option 2: Manual startup
export ASPNETCORE_ENVIRONMENT=Development
dotnet run --urls="http://localhost:5000"
```

### **📊 Database Operations**

#### **Create Migration**
```bash
export PATH="$PATH:$HOME/.dotnet/tools"
dotnet ef migrations add DescriptiveMigrationName
```

#### **Apply Migrations**
```bash
dotnet ef database update
```

#### **Rollback Migration**
```bash
dotnet ef database update PreviousMigrationName
```

#### **Remove Last Migration**
```bash
dotnet ef migrations remove
```

#### **Add Test Data**
```bash
# Execute initial-data.sql in PostgreSQL
psql -d investment_db -f initial-data.sql
```

### **🧪 Testing Workflows**

#### **Run All Tests**
```bash
dotnet test
```

#### **Run Specific Test Class**
```bash
dotnet test --filter "ClassName"
```

#### **Run Tests with Coverage**
```bash
dotnet test --collect:"XPlat Code Coverage"
```

---

## 🌐 **API Endpoints**

### **Base URL:** `http://localhost:5000`

### **📋 Core Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information & navigation |
| GET | `/health` | Health check |
| GET | `/swagger` | Interactive API documentation |

### **👥 Clientes (Clients)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clientes` | List all clients |
| GET | `/api/clientes/{id}` | Get client by ID |
| GET | `/api/clientes/email/{email}` | Get client by email |
| GET | `/api/clientes/cpf/{cpf}` | Get client by CPF |
| GET | `/api/clientes/assessor/{assessorId}` | Get clients by advisor |
| GET | `/api/clientes/{id}/investimentos` | Get client with investments |
| POST | `/api/clientes` | Create new client |
| PUT | `/api/clientes/{id}` | Update client |
| DELETE | `/api/clientes/{id}` | Delete client |

### **📊 Example API Calls**
```bash
# Get all clients
curl http://localhost:5000/api/clientes

# Get client by email
curl http://localhost:5000/api/clientes/email/carlos.santos@email.com

# Create new client
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@test.com",
    "cpf": "12345678901",
    "dataNascimento": "1990-01-01",
    "assessorId": 1
  }'
```

---

## 🗃️ **Database Schema**

### **🔑 Enums**
```csharp
// CategoriaAssessor
Junior | Pleno | Senior | Especialista

// StatusRecomendacao
Pendente | Aprovada | Rejeitada | EmAnalise | Implementada
```

### **🔗 Key Relationships**
- `Cliente.AssessorId` → `Assessor.Id` (Many-to-One)
- `Investimento.ClienteId` → `Cliente.Id` (Many-to-One)
- `Investimento.AtivoId` → `Ativo.Id` (Many-to-One)
- `HistoricoRiscoDeclarado.ClienteId` → `Cliente.Id` (Many-to-One)
- `HistoricoRiscoCalculado.ClienteId` → `Cliente.Id` (Many-to-One)
- `Recomendacao.ClienteId` → `Cliente.Id` (Many-to-One)
- `Recomendacao.AtivoId` → `Ativo.Id` (Many-to-One)

### **📋 JSONB Columns**
- `HistoricoRiscoDeclarado.RespostasQuestionario`: Survey responses
- `HistoricoRiscoCalculado.DadosCalculo`: Risk calculation data

---

## 🧪 **Test-Driven Development (TDD)**

### **📁 Test Structure**
```
Tests/
├── DbContextTests.cs          # Database & mapping tests
├── RepositoryTests.cs         # Repository pattern tests
├── ControllerTests.cs         # API endpoint tests
├── IntegrationTests.cs        # Full stack tests
└── Helpers/                   # Test utilities
```

### **🔄 TDD Workflow**
1. **Red**: Write failing test
2. **Green**: Implement minimal code to pass
3. **Refactor**: Improve code quality
4. **Repeat**: Continue cycle

### **🛠️ Test Technologies**
- **xUnit**: Testing framework
- **InMemory Database**: Fast isolated tests
- **Moq**: Mocking dependencies
- **AspNetCore.Mvc.Testing**: Integration testing

---

## 🔧 **Configuration & Environment**

### **🌍 Environment Variables**
```bash
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection="Host=localhost;Database=investment_db;Username=postgres;Password=yourpassword;Port=5432;"
```

### **⚙️ appsettings.json Structure**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "PostgreSQL connection string",
    "TestConnection": "Test database connection string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## 📊 **Performance & Monitoring**

### **🔍 Logging**
- Uses built-in ASP.NET Core logging
- Configured in `appsettings.json`
- EF queries logged at Warning level in development

### **📈 Health Checks**
- Endpoint: `GET /health`
- Returns: `{"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}`

### **🔧 Development Tools**
- **Swagger UI**: Interactive API testing
- **Hot Reload**: Automatic code reloading
- **Exception Pages**: Detailed error information

---

## 🚀 **Deployment**

### **🐳 Docker (Future)**
```dockerfile
# Dockerfile exists for containerization
# Update with production configuration
```

### **🌐 Production Checklist**
- [ ] Update connection strings for production
- [ ] Enable HTTPS redirection
- [ ] Configure proper CORS policies
- [ ] Set up logging and monitoring
- [ ] Apply security headers
- [ ] Run database migrations

---
