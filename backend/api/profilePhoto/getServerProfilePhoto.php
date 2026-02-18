<?php
require_once "../../config/db.php";


$filename = $_GET['filename'] ?? null;

if (!$filename) {
    http_response_code(400);
    exit;
}

$filePath = "../uploads/" . $filename;

if (!file_exists($filePath)) {
    http_response_code(404);
    exit("Image not found");
}

// Check JWT
$isPremium = false;

$headers = getallheaders();

if (isset($headers['Authorization'])) {
    $token = str_replace("Bearer ", "", $headers['Authorization']);

    $secret = "your-secret-key";

    $parts = explode('.', $token);

    if (count($parts) === 3) {
        $payload = json_decode(base64_decode($parts[1]), true);
        $userId = $payload['id'] ?? null;

        if ($userId) {
            $result = $conn->query("SELECT isPremium FROM users WHERE id=$userId");
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                $isPremium = $user['isPremium'];
            }
        }
    }
}

// If Premium → serve original
if ($isPremium) {
    header("Content-Type: image/jpeg");
    readfile($filePath);
    exit;
}

// If Not Premium → Blur using GD
$image = imagecreatefromjpeg($filePath);

for ($i = 0; $i < 5; $i++) {
    imagefilter($image, IMG_FILTER_GAUSSIAN_BLUR);
}

header("Content-Type: image/jpeg");
imagejpeg($image);
imagedestroy($image);
?>