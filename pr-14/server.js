const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3014;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload with validation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter function - Only allow PDF files
const fileFilter = (req, file, cb) => {
    console.log('File received:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    // Check if file is PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed! Please upload a PDF resume.'), false);
    }
};

// Configure multer with size limit (2MB) and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB in bytes
        files: 1 // Only one file at a time
    },
    fileFilter: fileFilter
});

// Store uploaded files info in memory (in production, use database)
let uploadedResumes = [];

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle resume upload
app.post('/upload-resume', (req, res) => {
    upload.single('resume')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: 'File too large! Resume must be smaller than 2MB.',
                    details: 'Maximum file size allowed is 2MB. Please compress your PDF or use a smaller file.'
                });
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    error: 'Too many files! Please upload only one resume.',
                    details: 'You can only upload one resume file at a time.'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Upload error: ' + err.message,
                    details: 'Please try again with a valid PDF file.'
                });
            }
        } else if (err) {
            // Custom errors (like file type validation)
            return res.status(400).json({
                success: false,
                error: err.message,
                details: 'Please ensure you are uploading a valid PDF file under 2MB.'
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded!',
                details: 'Please select a PDF file to upload.'
            });
        }

        // Success - file uploaded and validated
        const fileInfo = {
            id: Date.now(),
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
            uploadDate: new Date().toISOString(),
            applicantName: req.body.applicantName || 'Anonymous',
            email: req.body.email || 'Not provided',
            position: req.body.position || 'Not specified'
        };

        uploadedResumes.push(fileInfo);

        console.log('Resume uploaded successfully:', fileInfo);

        res.json({
            success: true,
            message: 'Resume uploaded successfully!',
            file: {
                originalName: req.file.originalname,
                size: (req.file.size / 1024).toFixed(2) + ' KB',
                uploadDate: new Date().toLocaleString(),
                filename: req.file.filename
            },
            applicant: {
                name: fileInfo.applicantName,
                email: fileInfo.email,
                position: fileInfo.position
            }
        });
    });
});

// Get list of all uploaded resumes
app.get('/api/resumes', (req, res) => {
    const resumeList = uploadedResumes.map(resume => ({
        id: resume.id,
        applicantName: resume.applicantName,
        email: resume.email,
        position: resume.position,
        originalName: resume.originalName,
        size: (resume.size / 1024).toFixed(2) + ' KB',
        uploadDate: new Date(resume.uploadDate).toLocaleString(),
        downloadUrl: `/uploads/${resume.filename}`
    }));

    res.json({
        success: true,
        count: resumeList.length,
        resumes: resumeList
    });
});

// Download resume
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({
                    success: false,
                    error: 'Error downloading file'
                });
            }
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }
});

// Delete resume
app.delete('/api/resumes/:id', (req, res) => {
    const resumeId = parseInt(req.params.id);
    const resumeIndex = uploadedResumes.findIndex(resume => resume.id === resumeId);

    if (resumeIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Resume not found'
        });
    }

    const resume = uploadedResumes[resumeIndex];
    const filePath = path.join(__dirname, 'uploads', resume.filename);

    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Remove from array
    uploadedResumes.splice(resumeIndex, 1);

    res.json({
        success: true,
        message: 'Resume deleted successfully'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: 'Something went wrong on the server. Please try again.'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        details: 'The requested endpoint does not exist.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Job Portal Server running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`📋 Features:`);
    console.log(`   ✅ PDF file validation`);
    console.log(`   ✅ 2MB size limit`);
    console.log(`   ✅ Secure file storage`);
    console.log(`   ✅ Resume management`);
    console.log(`\n📝 API Endpoints:`);
    console.log(`   POST /upload-resume - Upload resume`);
    console.log(`   GET  /api/resumes   - List all resumes`);
    console.log(`   GET  /download/:filename - Download resume`);
    console.log(`   DELETE /api/resumes/:id - Delete resume`);
});

module.exports = app;