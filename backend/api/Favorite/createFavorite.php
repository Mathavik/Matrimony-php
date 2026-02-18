<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$userId = isset($data['userId']) ? intval($data['userId']) : 0;
$favoriteUserId = isset($data['favoriteUserId']) ? intval($data['favoriteUserId']) : 0;

if (!$userId || !$favoriteUserId) {
    echo json_encode(["message" => "Missing userId or favoriteUserId"]);
    exit;
}

/* Prevent duplicates (same as Sequelize unique index) */
$check = $conn->prepare("SELECT id FROM favorites WHERE userId=? AND favoriteUserId=?");
$check->bind_param("ii", $userId, $favoriteUserId);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["message" => "Already in favorites"]);
    exit;
}

/* Insert with timestamps */
$stmt = $conn->prepare("
    INSERT INTO favorites (userId, favoriteUserId, createdAt, updatedAt) 
    VALUES (?, ?, NOW(), NOW())
");
$stmt->bind_param("ii", $userId, $favoriteUserId);

if ($stmt->execute()) {
    echo json_encode(["message" => "Added to favorites"]);
} else {
    echo json_encode(["message" => "Server error", "error" => $stmt->error]);
}

$conn->close();
?>
