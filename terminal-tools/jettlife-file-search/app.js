$(document).ready(function() {
    // Initialize the application
    initializeApp();
    
    // Initialize dropdown submenus
    initializeDropdowns();
    
    // Form submission handler
    $('#searchForm').on('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Reset button handler
    $('#resetBtn').on('click', function() {
        resetForm();
    });
    
    // Download button handler
    $('#downloadBtn').on('click', function() {
        downloadReport();
    });
});

// Initialize application
function initializeApp() {
    // Set current domain
    const currentDomain = window.location.hostname || 'localhost';
    $('#current-domain').text(currentDomain);
    
    // Set current year
    const currentYear = new Date().getFullYear();
    $('#currentYear').text(currentYear);
    
    // Add loading states and animations
    addButtonAnimations();
}

// Initialize dropdown submenus
function initializeDropdowns() {
    // Handle dropdown submenus
    $('.dropdown-submenu .dropdown-toggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $submenu = $(this).next('.dropdown-menu');
        $('.dropdown-submenu .dropdown-menu').not($submenu).removeClass('show');
        $submenu.toggleClass('show');
    });
    
    // Close submenus when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown-submenu').length) {
            $('.dropdown-submenu .dropdown-menu').removeClass('show');
        }
    });
}

// Add button animations and loading states
function addButtonAnimations() {
    // Add pulse animation to primary buttons
    $('.btn-primary').addClass('pulse');
    
    // Remove pulse on hover
    $('.btn').hover(
        function() {
            $(this).removeClass('pulse');
        },
        function() {
            if ($(this).hasClass('btn-primary')) {
                $(this).addClass('pulse');
            }
        }
    );
}

// Perform search simulation
function performSearch() {
    const searchTerm = $('#searchTerm').val().trim();
    const searchFolder = $('#searchFolder').val().trim();
    
    if (!searchTerm) {
        alert('Please enter a search term.');
        return;
    }
    
    // Show loading state
    const $submitBtn = $('#searchForm button[type="submit"]');
    const originalText = $submitBtn.html();
    $submitBtn.html('<span class="loading"></span> Searching...');
    $submitBtn.prop('disabled', true);
    
    // Simulate search delay
    setTimeout(function() {
        // Generate mock search results
        const results = generateMockResults(searchTerm, searchFolder);
        
        // Display results
        displayResults(results, searchTerm, searchFolder);
        
        // Reset button state
        $submitBtn.html(originalText);
        $submitBtn.prop('disabled', false);
        
        // Show results section
        $('#resultsSection').slideDown(500);
        
        // Scroll to results
        $('html, body').animate({
            scrollTop: $('#resultsSection').offset().top - 100
        }, 500);
        
    }, 2000); // 2 second delay to simulate processing
}

