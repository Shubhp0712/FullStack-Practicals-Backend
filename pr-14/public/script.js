// Job Portal Resume Upload - JavaScript
class JobPortal {
    constructor() {
        this.init();
        this.bindEvents();
        this.loadResumes();
    }

    init() {
        this.uploadForm = document.getElementById('uploadForm');
        this.fileInput = document.getElementById('resume');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.uploadResult = document.getElementById('uploadResult');
        this.resumesList = document.getElementById('resumesList');
        this.totalResumesEl = document.getElementById('totalResumes');
        this.todayUploadsEl = document.getElementById('todayUploads');

        // Navigation
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');

        // Modal
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmYes = document.getElementById('confirmYes');
        this.confirmNo = document.getElementById('confirmNo');

        // Form validation
        this.updateSubmitButton();
    }

    bindEvents() {
        // Form submission
        this.uploadForm.addEventListener('submit', (e) => this.handleUpload(e));

        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Form inputs change for validation
        const formInputs = this.uploadForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updateSubmitButton());
        });

        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Modal events
        this.confirmNo.addEventListener('click', () => this.closeModal());
        this.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) this.closeModal();
        });

        // File drag & drop
        const fileDisplay = document.querySelector('.file-input-display');
        fileDisplay.addEventListener('dragover', (e) => this.handleDragOver(e));
        fileDisplay.addEventListener('drop', (e) => this.handleDrop(e));

        // Remove file button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-file')) {
                this.removeFile();
            }
        });
    }

    // Navigation handling
    handleNavigation(e) {
        e.preventDefault();
        const targetSection = e.target.getAttribute('href').substring(1);

        // Update active nav link
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');

        // Show/hide sections
        this.sections.forEach(section => {
            if (section.id === targetSection) {
                section.style.display = 'block';
                section.classList.add('fade-in');
            } else {
                section.style.display = 'none';
                section.classList.remove('fade-in');
            }
        });

        // Load resumes if switching to resumes section
        if (targetSection === 'resumes') {
            this.loadResumes();
        }
    }

    // File handling
    handleFileSelect(e) {
        const file = e.target.files[0];
        this.displayFileInfo(file);
        this.updateSubmitButton();
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.file-input-display').style.borderColor = 'var(--primary-color)';
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const fileDisplay = e.target.closest('.file-input-display');
        fileDisplay.style.borderColor = 'var(--border-color)';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];

            // Validate file type
            if (file.type !== 'application/pdf') {
                this.showToast('Only PDF files are allowed!', 'error');
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showToast('File size must be less than 2MB!', 'error');
                return;
            }

            // Set file to input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            this.fileInput.files = dataTransfer.files;

            this.displayFileInfo(file);
            this.updateSubmitButton();
        }
    }

    displayFileInfo(file) {
        const filePlaceholder = document.querySelector('.file-placeholder');
        const fileInfo = document.querySelector('.file-info');

        if (file) {
            // Validate file
            if (file.type !== 'application/pdf') {
                this.showToast('Only PDF files are allowed!', 'error');
                this.removeFile();
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.showToast('File size must be less than 2MB!', 'error');
                this.removeFile();
                return;
            }

            // Show file info
            filePlaceholder.style.display = 'none';
            fileInfo.style.display = 'flex';

            document.querySelector('.file-name').textContent = file.name;
            document.querySelector('.file-size').textContent = this.formatFileSize(file.size);
        } else {
            this.removeFile();
        }
    }

    removeFile() {
        const filePlaceholder = document.querySelector('.file-placeholder');
        const fileInfo = document.querySelector('.file-info');

        filePlaceholder.style.display = 'flex';
        fileInfo.style.display = 'none';

        this.fileInput.value = '';
        this.updateSubmitButton();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Form validation
    updateSubmitButton() {
        const submitBtn = this.uploadForm.querySelector('.upload-btn');
        const requiredFields = this.uploadForm.querySelectorAll('[required]');

        let allValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allValid = false;
            }
        });

        submitBtn.disabled = !allValid;
    }

    // Upload handling
    async handleUpload(e) {
        e.preventDefault();

        const formData = new FormData(this.uploadForm);
        const submitBtn = this.uploadForm.querySelector('.upload-btn');

        // Show progress
        this.showProgress();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        try {
            const response = await fetch('/upload-resume', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showUploadSuccess(result);
                this.uploadForm.reset();
                this.removeFile();
                this.updateSubmitButton();
            } else {
                this.showUploadError(result.error, result.details);
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showUploadError('Network error occurred', 'Please check your connection and try again.');
        } finally {
            this.hideProgress();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Resume';
        }
    }

    showProgress() {
        this.uploadProgress.style.display = 'block';
        this.uploadResult.style.display = 'none';

        // Animate progress bar
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = '0%';

        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 100);
    }

    hideProgress() {
        setTimeout(() => {
            this.uploadProgress.style.display = 'none';
        }, 500);
    }

    showUploadSuccess(result) {
        this.uploadResult.className = 'upload-result success';
        this.uploadResult.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success-color);"></i>
            </div>
            <h3>Resume Uploaded Successfully!</h3>
            <p>Your resume has been uploaded and is ready for review.</p>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md);">
                <strong>File:</strong> ${result.file.originalName}<br>
                <strong>Size:</strong> ${result.file.size}<br>
                <strong>Applicant:</strong> ${result.applicant.name}<br>
                <strong>Position:</strong> ${result.applicant.position}
            </div>
        `;
        this.uploadResult.style.display = 'block';

        this.showToast('Resume uploaded successfully!', 'success');

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            this.uploadResult.style.display = 'none';
        }, 5000);
    }

    showUploadError(error, details) {
        this.uploadResult.className = 'upload-result error';
        this.uploadResult.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color);"></i>
            </div>
            <h3>Upload Failed</h3>
            <p><strong>Error:</strong> ${error}</p>
            ${details ? `<p><small>${details}</small></p>` : ''}
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-md);">
                <strong>Requirements:</strong><br>
                • File must be PDF format<br>
                • Maximum size: 2MB<br>
                • All form fields required
            </div>
        `;
        this.uploadResult.style.display = 'block';

        this.showToast(error, 'error');
    }

    // Resume management
    async loadResumes() {
        const loadingEl = document.getElementById('resumesLoading');
        loadingEl.style.display = 'block';

        try {
            const response = await fetch('/api/resumes');
            const result = await response.json();

            if (result.success) {
                this.displayResumes(result.resumes);
                this.updateStats(result.resumes);
            } else {
                this.showToast('Failed to load resumes', 'error');
            }
        } catch (error) {
            console.error('Load resumes error:', error);
            this.showToast('Network error loading resumes', 'error');
        } finally {
            loadingEl.style.display = 'none';
        }
    }

    displayResumes(resumes) {
        const loadingEl = document.getElementById('resumesLoading');

        if (resumes.length === 0) {
            this.resumesList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-inbox"></i>
                    No resumes uploaded yet. Upload your first resume!
                </div>
            `;
            return;
        }

        const resumesHTML = resumes.map(resume => `
            <div class="resume-item">
                <div class="resume-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="resume-details">
                    <h4>${this.escapeHtml(resume.applicantName)}</h4>
                    <p><i class="fas fa-envelope"></i> ${this.escapeHtml(resume.email)}</p>
                    <p><i class="fas fa-briefcase"></i> ${this.escapeHtml(resume.position)}</p>
                    <p><i class="fas fa-file"></i> ${this.escapeHtml(resume.originalName)}</p>
                </div>
                <div class="resume-meta">
                    <p><strong>Size:</strong> ${resume.size}</p>
                    <p><strong>Uploaded:</strong> ${resume.uploadDate}</p>
                </div>
                <div class="resume-actions">
                    <a href="${resume.downloadUrl}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-download"></i> Download
                    </a>
                    <button onclick="jobPortal.deleteResume(${resume.id})" class="btn btn-danger">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        this.resumesList.innerHTML = resumesHTML;
    }

    updateStats(resumes) {
        this.totalResumesEl.textContent = resumes.length;

        // Count today's uploads
        const today = new Date().toDateString();
        const todayUploads = resumes.filter(resume => {
            const uploadDate = new Date(resume.uploadDate.split(',')[0]).toDateString();
            return uploadDate === today;
        }).length;

        this.todayUploadsEl.textContent = todayUploads;
    }

    // Delete resume
    deleteResume(resumeId) {
        const resumeElement = event.target.closest('.resume-item');
        const applicantName = resumeElement.querySelector('h4').textContent;

        this.showConfirmModal(
            `Are you sure you want to delete the resume for "${applicantName}"?`,
            async () => {
                try {
                    const response = await fetch(`/api/resumes/${resumeId}`, {
                        method: 'DELETE'
                    });

                    const result = await response.json();

                    if (result.success) {
                        this.showToast('Resume deleted successfully', 'success');
                        this.loadResumes(); // Reload the list
                    } else {
                        this.showToast('Failed to delete resume', 'error');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    this.showToast('Network error occurred', 'error');
                }
            }
        );
    }

    // Modal handling
    showConfirmModal(message, onConfirm) {
        document.getElementById('confirmMessage').textContent = message;
        this.confirmModal.style.display = 'flex';

        // Remove previous event listeners
        const newConfirmYes = this.confirmYes.cloneNode(true);
        this.confirmYes.parentNode.replaceChild(newConfirmYes, this.confirmYes);
        this.confirmYes = newConfirmYes;

        this.confirmYes.addEventListener('click', () => {
            onConfirm();
            this.closeModal();
        });
    }

    closeModal() {
        this.confirmModal.style.display = 'none';
    }

    // Toast notifications
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' :
                'fa-exclamation-triangle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);

        // Remove on click
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
let jobPortal;
document.addEventListener('DOMContentLoaded', () => {
    jobPortal = new JobPortal();
});

// Global functions for event handlers
window.jobPortal = {
    deleteResume: (id) => jobPortal.deleteResume(id)
};