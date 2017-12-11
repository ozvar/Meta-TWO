<?php
// Logout
  session_start();
  if (empty($_SESSION['admin']) || !isset($_SESSION['admin'])) {
      header('Location: adminlogin.php');
      exit();
  } else {
      // directs to home page
      // wait for logout submit
      if (isset($_POST['logout']) && $_POST['logout'] == 'logout') {
          session_destroy();
          header('Location: adminlogin.php');
          exit();
      }

  }
  ?>


<!DOCTYPE html>
<html>
<head>
    <title>Tetris</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
</head>
<body>
    <form action="data.php" method="post">
            <input class = "btn" id = "right" type="submit" value="logout" name="logout"/>
    </form>
    <?php
        if (isset($_SESSION['username']) || !empty($_SESSION['username'])) {
            echo "<p style='float:right;'>Hello, ".$_SESSION['username']."</p>";
        }
    ?>
    <div id="menu">
        <ul>
            <li class="active"><a href="home.php">Tetris</a></li>
        </ul>

    </div>

    <div id='tables'>

        <h2>Game Data</h2>
        <!-- game table header -->
        <table id='games'>
            <tr class='head'>
                <th>SID</th>
                <th>ECID</th>
                <th>session</th>
                <th>game_type</th>
                <th>game_number</th>
                <th>episode_number</th>
                <th>level</th>
                <th>score</th>
                <th>lines_cleared</th>
            </tr>
        <?php
            // game information
            require './config.php';

            $servername = $config['DB_HOST'];
            $username = $config['DB_USERNAME'];
            $password = $config['DB_PASSWORD'];
            $dbname = "tetrisdb";

            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            echo "";
            // query from the database and show the data

            // later might set up a search function

            $stmt = $conn->query('SELECT * FROM `game` ORDER BY `session`,`SID`');
            $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($requests as $row){
                $sid = $row["SID"];
                $ecid = $row["ECID"];
                $session = $row["session"];
                $game_type = $row["game_type"];
                $game_number = $row["game_number"];
                $episode_number = $row["episode_number"];
                $level = $row["level"];
                $score = $row["score"];
                $lines_cleared = $row["lines_cleared"];
                // output everything
                echo "
                    <tr class='data'>
                        <td class='center'>$sid</td>
                        <td class='center'>$ecid</td>
                        <td class='center'>$session</td>
                        <td class='center'>$game_type</td>
                        <td class='center'>$game_number</td>
                        <td class='center'>$episode_number</td>
                        <td class='center'>$level</td>
                        <td class='center'>$score</td>
                        <td class='center'>$lines_cleared</td>
                    </tr>";
            }
            //reset the connection
            $conn = null;
        ?>
        </table>
    </div>

</body>
</html>
