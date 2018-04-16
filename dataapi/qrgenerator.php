<?php

session_start();

require_once("phpqrcode/qrlib.php");
require_once("phpqrcode/qrconfig.php");
require_once("dbconnection.class.php");

//
//SUPER IMPORTANT
//

$URLPATTERN = "http://it-day.pl/qrcontest/qr/";

//
//SUPER IMPORTANT
//

function text($text, $size, $y, $image, $font, $color){
    $fontwidth = imagettfbbox($size, 0, $font, $text)[2];
    imagettftext($image, $size, 0, (800/2) - ($fontwidth/2), $y, $color, $font, $text);
}

function createRawQRCode($data, $url, $code){
    QRcode::png($data, $url, QR_ECLEVEL_L, 20);

    $image = imagecreate(800, 1131);
    $qr = imagecreatefrompng($url);
    $itt = imagecreatefrompng("itt.png");
    $zseo = imagecreatefrompng("zseo.png");
    $bgcolor = imagecolorallocate($image, 255, 255, 255);
    $color = imagecolorallocate($image, 18, 49, 84);

    $text = "Zeskanuj kod i weź udział w konkursie!";
    $font = 'Acre-Bold.ttf';

    imagecopy($image, $qr, 30, 150, 0, 0, 740, 740);
    imagecopy($image, $itt, 575, 30, 0, 0, 170, 126);
    imagecopy($image, $zseo, 20, 32, 0, 0, 260, 131);

    text($code, 50, 920, $image, $font, $color);
    text("Zeskanuj kod i weź udział w konkursie!", 25, 1010, $image, $font, $color);
    text("www.it-day.pl/qrcontest", 25, 1060, $image, $font, $color);
    //imagettftext($image, 50, 0, (800/2) - ($fontwidth/2), 820, $color, $font, $code);
    //imagettftext($image, 20, 0, (800/2) - ($textwidth/2), 910, $color, $font, $text);
    imagepng($image, $url);
    imagedestroy($image);
}

$conn = new DBConnection();

$sql = "SELECT * FROM qr";

if($result = $conn->db->query($sql)) {
    if ($result->num_rows) {
        while($row = $result->fetch_assoc()){
            createRawQRCode($URLPATTERN.$row['data'], "../".$row['url'], $row['data']);
            echo "<img style='border: 1px solid #aaa; width: 340px; float: left' src='../".$row['url']."'>";
        }
    } else {
        echo "<div class=\"alert alert-info\">No QR to render</div>";
    }

    $result->free_result();
}