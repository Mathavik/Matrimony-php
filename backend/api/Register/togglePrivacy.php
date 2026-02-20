<?php
header("Content-Type: application/json");
require_once "../../config/db.php"; // db connection file path correct ah set pannu

// 🔹 Check ID
if (!isset($_GET['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "User ID required"
    ]);
    exit;
}

$id = intval($_GET['id']);

// 🔹 Get JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['isPublic'])) {
    echo json_encode([
        "success" => false,
        "message" => "isPublic value required"
    ]);
    exit;
}

$isPublic = ($data['isPublic'] === true || $data['isPublic'] === "true") ? 1 : 0;

// 🔹 Check user exists
$checkQuery = $conn->prepare("SELECT id FROM users WHERE id = ?");
$checkQuery->bind_param("i", $id);
$checkQuery->execute();
$result = $checkQuery->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
    exit;
}

// 🔹 Update privacy
$updateQuery = $conn->prepare("UPDATE users SET isPublic = ? WHERE id = ?");
$updateQuery->bind_param("ii", $isPublic, $id);
$updateQuery->execute();

echo json_encode([
    "success" => true,
    "message" => "Privacy updated successfully",
    "user" => [
        "id" => $id,
        "isPublic" => (bool)$isPublic
    ]
]);