# This file contains instructions on how to link any webpage (HTML, PHP) files to a dynamic navbar


## HTML Pages
Steps:
1. 
### JavaScript Fetch/Inject Method (For HTML Files)
    How it works:
        A small JS snippet fetches and injects the navbar HTML into a <div> (or directly into the body) on page load. This works for static .html files.

"How to implement:"

1. Add a target element in your HTML:
        ```<div id="navbar-container"></div>```
2. Place this JS snippet before your closing </body> tag
```<script>
document.addEventListener("DOMContentLoaded", function() {
  fetch('/global-navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
    });
});
</script>```

:: This fetches and injects the navbar at runtime.

## PHP Pages

### PHP Include Method (Best for PHP Files)
How it works:
PHP will include the navbar file at runtime on the server. Updates to the navbar are reflected everywhere.

How to implement:
<code>
<!-- At the place in your PHP file where you want the navbar -->
<?php include $_SERVER['DOCUMENT_ROOT'].'/global-navbar.html'; ?>
</code>
Place this line in every PHP file (header, layout, etc.) where you want the navbar.

Works only for files with .php extension, not plain .html.

