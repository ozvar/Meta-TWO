<?php
    require './config.php';

    try {
        // set up connections
        $conn = new PDO("mysql:host=localhost",$config['DB_USERNAME'], $config['DB_PASSWORD']);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // create database called ...., everytime, conn needs to execute the commands
        $sqlcommand = "CREATE DATABASE IF NOT EXISTS tetrisdb_admin";
        $conn->exec($sqlcommand);
        $sqlcommand = "use tetrisdb_admin";
        $conn->exec($sqlcommand);
        // create table users that will store users credentials
        $usertable = "CREATE TABLE IF NOT EXISTS admin (
            uid int AUTO_INCREMENT PRIMARY KEY,
            username varchar(20),
            password varchar(256),
            salt varchar(256)
        )";
        $conn->exec($usertable);
    } catch(PDOException $e) {
        // echo 'ERROR: ' . $e->getMessage();
    }

 ?>
