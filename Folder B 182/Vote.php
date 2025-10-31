<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ballots Results</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .scoreboard {
            margin-top: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .votes { font-weight: bold; color: #007bff;}
        .total { font-size: 1.2em; margin-top: 15px;}
        </style>
        </head>
        <body>
            <div class="container">
                <h1>Ballots Processed!</h1>
                <?php
                $arquive = 'Vote.txt';
                if (!file_exists($arquive)) {
                    file_put_contents($arquive, "0\n0");
                }
                if (isset($_POST['option'])) {
                    $chosen_vote = $_POST['option'];
                    $votes_data = file($arquive, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    $votes_Pizza = (int)($votes_data[0] ?? 0);
                    $votes_Burgers = (int)($votes_data[1] ?? 0);
                     if ($chosen_vote === 'Pizza') {
                        $votes_Pizza++;
                     } elseif ($chosen_vote === 'Burgers') {
                        $votes_Burgers++;
                     }
                     $new_content = $votes_Pizza . "\n" . $votes_Burgers;
                     file_put_contents($arquive, $new_content);
                     echo '<p style="color: green; font-weight: bold;">Your Vote in ' . htmlspecialchars($chosen_vote) . ' Was Registered Successfully!</p>';
                } else {
                    echo '<p style="color: orange;">No Votes Submitted. Showing Current Scoreboard.</p>';
                }
                $final_data = file($arquive, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                $final_Pizza = (int)($final_data[0] ?? 0);
                $final_Burgers = (int)($final_data[1] ?? 0);
                $total_votes = $final_Pizza + $final_Burgers;
                echo '<div class="scoreboard">';
                echo '<h2>Current Score</h2>';
                echo '<p>Pizza: <span class="votes">' . $final_Pizza . '</span>Votes</p>';
                echo '<p>Burgers: <span class="votes">' . $final_Burgers . '</span>Votes</p>';
                echo '<p class="total">Total Votes: ' . $total_votes . '</p>';
                echo '</div>';
                ?>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="Index.html">Back to Voting</a></p>
            </div>
</body>
</html>