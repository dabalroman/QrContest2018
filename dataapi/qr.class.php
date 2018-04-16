<?php

require_once("dbconnection.class.php");
require_once("user.class.php");

class QR
{
    private $ID;
    private $name;
    private $data;
    private $url;
    private $value;
    private $type;
    private $description;
    private $active;

    private $err = false;
    private $conn;

    public function __construct()
    {
        $this->conn = new DBConnection();
    }

    public function load($data)
    {
        if(!QR::exists($data))
            return 1;

        $sql = "
            SELECT *
            FROM qr
            WHERE data = '$data'
        ";

        $result = $this->conn->db->query($sql);

        if (!$result) {
            $this->err = true;
            return 1;
        }

        $result = $result->fetch_assoc();
        $this->ID = $result['id'];
        $this->name = $result['name'];
        $this->data = $result['data'];
        $this->url = $result['url'];
        $this->value = $result["value"];
        $this->type = $result["type"];
        $this->description = $result["description"];
        $this->active = $result["active"];

        return 0;
    }

    public function loadByID($id){
        $sql = "
            SELECT data
            FROM qr
            WHERE id = '$id'
        ";

        $result = $this->conn->db->query($sql);

        if (!$result) {
            $this->err = true;
            return 1;
        }

        $result = $result->fetch_assoc();
        return $this->load($result['id']);
    }

    static public function create($name, $data, $url, $value, $type, $description, $active)
    {
        $conn = new DBConnection();

        if (QR::exists($data))
            return 2;

        $sql = "
            INSERT INTO qr(name, data, url, value, type, description, active)
            VALUES ('$name', '$data', '$url', $value, $type, '$description', $active)
        ";

        $conn->db->query($sql);
        if ($conn->db->insert_id)
            return 0;
        return 1;
    }

    static public function remove($data){
        $conn = new DBConnection();

        if (!QR::exists($data))
            return 2;

        $sql = "
            DELETE FROM qr 
            WHERE data = '$data'
        ";

        $conn->db->query($sql);
        return 0;
    }

    static public function exists($data)
    {
        $conn = new DBConnection();

        $sql = "
            SELECT data
            FROM qr
            WHERE data = '$data'
        ";

        $result = $conn->db->query($sql);

        return ($result && $result->num_rows) ? true : false;
    }

    static public function createData(){
        $QR_DATA_LENGTH = 8;
        $QR_DATA_CHARS = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";

        $QRData = "";
        for($i = 0; $i <= $QR_DATA_LENGTH; $i++){
            $QRData .= substr($QR_DATA_CHARS, rand(0, strlen($QR_DATA_CHARS)), 1);
        }

        return (QR::exists($QRData)) ? QR::createData() : $QRData;
    }


    /**
     * @param qr QR
     * @param user User
     */
    static public function collect($qr, $user){
        $conn = new DBConnection();

        if (QR::isCollected($qr, $user))
            return 2;

        $userID = $user->getID();
        $qrID = $qr->getID();

        $sql = "
            INSERT INTO user_qr(id_user, id_qr, time)
            VALUES ($userID, $qrID, NOW())
        ";

        $conn->db->query($sql);
        if ($conn->db->insert_id)
            return 0;
        return 1;
    }

    /**
     * @param qr QR
     * @param user User
     */
    static public function drop($qr, $user){
        $conn = new DBConnection();

        if (!QR::isCollected($qr, $user))
            return 2;

        $userID = $user->getID();
        $qrID = $qr->getID();

        $sql = "
            DELETE FROM user_qr 
            WHERE id_qr = $qrID AND id_user = $userID;   
        ";

        $conn->db->query($sql);
        return 0;
    }

    /**
     * @param qr QR
     * @param user User
     */
    static public function isCollected($qr, $user){
        $conn = new DBConnection();

        $userID = $user->getID();
        $qrID = $qr->getID();

        $sql = "
            SELECT *
            FROM user_qr
            WHERE id_qr = $qrID AND id_user = $userID;           
        ";

        $result = $conn->db->query($sql);

        return ($result && $result->num_rows) ? true : false;
    }

    static public function getCollected($user){
        $conn = new DBConnection();

        $userID = $user->getID();

        $sql = "
            SELECT qr.name, qr.value, user_qr.time 
            FROM user_qr
            INNER JOIN qr on user_qr.id_qr = qr.id
            WHERE user_qr.id_user = $userID
            ORDER BY user_qr.time
        ";

        $result = $conn->db->query($sql);

        $data = [];
        while ($row = $result->fetch_assoc())
            array_push($data, [
                "name" => $row["name"],
                "value" => $row["value"],
                "time" => $row["time"]
            ]);

        return $data;
    }

    static public function getAllCollected(){
        $conn = new DBConnection();

        $sql = "
            SELECT users.login, users.name, users.class, qr.name as qr, qr.value, user_qr.time
            FROM user_qr
            INNER JOIN qr on user_qr.id_qr = qr.id
            INNER JOIN users on user_qr.id_user = users.id
            ORDER BY user_qr.time
        ";

        $result = $conn->db->query($sql);

        $data = [];
        while ($row = $result->fetch_assoc())
            array_push($data, [
                "login" => $row["login"],
                "name" => $row["name"],
                "class" => $row["class"],
                "qr" => $row["qr"],
                "value" => $row["value"],
                "time" => $row["time"]
            ]);

        return $data;
    }

    /**
     * @return integer
     */
    public function getID()
    {
        return $this->ID;
    }

    public function getData()
    {
        return [
            "ID" => intval($this->ID),
            "name" => $this->name,
            "data" => $this->data,
            "url" => $this->url,
            "description" => $this->description,
            "value" => intval($this->value),
            "type" => $this->type,
            "active" => intval($this->active)
        ];
    }
}
