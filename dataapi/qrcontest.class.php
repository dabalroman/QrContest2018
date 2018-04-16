<?php

require_once("user.class.php");
require_once("qr.class.php");
require_once("question.class.php");
require_once("dbconnection.class.php");

@session_start();

$USER = new User();
$QRURL = "qrcodes/";

if (!isset($_SESSION["activeUser"]))
    $_SESSION["activeUser"] = -1;

if ($_SESSION["activeUser"] != -1) {
    $USER->load($_SESSION["activeUser"]);
    $USER->setActive(true);
}


class QRCONTEST
{
    static public function handleJSONRequest($inputJSONArray)
    {
        $requestType = $inputJSONArray["type"];
        $requestData = $inputJSONArray["data"];

        $output = [];

        switch ($requestType) {
            case "signUp":
                $result = QRCONTEST::signUp($requestData);
                $output = Array("type" => "signUp", "result" => $result);
                break;

            case "signIn":
                $result = QRCONTEST::signIn($requestData);
                $output = Array("type" => "signIn", "result" => $result);
                break;

            case "getActiveSession":
                $result = QRCONTEST::getActiveSession($requestData);
                $output = Array("type" => "getActiveSession", "result" => $result);
                break;

            case "updateSessionData":
                $result = QRCONTEST::updateSessionData($requestData);
                $output = Array("type" => "updateSessionData", "result" => $result);
                break;

            case "signOut":
                $result = QRCONTEST::signOut($requestData);
                $output = Array("type" => "signOut", "result" => $result);
                break;

            case "createQR":
                $result = QRCONTEST::createQR($requestData);
                $output = Array("type" => "createQR", "result" => $result);
                break;

            case "getQRCodeData":
                $result = QRCONTEST::getQRCodeData($requestData);
                $output = Array("type" => "getQRCodeData", "result" => $result);
                break;

            case "collectQRCode":
                $result = QRCONTEST::collectQRCode($requestData);
                $output = Array("type" => "collectQRCode", "result" => $result);
                break;

            case "getQuestion":
                $result = QRCONTEST::getQuestion($requestData);
                $output = Array("type" => "getQuestion", "result" => $result);
                break;

            case "collectQuestion":
                $result = QRCONTEST::collectQuestion($requestData);
                $output = Array("type" => "collectQuestion", "result" => $result);
                break;

            case "getRanking":
                $result = QRCONTEST::getRanking($requestData);
                $output = Array("type" => "getRanking", "result" => $result);
                break;

            case "QRQuestOpen":
                $result = QRCONTEST::QRQuestOpen();
                $output = Array("type" => "QRQuestOpen", "result" => $result);
                break;

            case "QRQuestClose":
                $result = QRCONTEST::QRQuestClose();
                $output = Array("type" => "QRQuestClose", "result" => $result);
                break;

            case "getCollected":
                $result = QRCONTEST::getCollected($requestData);
                $output = Array("type" => "getCollected", "result" => $result);
                break;

            case "getAllCollected":
                $result = QRCONTEST::getAllCollected($requestData);
                $output = Array("type" => "getAllCollected", "result" => $result);
                break;
        }

        return $output;
    }

    static public function signUp($data)
    {
        global $USER;
        $result = User::create($data['login'], $data['name'], $data['class'], $data['password']);
        $USER->signIn($data['login'], $data['password']);
        return $result;
    }

    static public function signIn($data)
    {
        global $USER;

        if ($USER->isActive())
            return 2;

        $USER->signIn($data['login'], $data['password']);
        $USER->updateOnlineTimestamp();
        $USER->updatePoints();

        if ($USER->isActive())
            $_SESSION["activeUser"] = $USER->getID();

        return ($USER->isActive()) ? $USER->getData() : 1;
    }

    static public function signOut($data)
    {
        global $USER;
        if (!$USER->isActive())
            return 2;

        $USER->updateOnlineTimestamp();
        $USER->signOut();
        if (!$USER->isActive())
            $_SESSION["activeUser"] = -1;
        return (!$USER->isActive()) ? 0 : 1;
    }

    static public function getActiveSession($data)
    {
        global $USER;
        if (!QRCONTEST::isQRQuestOpen())
            return -1;
        return ($USER->isActive()) ? $USER->getData() : 1;
    }

    static public function updateSessionData($data)
    {
        global $USER;
        if (!QRCONTEST::isQRQuestOpen())
            return -1;
        $USER->updateOnlineTimestamp();
        $USER->updatePoints();
        return ($USER->isActive()) ? $USER->getData() : 1;
    }

    static public function createQR($data)
    {
        global $QRURL;
        $QRData = QR::createData();
        $QRUrlAdress = $QRURL . $QRData . ".png";

        return QR::create($data['name'], $QRData, $QRUrlAdress, $data["value"], $data["type"], $data["description"], $data["active"]);
    }

    static public function getQRCodeData($data)
    {
        $QR = new QR;
        if ($QR->load($data) == 0)
            return $QR->getData();
        return 1;
    }

    static public function collectQRCode($data)
    {
        global $USER;
        $result = 3;

        $USER->load($data["user"]);
        $QR = new QR;
        if ($QR->load($data["qr"]) == 0)
            $result = QR::collect($QR, $USER);
        $USER->updatePoints();

        return $result;
    }

    static public function getQuestion($data)
    {
        global $USER;
        return Question::getData(Question::getRandomQuestionID($USER));
    }

    static public function collectQuestion($data)
    {
        global $USER;
        $USER->load($data['user']);

        if (!Question::exists($data['question']))
            return 3;
        if (Question::isCollected($data['question'], $USER))
            return 2;

        return Question::collect($data['question'], $USER, $data['answer']);
    }

    static public function getRanking($data)
    {
        global $USER;
        return $USER::getRanking();
    }

    static public function getCollected($data)
    {
        global $USER;
        return QR::getCollected($USER);
    }

    static public function getAllCollected($data)
    {
        $questions = Question::getAllCollected();
        $qr = QR::getAllCollected();
        $array = array_merge($questions, $qr);

        usort($array, function ($a, $b) {
            $a = strtotime($a["time"]);
            $b = strtotime($b["time"]);
            return ($a < $b) ? 1 : ($a > $b ? -1 : 0);
        });

        return $array;
    }

    static public function isQRQuestOpen()
    {
        $conn = new DBConnection();

        $sql = "
            SELECT param
            FROM contest_params
            WHERE id = 1
        ";

        $result = $conn->db->query($sql);

        if (!$result)
            return 1;

        $result = $result->fetch_assoc();
        return ($result['param'] === "1");
    }

    static public function QRQuestOpen()
    {
        $conn = new DBConnection();

        $sql = "
            UPDATE contest_params 
            SET param = '1'
            WHERE id = 1
        ";

        $result = $conn->db->query($sql);
        return $result;
    }

    static public function QRQuestClose()
    {
        $conn = new DBConnection();

        $sql = "
            UPDATE contest_params 
            SET param = '0'
            WHERE id = 1
        ";

        $result = $conn->db->query($sql);
        return $result;
    }
}