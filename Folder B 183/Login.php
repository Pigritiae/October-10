<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="page-wrapper">
        <div class="container">
            <h1>Restricted Access</h1>
            
            <?php
            // PHP logic to display error message if redirected from Authenticate.php
            if (isset($_GET['error']) && $_GET['error'] == 1) {
                echo '<p class="error-msg">Incorrect User or Password.</p>';
            }
            // Removed the empty <div id="error-placeholder"></div> as PHP handles the message
            ?>
            
            <form action="Authenticate.php" method="POST">
                <label for="user">User:</label>
                <input type="text" id="user" name="user" required>
                
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</body>
</html>
<!-- Códigos corrigidos pela IA Gemini !-->