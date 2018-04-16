<?php

class DBConnection
{
    const LH = true;
    private $host = NULL;
    private $db_user = NULL;
    private $db_name = NULL;
    private $db_pass = NULL;

    public $db; //Mysqli object

    const DateFormat = "Y-m-d H:i:s";

    function __construct()
    {
        $this->host = (self::LH)?'localhost':'secret';
        $this->db_user = (self::LH)?'root':'another_secret';
        $this->db_name = (self::LH)?'qrcontest':'and_one_more';
        $this->db_pass = (self::LH)?'':'most_secretly_secret_you_can_ever_find_here';
        $this->db = new mysqli($this->host, $this->db_user, $this->db_pass, $this->db_name);

        if ($this->db->connect_errno != 0)
            die("Can't connect with db! <br>" . $this->db->connect_errno . "<br>" . $this->db->connect_error);
        $this->db->set_charset("utf8");
    }

    function __destruct(){
        @$this->db->close();
    }
}