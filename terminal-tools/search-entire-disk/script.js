document.addEventListener('DOMContentLoaded', function() {
    // Dynamically set the current year in the footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Dynamically set the domain name
    document.getElementById('domain-name').textContent = window.location.hostname || 'this page';

    const searchForm = document.getElementById('search-form');
    const resultsSection = document.getElementById('results-section');
    const resultsOutput = document.getElementById('results-output');
    const downloadBtn = document.getElementById('download-report');
    const resetBtn = document.getElementById('reset-all');

    // Handle form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default page reload

        const query = document.getElementById('search-query').value;
        const folder = document.getElementById('search-folder').value;

        // Display the results section and show a loading message
        resultsSection.classList.remove('d-none');
        resultsOutput.textContent = 'Searching... Please wait.';
        downloadBtn.classList.add('d-none'); // Hide download button initially

        // Prepare data for the backend
        const formData = new FormData();
        formData.append('query', query);
        formData.append('folder', folder);

        // Send data to the backend PHP script using Fetch API (AJAX)
        fetch('search_handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            resultsOutput.textContent = data;
            // Make the download button visible and set the data for download
            downloadBtn.classList.remove('d-none');
            downloadBtn.dataset.report = data;
        })
        .catch(error => {
            resultsOutput.textContent = 'An error occurred: ' + error.message;
        });
    });

    // Handle the download report button
    downloadBtn.addEventListener('click', function() {
        const reportData = this.dataset.report;
        if (reportData) {
            const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'search_report.txt');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Handle the reset button
    resetBtn.addEventListener('click', function() {
        // Clear form fields
        document.getElementById('search-query').value = '';
        document.getElementById('search-folder').value = '';

        // Hide results section
        resultsSection.classList.add('d-none');

        // Clear results data
        resultsOutput.textContent = '';
        downloadBtn.dataset.report = '';
    });

    // Add support for nested dropdowns
    document.querySelectorAll('.dropdown-menu .dropend').forEach(function(element) {
        element.addEventListener('mouseenter', function (e) {
            if (window.innerWidth > 991) { // Desktop view
                e.stopPropagation();
                const dropdownMenu = this.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    const dropdown = new bootstrap.Dropdown(this);
                    dropdown.show();
                }
            }
        });
        element.addEventListener('mouseleave', function (e) {
            if (window.innerWidth > 991) { // Desktop view
                const dropdown = bootstrap.Dropdown.getInstance(this);
                if (dropdown) {
                    dropdown.hide();
                }
            }
        });
    });
});