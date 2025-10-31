<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Table</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <?php
        // CORRECTION 1: Check for the 'number' POST variable (from the form)
        // CORRECTION 2: Use the valid PHP function is_numeric()
        if (isset($_POST['number']) && is_numeric($_POST['number'])) {
            $number = (int)$_POST['number'];
            
            // Limit the table to a reasonable positive number (optional, but good practice)
            if ($number <= 0) {
                 echo '<h1>Error</h1>';
                 echo '<p style="color: red;">Please enter a positive number.</p>';
            } else {
                echo '<h1>Table of ' . htmlspecialchars($number) . '</h1>';
                echo '<table>';
                echo '<thead><tr><th>Operation</th><th>Result</th></tr></thead>';
                echo '<tbody>';
                
                // Generate the multiplication table up to 10
                for ($i = 1; $i <= 10; $i++) {
                    $result = $number * $i;
                    echo '<tr>';
                    echo '<td>' . $number . ' x ' . $i . '</td>';
                    echo '<td>' . $result . '</td>';
                    echo '</tr>';
                }
                echo '</tbody>';
                echo '</table>';
            }
        } else {
            echo '<h1>Error</h1>';
            echo '<p style="color: red;">Please Insert a Valid Number.</p>';
        }
        ?>
        <p style="text-align: center; margin-top: 30px;"><a href="Index.html">Generate New Table</a></p>
    </div>
</body>
</html>
<!-- Código corrigido pela IA Gemini !-->