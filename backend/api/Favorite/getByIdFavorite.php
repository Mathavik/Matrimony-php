<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// $conn = new mysqli("localhost", "root", "maha", "matrimonydb");
require_once("../../config/db.php");
if ($conn->connect_error) {
    echo json_encode(["success" => false]);
    exit;
}

$userId = $_GET['userId'] ?? '';

if (!$userId) {
    echo json_encode(["success" => false, "message" => "UserId Missing"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT f.favoriteUserId, u.fullName, u.age, u.state, u.profilePhoto
    FROM favorites f
    JOIN users u ON f.favoriteUserId = u.id
    WHERE f.userId = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];

while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode([
    "success" => true,
    "favorites" => $favorites
]);

$conn->close();
?>
