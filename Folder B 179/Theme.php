<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Theme Switcher</title>
    <?php
    // Default theme is 'light'
    $theme = 'light';
    
    // Check if the 'theme' GET parameter is set
    if (isset($_GET['theme'])) {
        // Corrected: Use square brackets [] to access the $_GET array
        // We're also using htmlspecialchars to prevent XSS (Good practice!)
        $theme = htmlspecialchars($_GET['theme']);
    }

    // Determine which stylesheet to link
    // Only link dark.css if $theme is exactly 'dark', otherwise link light.css
    if ($theme === 'dark') {
        echo '<link rel="stylesheet" href="dark.css">';
    } else {
        echo '<link rel="stylesheet" href="light.css">';
    }
    ?>
</head>
<body>
    <div class="container">
        <h1>Page Title</h1>
        <p>This is the main Content. Look at How PHP Changes the Stylesheet!</p>
        <div class="options">
            <a href="Theme.php?theme=light" class="btn light">Light Theme</a>
            <a href="Theme.php?theme=dark" class="btn dark">Dark Theme</a>
        </div>
    </div>
</body>
</html>
<!-- Código corrigido pela IA Gemini !-->