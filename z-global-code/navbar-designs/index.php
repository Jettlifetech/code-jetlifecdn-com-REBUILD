<?php
define('NAVBAR_PATH', '/var/www/global_files/navbar.php');
define('FOOTER_PATH', '/var/www/global_files/footer.php');

// Function to get directory contents
function getDirectoryContents($dir) {
    $contents = array_diff(scandir($dir), ['.', '..', basename(__FILE__)]);
    $data = [];
    foreach ($contents as $item) {
        $path = realpath($dir . DIRECTORY_SEPARATOR . $item);
        $data[] = [
            'name' => $item,
            'is_dir' => is_dir($path),
            'last_modified' => filemtime($path),
            'path' => $path
        ];
    }
    return $data;
}

$currentDir = realpath(__DIR__);
$folderName = basename($currentDir);
$contents = getDirectoryContents($currentDir);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Index - <?= htmlspecialchars($folderName) ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: #fff; }
        h1, .table th { font-family: 'Orbitron', sans-serif; }
        .jumbotron { background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 2rem; }
        .table-striped tbody tr:nth-of-type(odd) { background-color: rgba(255, 255, 255, 0.05); }
        .table-striped tbody tr:hover { background-color: rgba(255, 255, 255, 0.15); }
        button, a { transition: transform 0.2s ease, background-color 0.2s ease; }
        button:hover, a:hover { transform: scale(1.05); background-color: rgba(255, 255, 255, 0.2) !important; }
    </style>
</head>
<body>
    <div id="navbar-container"><?php include NAVBAR_PATH; ?></div>
    <div class="container mt-4">
        <div class="jumbotron text-center">
            <h1>Current Folder: <?= htmlspecialchars($folderName) ?></h1>
        </div>
    </div>
    <div class="container mt-4">
        <div class="table-responsive">
            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col" class="sortable" data-sort="name">File/Folder Name</th>
                        <th scope="col" class="sortable" data-sort="last_modified">Last Updated</th>
                        <th scope="col">Action</th>
                        <th scope="col">Download</th>
                    </tr>
                </thead>
                <tbody id="file-list">
                    <?php foreach ($contents as $item): ?>
                        <tr>
                            <td><i class="fa <?= $item['is_dir'] ? 'fa-folder' : 'fa-file' ?>"></i> <?= htmlspecialchars($item['name']) ?></td>
                            <td><?= date('m/d/Y h:i:s A', $item['last_modified']) ?> CDT</td>
                            <td>
                                <?php if ($item['is_dir']): ?>
                                    <a href="<?= htmlspecialchars($item['name']) ?>" class="btn btn-primary btn-sm" target="_blank">Open Folder</a>
                                <?php else: ?>
                                    <a href="<?= htmlspecialchars($item['name']) ?>" class="btn btn-secondary btn-sm" target="_blank">View File</a>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($item['is_dir']): ?>
                                    <a href="<?= htmlspecialchars('/var/www/global_files/zip_folder.php?folder=' . urlencode($item['name'])) ?>" class="btn btn-success btn-sm">Download</a>
                                <?php else: ?>
                                    <a href="<?= htmlspecialchars($item['name']) ?>" class="btn btn-success btn-sm" download>Download</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    <div id="footer-container" class="mt-4"><?php include FOOTER_PATH; ?></div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
