<?php

// Ideally, this data would come from a secure database
$correct_user = "admin";
$correct_password = "123456";

// Use the null coalescing operator to safely access POST data
$user_typed = $_POST['user'] ?? '';
$password_typed = $_POST['password'] ?? '';

// Check credentials
if ($user_typed === $correct_user && $password_typed === $correct_password) { 
    
    // --- USER IS AUTHENTICATED: Display the restricted content ---
    
    // Note: In a real-world app, you would start a session here (session_start(); $_SESSION['logged_in'] = true;)
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restricted Area</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="page-wrapper">
        <div class="container wide"> 
            <h1>Welcome, <?php echo htmlspecialchars($user_typed); ?>!</h1>
            <div class="secret">
                <h2>SECRET MESSAGE</h2>
                <p>PHP Lets Only Authorized Users Access this Information!</p>
            </div>
            <p style="text-align: center; margin-top: 30px;">
                <a href="Login.php">Logout</a>
            </p>
        </div>
    </div>
</body>
</html>
<?php
} else {
    // --- AUTHENTICATION FAILED: Redirect back to the login page with an error ---
    
    // CORRECTION: Ensure redirection is consistent with the login page filename (Login.php)
    header("Location: Login.php?error=1");
    exit;
}
?>