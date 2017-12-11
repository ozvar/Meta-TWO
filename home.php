<?php
    // connect to user database

    require './install.php';


    if (isset($_POST['login']) && $_POST['login'] == 'Login') {
        // check from the database

        $salt_stmt = $conn->prepare('SELECT salt FROM users WHERE username=:username');
        $salt_stmt->execute(array(':username' => $_POST['username']));
        // get the salt value
        $res = $salt_stmt->fetch();

        // get the correct salt value from the database and convert to readable
        $salt = ($res) ? $res[0] : '';
        // get the user input hash salt
        $salted = hash('sha256', $salt . $_POST['password']);

        $login_stmt = $conn->prepare('SELECT username, uid FROM users WHERE username=:username AND password=:password');
        $login_stmt->execute(array(':username' => $_POST['username'], ':password' => $salted));

        if ($user = $login_stmt->fetch()) {
            session_start();
            $_SESSION['username'] = $user['username'];
            $_SESSION['uid'] = $user['uid'];
            header('Location: game.php');
            exit();
        } else {
            // echo "<div class='ui message' style='text-align: center;'><p>Incorrect username or password!</p></div>";
            $err = 'Incorrect username or password';
        }
    } else if (isset($_POST['register']) && $_POST['register'] == 'Register') {
        header("Location:register.php");
        exit();
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
    <div id="menu">
        <ul>
            <li class="active"><a href="home.php">Tetris</a></li>
        </ul>
    </div>
    <?php if (isset($err)) echo "<p class='message'>".$err."</p>" ?>
    <div id="loginform">
        <form class="ui form" action="home.php" method="post">
            <label for="username">Username</label> <input type="text" name="username" placeholder="username" />
            <label for="password">Password</label><input type="password" name="password" placeholder="password" / >
          	<input class = "btn"  type="submit" name="login" value="Login" />
        </form>
    	<form action="register.php" method="POST">
    		<input class = "btn" type="submit" name="register" value="Register" />
        </form>
    </div>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</body>
</html>
