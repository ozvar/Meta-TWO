<?php
    // connect to user database

    require './install_admin.php';


    if (isset($_POST['login']) && $_POST['login'] == 'Login') {
        // check from the database
        $salt_stmt = $conn->prepare('SELECT salt FROM admin WHERE username=:username');
        $salt_stmt->execute(array(':username' => $_POST['username']));
        // get the salt value
        $res = $salt_stmt->fetch();

        // get the correct salt value from the database and convert to readable
        $salt = ($res) ? $res[0] : '';
        // get the user input hash salt
        $salted = hash('sha256', $salt . $_POST['password']);

        $login_stmt = $conn->prepare('SELECT username, uid FROM admin WHERE username=:username AND password=:password');
        $login_stmt->execute(array(':username' => $_POST['username'], ':password' => $salted));

        if ($user = $login_stmt->fetch()) {
            // session for user login
            session_start();
            $_SESSION['username'] = $user['username'];
            $_SESSION['uid'] = $user['uid'];
            $_SESSION['admin'] = 'admin';
            header('Location: data.php');
            exit();
        } else {
            // not pass
            $err = 'Incorrect username or password';
        }
    }
 ?>
<!DOCTYPE html>
<html>
<head>
    <title>Tetris</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
    <div id="menu">
        <ul>
            <li class="active"><a href="home.php">Admin</a></li>
        </ul>
    </div>
    <!-- post data to adminlogin page -->
    <?php if (isset($err)) echo "<p class='message'>".$err."</p>" ?>
    <form class="ui form" action="adminlogin.php" method="post">
        <label for="username">Username</label> <input type="text" name="username" placeholder="username" />
        <label for="password">Password</label><input type="password" name="password" placeholder="password" / >
      	<input class="btn" type="submit" name="login" value="Login" />
	  </form>
    </body>
</html>
