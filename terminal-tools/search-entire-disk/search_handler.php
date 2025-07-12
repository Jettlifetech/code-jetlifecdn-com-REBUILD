<?php
// search_handler.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize user input
    $query = escapeshellarg(trim($_POST['query'] ?? ''));
    $folder = trim($_POST['folder'] ?? '');

    // Basic validation
    if (empty(trim($query, "'"))) {
        http_response_code(400);
        echo "Error: Search query cannot be empty.";
        exit;
    }

    // Default to a safe search directory if the user-provided one is empty or invalid
    $default_search_path = '/var/www/html'; // A safe, web-accessible directory
    $search_path = !empty($folder) && is_dir($folder) ? $folder : $default_search_path;
    $search_path_arg = escapeshellarg($search_path);

    // Path to your python script
    $python_script = '/var/www/scripts/search_script.py';

    // Build the command to execute
    $command = "sudo -u www-data {$python_script} {$query} {$search_path_arg}";

    // Execute the command and capture the output
    $output = shell_exec($command);
    
    // Return the output to the frontend
    header('Content-Type: text/plain');
    if ($output === null) {
        http_response_code(500);
        echo "Error: Failed to execute search script. Check server logs and permissions.";
    } else {
        echo $output;
    }
} else {
    http_response_code(405);
    echo "Error: Invalid request method.";
}
?>