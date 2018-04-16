<?php
require_once("qrcontest.class.php");

@session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
//header("Access-Control-Allow-Origin: http://it-day.pl");
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header ('Content-Type: application/javascript');
header("Access-Control-Allow-Credentials: true");

$data = json_decode(file_get_contents("php://input"), true);

if(!empty($data) && isset($data["request"])){
    echo json_encode(QRCONTEST::handleJSONRequest($data["request"]));
} else {
    echo json_encode([]);
}
session_commit();