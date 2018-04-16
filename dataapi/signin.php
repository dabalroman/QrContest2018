<?php

session_start();

require_once "dbconnection.class.php";

$login = htmlentities($_POST["login"], ENT_QUOTES, "UTF-8");
$salt = "$2y$10$410ehabvJ2J5AWrtO2wWCu0pW8lHaM7GQPgT63J.ITRbyirKgZ.mS";
$password = crypt(htmlentities($_POST["password"], ENT_QUOTES, "UTF-8"), $salt);
$time = date("Y-m-d H:i:s");

$conn = new DBConnection();

$sql = "
    SELECT * 
    FROM users 
    WHERE login='$login' AND password='$password'
";

if ($result = $conn->db->query($sql)) {
    $userExists = $result->num_rows;
    if ($userExists) {
        $row = $result->fetch_assoc();
        $_SESSION["username"] = $row["login"];
        $_SESSION["userid"] = $row["id"];
        $_SESSION["superuser"] = $row["superuser"];

        $sql = "UPDATE users SET lastonlinetime = '$time' WHERE users.id = '" . $row["ID"] . "'";
        @$conn->query($sql);

        $_SESSION["logged"] = true;
        unset($_SESSION['error']);

        //Handle code from session
        if (isset($_SESSION["code"])) {
            header('Location: collectqr.php?code=' . $_SESSION["code"]);
            unset($_SESSION['code']);
        } else {
            header('Location: index.php?src=login&out=ok_user_logged');
        }

    } else {
        $_SESSION["logged"] = false;
        $_SESSION["error"] = "login_err";
        header('Location: index.php?src=login&out=err_db');
    }
    $result->free_result();
}