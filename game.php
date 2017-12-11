<?php
    // Logout
    session_start();
    if (!isset($_SESSION['username']) || empty($_SESSION['username'])) {
        // directs to login page
        header('Location: home.php');
        exit();
    } else {
        // wait for logout submit
        if (isset($_POST['logout']) && $_POST['logout'] == 'logout') {
            session_destroy();
            header('Location: home.php');
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
    <link href="https://fonts.googleapis.com/css?family=Baloo+Bhaijaan|Open+Sans" rel="stylesheet">
</head>
<body>
    <form action="game.php" method="post">
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

    <div id="buttonLayout">
        <input class="btn" type="submit" onclick="playGame()" value="Play Now!" name="Play"/>
    </div>
    <div id="tetris"></div>

    <!-- js code at the end for higher effciency -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="src/phaser.min.js"></script>
    <script type="text/javascript" src="src/phaser-input.min.js"></script>
    <script type="text/javascript" src="src/MersenneTwister.js"></script>
    <script type="text/javascript" src="src/Board.js"></script>
    <script type="text/javascript" src="src/MetaTWO.js"></script>
    <script type="text/javascript" src="src/Boot.js"></script>
    <script type="text/javascript" src="src/Preloader.js"></script>
    <script type="text/javascript" src="src/MainMenu.js"></script>
    <script type="text/javascript" src="src/GameOver.js"></script>
    <script type="text/javascript" src="src/TimesUp.js"></script>
    <script type="text/javascript" src="src/Game.js"></script>
    <script type="text/javascript" src="src/Zoid.js"></script>
    <script type="text/javascript" src="src/Block.js"></script>
    <script type="text/javascript" src="src/homee.js"></script>
</body>
</html>
