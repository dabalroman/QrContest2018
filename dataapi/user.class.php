<?php

require_once("dbconnection.class.php");

const SALT = "$2y$10$410ehabvJ2J5AWrtO2wWCu0pW8lHaM7GQPgT63J.ITRbyirKgZ.mS";

class User
{
    private $ID;
    private $login;
    private $points;
    private $name;
    private $signUpTime;
    private $lastOnlineTime;
    private $type = 0;

    private $active = false;

    private $conn;
    private $init = false;
    private $err = false;

    public function __construct()
    {
        $this->conn = new DBConnection();
    }

    public function load($userID)
    {
        $this->ID = $userID;
        if ($this->loadData() == 0)
            $this->init = true;
    }

    static public function signUp($login, $name, $class, $password)
    {
        $passwordCrypt = crypt(htmlentities($password, ENT_QUOTES, "UTF-8"), SALT);
        $conn = new DBConnection();

        if (User::exists($login))
            return 2;

        $sql = "
            INSERT INTO users(name, login, class, password, points, signuptime, lastonlinetime, type) 
            VALUES ('$name', '$login', '$class', '$passwordCrypt', 0, NOW(), NOW(), 0)
        ";

        $conn->db->query($sql);
        if ($conn->db->insert_id)
            return 0;
        return 1;
    }

    static public function create($login, $name, $class, $password)
    {
        return self::signUp($login, $name, $class, $password);
    }

    public function signIn($login, $password)
    {
        $passwordCrypt = crypt(htmlentities($password, ENT_QUOTES, "UTF-8"), SALT);

        $sql = "
            SELECT id
            FROM users
            WHERE login = '$login' AND password = '$passwordCrypt'
        ";

        $result = $this->conn->db->query($sql);

        if (!$result->num_rows)
            return 1;

        $result = $result->fetch_assoc();

        $this->load($result["id"]);
        $this->active = true;
        $this->updateOnlineTimestamp();

        return 0;
    }

    static public function exists($login)
    {
        $conn = new DBConnection();

        $sql = "
            SELECT id
            FROM users
            WHERE login = '$login'
        ";

        $result = $conn->db->query($sql);

        return ($result->num_rows) ? true : false;
    }

    public function signOut()
    {
        $this->active = false;
        return 0;
    }

    private function loadData()
    {
        $sql = "
            SELECT *
            FROM users
            WHERE id = '$this->ID'
        ";

        $result = $this->conn->db->query($sql);

        if (!$result) {
            $this->err = true;
            return 1;
        }

        $result = $result->fetch_assoc();
        $this->login = $result['login'];
        $this->name = $result['name'];
        $this->points = $result['points'];
        $this->type = $result['type'];
        $this->signUpTime = $result["signuptime"];
        $this->lastOnlineTime = $result["lastonlinetime"];

        return 0;
    }

    public function updateOnlineTimestamp()
    {
        $sql = "
            UPDATE users 
            SET lastonlinetime = NOW() 
            WHERE id = '$this->ID'
        ";

        $this->conn->db->query($sql);
        $this->loadData();
    }

    function updatePoints()
    {
        $points = 0;
        $sql = "
            SELECT SUM(qr.value) AS 'points'
            FROM user_qr
            INNER JOIN qr ON user_qr.id_qr = qr.id
            WHERE user_qr.id_user = $this->ID
        ";

        $result = $this->conn->db->query($sql);

        if (!$result)
            return 1;

        $result = $result->fetch_assoc();
        $points += intval($result["points"]);

        $sql = "
            SELECT SUM(question.points) AS 'points'
            FROM user_question
            INNER JOIN question on user_question.id_question = question.id
            WHERE user_question.id_user = $this->ID AND user_question.answer = 1
        ";

        $result = $this->conn->db->query($sql);

        if (!$result)
            return 1;

        $result = $result->fetch_assoc();
        $points += intval($result["points"]);

        $sql = "
          UPDATE `users` 
          SET `points` = $points
          WHERE users.id = $this->ID
        ";

        $this->conn->db->query($sql);

        $this->loadData();
        return 0;
    }

    static public function getUsersIDs()
    {
        $conn = new DBConnection();

        $sql = "
            SELECT id
            FROM users
        ";

        $result = $conn->db->query($sql);

        if (!$result)
            return 1;

        $data = [];
        while ($row = $result->fetch_assoc())
            array_push($data, $row["id"]);

        return $data;
    }

    static public function updatePointsForAll()
    {
        foreach (USER::getUsersIDs() as $id) {
            $user = new User();
            $user->load($id);
            $user->updatePoints();
        }
    }

    static public function getRanking()
    {
        USER::updatePointsForAll();
        $conn = new DBConnection();

        $sql = "
            SELECT login, class, points
            FROM users
            ORDER BY points DESC
        ";

        $result = $conn->db->query($sql);

        if (!$result)
            return 1;

        $data = [];
        while ($row = $result->fetch_assoc())
            array_push($data, [
                "login" => $row["login"],
                "class" => $row["class"],
                "points" => ($row["points"] == null) ? 0 : $row["points"]
            ]);

        return $data;
    }

    static public function remove($login)
    {
        $conn = new DBConnection();

        if (!User::exists($login))
            return 2;

        $sql = "
            DELETE FROM users 
            WHERE login = '$login'
        ";

        $conn->db->query($sql);
        return 0;
    }

    public function setType($type)
    {
        $sql = "
            UPDATE users 
            SET type = $type
            WHERE id = '$this->ID'
        ";

        $this->conn->db->query($sql);
        $this->loadData();
    }

    public function setPoints($points)
    {
        $sql = "
            UPDATE users 
            SET points = $points
            WHERE id = '$this->ID'
        ";

        $this->conn->db->query($sql);
        $this->loadData();
    }

    public function getData()
    {
        return [
            "ID" => intval($this->ID),
            "name" => $this->name,
            "login" => $this->login,
            "points" => intval(($this->points == null) ? 0 : $this->points),
            "signUpTime" => $this->signUpTime,
            "lastOnlineTime" => $this->lastOnlineTime,
            "type" => intval($this->type),
            "active" => intval($this->active)
        ];
    }

    /**
     * @return integer
     */
    public function getID()
    {
        return $this->ID;
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return $this->active;
    }

    /**
     * @param bool $active
     */
    public function setActive($active)
    {
        $this->active = $active;
    }
}