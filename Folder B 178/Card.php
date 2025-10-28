<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Calling Card</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Calling Card Generated Successfully!</h1>
        <?php
        // 1. Corrected $_post to $_POST (superglobal is uppercase)
        if (isset($_POST['name'], $_POST['occupation'])) { 
            $name = $_POST['name'];
            $occupation = $_POST['occupation'];
            $phone = $_POST['phone'];
            $color = $_POST['color'];
            
            // 2. Corrected 'soli' to 'solid' in the inline style
            echo '<div class="card" style="border-top: 5px solid ' . htmlspecialchars($color) . ';">'; 
            
            // The line for color accent
            echo '<div class="line" style="background-color: ' . htmlspecialchars($color) . ';"></div>';
            
            echo '<h2>' . htmlspecialchars($name) . '</h2>';
            
            // 3. Corrected $_color to $color 
            echo '<p style="color: ' . htmlspecialchars($color) . '; font-weight: bold;">' . htmlspecialchars($occupation) . '</p>';
            
            echo '<hr>';
            
            echo '<p>&#9990; ' . htmlspecialchars($phone) . '</p>';
            
            // 4. Corrected 'alery' to 'alert' in the JavaScript
            // You may also want to use a more robust copy-to-clipboard function in a real app
            echo '<p style="margin-top: 20px; font-size: 0.9em; cursor: pointer;" onclick="alert(\'Copied Data!\')">Click to Copy</p>'; 
            
            // 5. Added the closing </div> for the card
            echo '</div>'; 
            
        } else {
            echo '<p style="color: red;">Error: No Form Data Received. Please Fill the Form.</p>';
        }
        ?>
        <p style="text-align: center; margin-top: 30px;"><a href="index.html">Create New Card</a></p>

    </div>
</body>
</html>
<!--Códigos corrigidos pela IA Gemini !-->