// Generate mock search results
function generateMockResults(searchTerm, searchFolder) {
    const basePath = searchFolder || '/home/user';
    const extensions = ['.txt', '.js', '.html', '.css', '.json', '.md', '.log', '.config'];
    const folders = ['documents', 'downloads', 'projects', 'config', 'logs', 'backup'];
    
    const results = [];
    const totalFiles = Math.floor(Math.random() * 50) + 20; // 20-70 files searched
    const foundFiles = Math.floor(Math.random() * 15) + 5; // 5-20 files found
    
    // Generate found files
    for (let i = 0; i < foundFiles; i++) {
        const folder = folders[Math.floor(Math.random() * folders.length)];
        const extension = extensions[Math.floor(Math.random() * extensions.length)];
        const fileName = `${searchTerm.toLowerCase()}_${i + 1}${extension}`;
        const fullPath = `${basePath}/${folder}/${fileName}`;
        
        results.push({
            fullPath: fullPath,
            fileName: fileName,
            size: (Math.random() * 1000).toFixed(2) + ' KB',
            modified: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
    }
    
    return {
        searchTerm: searchTerm,
        searchFolder: searchFolder,
        totalFilesSearched: totalFiles,
        filesFound: foundFiles,
        results: results,
        searchTime: (Math.random() * 3 + 0.5).toFixed(2) + ' seconds'
    };
}

// Display search results
function displayResults(results, searchTerm, searchFolder) {
    // Update search stats
    const statsHtml = `
        <h4><i class="fas fa-chart-bar me-2"></i>Search Statistics</h4>
        <div class="row">
            <div class="col-md-6">
                <div class="stat-item">
                    <span>Search Term:</span>
                    <span class="stat-value">${results.searchTerm}</span>
                </div>
                <div class="stat-item">
                    <span>Search Folder:</span>
                    <span class="stat-value">${results.searchFolder || 'All directories'}</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="stat-item">
                    <span>Total Files Searched:</span>
                    <span class="stat-value">${results.totalFilesSearched}</span>
                </div>
                <div class="stat-item">
                    <span>Files Found:</span>
                    <span class="stat-value">${results.filesFound}</span>
                </div>
                <div class="stat-item">
                    <span>Search Time:</span>
                    <span class="stat-value">${results.searchTime}</span>
                </div>
            </div>
        </div>
    `;
    
    $('#searchStats').html(statsHtml);
    
    // Update results table
    const tableBody = $('#resultsTableBody');
    tableBody.empty();
    
    if (results.results.length > 0) {
        results.results.forEach(function(file, index) {
            const row = `
                <tr style="animation-delay: ${index * 0.1}s">
                    <td class="text-break">${file.fullPath}</td>
                    <td>${file.fileName}</td>
                    <td>${file.size}</td>
                    <td>${file.modified}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    } else {
        tableBody.append(`
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="fas fa-search me-2"></i>No files found matching your search criteria.
                </td>
            </tr>
        `);
    }
    
    // Store results for download
    window.currentResults = results;
}

// Download report functionality
function downloadReport() {
    if (!window.currentResults) {
        alert('No results to download.');
        return;
    }
    
    const results = window.currentResults;
    let csvContent = '';
    
    // Add header information
    csvContent += 'JETTLIFE Tech - File Search Report\n';
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;
    csvContent += `Search Term: ${results.searchTerm}\n`;
    csvContent += `Search Folder: ${results.searchFolder || 'All directories'}\n`;
    csvContent += `Total Files Searched: ${results.totalFilesSearched}\n`;
    csvContent += `Files Found: ${results.filesFound}\n`;
    csvContent += `Search Time: ${results.searchTime}\n`;
    csvContent += '\n';
    
    // Add CSV headers
    csvContent += 'File Path,File Name,Size,Modified Date\n';
    
    // Add results data
    results.results.forEach(function(file) {
        csvContent += `"${file.fullPath}","${file.fileName}","${file.size}","${file.modified}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `file_search_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show download success message
    showNotification('Report downloaded successfully!', 'success');
}

// Reset form and hide results
function resetForm() {
    // Clear form fields
    $('#searchTerm').val('');
    $('#searchFolder').val('');
    
    // Hide results section
    $('#resultsSection').slideUp(500);
    
    // Clear stored results
    window.currentResults = null;
    
    // Show reset success message
    showNotification('Form reset successfully!', 'info');
    
    // Scroll to top
    $('html, body').animate({
        scrollTop: 0
    }, 500);
}

// Show notification (toast-like message)
function showNotification(message, type) {
    const notification = $(`
        <div class="notification notification-${type}">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            ${message}
        </div>
    `);
    
    // Add notification styles
    notification.css({
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        opacity: 0,
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    $('body').append(notification);
    
    // Animate in
    setTimeout(() => {
        notification.css({
            opacity: 1,
            transform: 'translateX(0)'
        });
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.css({
            opacity: 0,
            transform: 'translateX(100%)'
        });
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'bell';
    }
}

// Get notification color based on type
function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'linear-gradient(135deg, #00D4FF, #00F5FF)';
        case 'error': return 'linear-gradient(135deg, #FF6B9D, #FF5722)';
        case 'warning': return 'linear-gradient(135deg, #FFA726, #FF9800)';
        case 'info': return 'linear-gradient(135deg, #6C5CE7, #A29BFE)';
        default: return 'linear-gradient(135deg, #6C5CE7, #A29BFE)';
    }
}

// Add smooth scrolling to all anchor links
$('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    
    const target = $(this.getAttribute('href'));
    if (target.length) {
        $('html, body').animate({
            scrollTop: target.offset().top - 100
        }, 500);
    }
});

// Add parallax effect to background
$(window).on('scroll', function() {
    const scrolled = $(this).scrollTop();
    const parallax = $('.animated-bg');
    const speed = scrolled * 0.5;
    
    parallax.css('transform', `translateY(${speed}px)`);
});

// Add typing effect to the main heading
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
$(window).on('load', function() {
    const heading = document.querySelector('.content-box h1');
    if (heading) {
        const originalText = heading.textContent;
        typeWriter(heading, originalText, 150);
    }
});

// Add loading animation to navbar logo
$('.navbar-logo').on('load', function() {
    $(this).addClass('loaded');
});

// Handle form validation with custom styling
$('#searchForm input[required]').on('blur', function() {
    const $input = $(this);
    const $label = $input.prev('label');
    
    if ($input.val().trim() === '') {
        $input.addClass('is-invalid');
        $label.addClass('text-danger');
    } else {
        $input.removeClass('is-invalid').addClass('is-valid');
        $label.removeClass('text-danger').addClass('text-success');
    }
});

// Clear validation states on focus
$('#searchForm input').on('focus', function() {
    $(this).removeClass('is-invalid is-valid');
    $(this).prev('label').removeClass('text-danger text-success');
});

// Add enter key support for form submission
$('#searchForm input').on('keypress', function(e) {
    if (e.which === 13) {
        $('#searchForm').submit();
    }
});

// Add escape key support for closing notifications
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        $('.notification').fadeOut(300);
    }
});