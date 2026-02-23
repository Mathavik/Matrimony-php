<?php
require_once "../../config/db.php";


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$userId = $_POST['userId'] ?? null;

if (!$userId || !isset($_FILES['profilePhoto'])) {
    http_response_code(400);
    echo json_encode(["message" => "User ID and photo required"]);
    exit;
}

$uploadDir = __DIR__ . "/../../uploads/";
$filename = time() . "_" . basename($_FILES["profilePhoto"]["name"]);
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($_FILES["profilePhoto"]["tmp_name"], $targetPath)) {

    // Save filename in DB
    $stmt = $conn->prepare("UPDATE users SET profilePhoto=? WHERE id=?");
    $stmt->bind_param("si", $filename, $userId);
    $stmt->execute();

    echo json_encode([
        "message" => "Profile photo uploaded",
        "filename" => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Upload failed"]);
}
?>