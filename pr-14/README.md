# JobPortal - Resume Upload System

A secure and professional job portal application that allows users to upload PDF resumes with strict file validation. Built with Express.js, Multer, and modern web technologies.

## 🚀 Features

### File Upload Security
- **PDF Only**: Strictly accepts only PDF files
- **Size Limit**: Maximum 2MB file size enforcement
- **File Validation**: Server-side MIME type verification
- **Error Handling**: Comprehensive error messages for invalid uploads

### Professional Interface
- **Modern Design**: Clean, responsive job portal interface
- **Drag & Drop**: Intuitive file upload with drag and drop support
- **Real-time Validation**: Instant feedback on file selection
- **Progress Indicators**: Visual upload progress with animations

### Resume Management
- **Upload Form**: Complete applicant information collection
- **Resume Gallery**: View all uploaded resumes with details
- **Download System**: Secure file download functionality
- **Delete Management**: Remove unwanted resumes with confirmation

### Security Features
- **File Type Validation**: Prevents malicious file uploads
- **Size Restrictions**: Protects server storage and bandwidth
- **Secure Storage**: Files stored outside public directory
- **Input Sanitization**: XSS protection for user data

## 🛠️ Technology Stack

- **Backend**: Express.js with Multer middleware
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **File Handling**: Multer with custom storage configuration
- **Validation**: Server-side file type and size validation
- **UI Framework**: Custom CSS with modern design principles

## 📁 Project Structure

```
pr-14/
├── server.js              # Express server with upload logic
├── package.json           # Dependencies and scripts
├── uploads/               # Secure file storage directory
└── public/
    ├── index.html         # Main application interface
    ├── styles.css         # Complete styling system
    └── script.js          # Client-side functionality
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js installed on your system
- Modern web browser with JavaScript enabled

### Installation

1. **Navigate to the pr-14 directory**:
   ```bash
   cd "f:\Programming\SEM 5 all sub\Full Stack web\Backend_practical\pr-14"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open the application**:
   - Go to `http://localhost:3014` in your web browser
   - The job portal will be ready to use

## 📋 How to Use

### For Job Seekers

1. **Fill Application Form**:
   - Enter your full name
   - Provide email address
   - Select position applying for

2. **Upload Resume**:
   - Click the upload area or drag & drop a PDF file
   - File must be PDF format and under 2MB
   - System validates file instantly

3. **Submit Application**:
   - Click "Upload Resume" button
   - Get instant feedback on upload status
   - Receive confirmation of successful upload

### For HR/Administrators

1. **View Resumes**:
   - Click "View Resumes" in navigation
   - See dashboard with upload statistics
   - Browse all submitted applications

2. **Download Resumes**:
   - Click "Download" button for any resume
   - Files open in new tab or download automatically
   - Original filenames preserved

3. **Manage Applications**:
   - Delete unwanted resumes with confirmation
   - View applicant details and metadata
   - Track upload dates and file sizes

## 🔐 File Validation Rules

### Accepted Files
- **Format**: PDF files only (`.pdf`)
- **MIME Type**: `application/pdf`
- **Size Limit**: Maximum 2MB (2,097,152 bytes)
- **Quantity**: One file per upload

### Rejected Files
- **Wrong Format**: Any non-PDF files (images, documents, etc.)
- **Too Large**: Files exceeding 2MB size limit
- **Multiple Files**: More than one file at a time
- **Empty Upload**: No file selected

### Error Messages
- **File Type Error**: "Only PDF files are allowed! Please upload a PDF resume."
- **Size Error**: "File too large! Resume must be smaller than 2MB."
- **Missing File**: "No file uploaded! Please select a PDF file to upload."

## 🌐 API Endpoints

### Upload Resume
- **POST** `/upload-resume`
- **Content-Type**: `multipart/form-data`
- **Fields**: `applicantName`, `email`, `position`, `resume` (file)
- **Response**: JSON with upload status and file details

### Get Resumes List
- **GET** `/api/resumes`
- **Response**: JSON array of all uploaded resumes with metadata

### Download Resume
- **GET** `/download/:filename`
- **Response**: File download or 404 if not found

### Delete Resume
- **DELETE** `/api/resumes/:id`
- **Response**: JSON confirmation of deletion

## 🎨 UI Features

### Responsive Design
- **Desktop**: Full-featured layout with sidebar navigation
- **Tablet**: Optimized layout with responsive grid
- **Mobile**: Touch-friendly interface with stacked layout

### Visual Elements
- **Modern Color Scheme**: Professional blue and gray palette
- **Smooth Animations**: CSS transitions and hover effects
- **Progress Indicators**: Visual feedback during uploads
- **Toast Notifications**: Non-intrusive success/error messages

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **High Contrast**: Accessible color combinations
- **Focus Indicators**: Clear focus states for all interactive elements

## 🔒 Security Measures

### File Upload Security
- **MIME Type Validation**: Server-side file type checking
- **File Extension Validation**: Double verification of file format
- **Size Limits**: Prevents large file uploads
- **Secure Storage**: Files stored outside web root

### Input Validation
- **XSS Protection**: HTML escaping for user inputs
- **Required Fields**: Server-side validation of form data
- **Email Validation**: Proper email format checking
- **SQL Injection Prevention**: Parameterized queries (when using database)

### Error Handling
- **Graceful Failures**: User-friendly error messages
- **Server Protection**: Prevents server crashes from bad uploads
- **Rate Limiting**: Can be extended with upload rate limits
- **Logging**: Server logs all upload attempts and errors

## 📊 Features Overview

### Upload Process
1. ✅ User selects PDF file (validated client-side)
2. ✅ File is validated server-side for type and size
3. ✅ File is securely stored with unique filename
4. ✅ User receives confirmation with upload details
5. ✅ Resume appears in management dashboard

### Validation Workflow
```
File Selected → Client Validation → Server Validation → Storage → Confirmation
     ↓              ↓                    ↓             ↓          ↓
  PDF Check    Size Check         MIME Check      Secure Save   Success UI
```

## 🚀 Development Features

### Code Quality
- **Modular Design**: Separation of concerns
- **Error Handling**: Comprehensive try-catch blocks
- **Code Comments**: Well-documented functions
- **ES6+ Syntax**: Modern JavaScript features

### Performance
- **Efficient File Handling**: Streaming uploads with Multer
- **Optimized Storage**: Unique filename generation
- **Client-side Validation**: Reduces server load
- **Lazy Loading**: Resume list loaded on demand

## 🔧 Configuration Options

### File Limits (in server.js)
```javascript
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB - modify as needed
        files: 1 // Single file upload
    },
    fileFilter: fileFilter
});
```

### Accepted Positions
Modify the position dropdown in `index.html`:
- Frontend Developer
- Backend Developer
- Full Stack Developer
- UI/UX Designer
- Data Scientist
- DevOps Engineer
- Product Manager
- QA Engineer
- Mobile Developer

## 🤝 Contributing

To extend this application:
1. **Database Integration**: Add MongoDB/PostgreSQL for persistent storage
2. **User Authentication**: Implement login system for HR users
3. **Advanced Filtering**: Add search and filter capabilities
4. **Email Notifications**: Send confirmations to applicants
5. **Analytics Dashboard**: Track application statistics

## 📄 License

This project is developed for educational purposes as part of the Full Stack Web Development practical exercises.

---

**Built with ❤️ for secure resume management**

*Last updated: September 18, 2025*