<?php
require_once "../../config/db.php";

$filename = $_GET['filename'] ?? null;

if (!$filename) {
    http_response_code(400);
    exit("Filename missing");
}

$filePath = __DIR__ . "/../../uploads/" . $filename;

if (!file_exists($filePath)) {
    http_response_code(404);
    exit("Image not found");
}

/* =========================
   CHECK JWT FOR PREMIUM
========================= */

$isPremium = false;

$headers = getallheaders();

if (isset($headers['Authorization'])) {

    $token = str_replace("Bearer ", "", $headers['Authorization']);
    $parts = explode('.', $token);

    if (count($parts) === 3) {

        $payload = json_decode(base64_decode($parts[1]), true);
        $userId = $payload['id'] ?? null;

        if ($userId) {

            $result = $conn->query("SELECT isPremium FROM users WHERE id = $userId");

            if ($result && $result->num_rows > 0) {
                $user = $result->fetch_assoc();
                $isPremium = $user['isPremium'];
            }
        }
    }
}

/* =========================
   IF PREMIUM → ORIGINAL
========================= */

$extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

if ($isPremium) {

    if ($extension == "png") {
        header("Content-Type: image/png");
    } else {
        header("Content-Type: image/jpeg");
    }

    readfile($filePath);
    exit;
}

/* =========================
   NOT PREMIUM → BLUR IMAGE
========================= */

if ($extension == "jpg" || $extension == "jpeg") {
    $image = imagecreatefromjpeg($filePath);
} elseif ($extension == "png") {
    $image = imagecreatefrompng($filePath);
} else {
    http_response_code(415);
    exit("Unsupported image type");
}

if (!$image) {
    http_response_code(500);
    exit("Image creation failed");
}

/* Apply Blur */
for ($i = 0; $i < 5; $i++) {
    imagefilter($image, IMG_FILTER_GAUSSIAN_BLUR);
}

/* Output Image */
if ($extension == "png") {
    header("Content-Type: image/png");
    imagepng($image);
} else {
    header("Content-Type: image/jpeg");
    imagejpeg($image);
}

imagedestroy($image);
exit;
?>