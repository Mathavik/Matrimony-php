<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require_once "../../config/db.php";

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

$id = intval($_GET['id']);
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['isPublic'])) {
    echo json_encode(["success" => false, "message" => "isPublic value required"]);
    exit;
}

$isPublic = $data['isPublic'] ? 1 : 0;

$updateQuery = $conn->prepare("UPDATE users SET isPublic = ? WHERE id = ?");
$updateQuery->bind_param("ii", $isPublic, $id);

if ($updateQuery->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Privacy updated successfully",
        "user" => [
            "id" => $id,
            "isPublic" => (bool)$isPublic
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}