<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Receipt</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <style>
        .total-row td {
            font-weight: bold;
            font-size: 1.3em;
            background-color: #ffeaa7;
        }
        </style>
</body>
</html>
<div class="container">
    <h1>Detailed Receipt</h1>
    <?php
    $totalSum = 0;
    echo '<table>';
    echo '<thead><tr><th>Product</th><th>Unit Price</th><th>Quantity</th><th>Subtotal</th></tr></thead>';
    echo '<tbody>';
    for ($i = 1; $i <= 3; $i++) {
        $product = htmlspecialchars($_POST["product$i"] ?? '');
        $price = filter_input(INPUT_POST, "price$i", FILTER_VALIDATE_FLOAT) ?: 0;
        $quantity = filter_input(INPUT_POST, "qtd$i", FILTER_VALIDATE_INT) ?: 0;
        if ($product !== '' & $quantity > 0 && $price > 0) {
            $subtotal = $price * $quantity;
            $totalSum += $subtotal;
            echo '<tr>';
            echo '<td>' . $product . '</td>';
            echo '<td>R$ ' . number_format($price, 2, ',', '.') . '</td>';
            echo '<td>' . $quantity . '</td>';
            echo '<td>R$ ' . number_format($subtotal, 2, ',', '.') . '</td>';
            echo '</tr>';
        }
    }
    echo '<tr class="total row">';
    echo '<td colspan="3">TOTAL SUM</td>';
    echo '<td>R$ ' . number_format($totalSum, 2, ',', '.') . '</td>';
    echo '</tr>';
    echo '<t/body>';
    echo '</table>';
    ?>
    <p style="text-align: center; margin-top: 30px;">
        <a href="Budget.html">New Budget</a></p>
</div>
</body>
</html>