<?php
header("Content-Type: application/json");

require_once("../../config/db.php");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB Connection Failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$userId = isset($data['userId']) ? intval($data['userId']) : 0;
$favoriteUserId = isset($data['favoriteUserId']) ? intval($data['favoriteUserId']) : 0;

if (!$userId || !$favoriteUserId) {
    echo json_encode(["success" => false, "message" => "Missing Data"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM favorites WHERE userId=? AND favoriteUserId=?");
$stmt->bind_param("ii", $userId, $favoriteUserId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Favorite Removed"]);
} else {
    echo json_encode(["success" => false, "message" => "Favorite Not Found"]);
}

$conn->close();
?>
