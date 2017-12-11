<?php
  session_start();

  // Connect to the database
    require 'install.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // get data from login page
        try {
            if (isset($_POST['register'])) {


                if (!isset($_POST['username']) || !isset($_POST['password']) || !isset($_POST['confirm']) || empty($_POST['username']) || empty($_POST['password']) || empty($_POST['confirm'])) {
                    $msg = "Please fill in all form fields.";
                } else if ($_POST['password'] !== $_POST['confirm']) {
                    $msg = "Passwords must match.";
                } else {

                    //check if username is taken
                    $dup = $conn->prepare("SELECT username FROM users WHERE username=:username");
                    $dup->execute(array(':username' => $_POST['username']));

                    if ($num = $dup->fetch()) {
                        // echo "<div class='ui message' style='text-align: center;'><p>duplicated username, please try another one!</p></div>";
                        $msg = "duplicated username, please try another one!";
                    } else {
                        // Generate random salt
                        $salt = hash('sha256', uniqid(mt_rand(), true));

                        // Apply salt before hashing
                        $salted = hash('sha256', $salt . $_POST['password']);

                        // Store the salt with the password, so we can apply it again and check the result
                        $insert = $conn->prepare("INSERT INTO users (username, password, salt) VALUES (:username, :password, :salt)");
                        $insert->execute(array(':username' => $_POST['username'], ':password' => $salted, ':salt' => $salt));
                        header('Location: home.php');
                        exit();

                    }


                }
            } else if (isset($_POST['back']) && $_POST['back'] == 'Back') {
                header('Location: home.php');
                exit();
            }
        } catch(Exception $e) {
            $err[] = $e->getMessage();
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
    <div id="menu">
        <ul>
            <li class="active"><a href="home.php">Tetris</a></li>
        </ul>
    </div>
            <?php if (isset($msg)) echo "<p class = 'message'>".$msg."</p>" ?>
                <form class="ui form" action="register.php" method="post">
                    <!-- registration information -->
                    <label for="username">Username: </label> <input type="text" name="username" placeholder="username" />
                    <label for="password">Password: </label><input type="password" name="password" placeholder="password" / >
                    <label for="password">Confirm: </label><input type="password" name="confirm" placeholder="confirm" / >
                    <input class = "btn" type="submit" name="register" value="Register" />
                </form>

                <form action="home.php" method="POST">
					<!-- post to home page -->
					<input class = "btn" type="submit" name="back" value="Back" />
			    </form>

            </div>

        </div>

</body>
</html>
