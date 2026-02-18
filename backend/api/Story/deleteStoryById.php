<?php
header("Content-Type: application/json");
require_once(__DIR__ . "/../../config/db.php");

/* Read DELETE JSON body */
$data = json_decode(file_get_contents("php://input"), true);

$id = $_GET['id'] ?? 0;
$userId = $data['userId'] ?? 0;

if (!$id || !$userId) {
    echo json_encode([
        "success" => false,
        "message" => "Missing ID or User"
    ]);
    exit;
}

/* Check if story exists */
$stmt = $conn->prepare("SELECT * FROM success_stories WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$story = $result->fetch_assoc();

if (!$story) {
    echo json_encode([
        "success" => false,
        "message" => "Story not found"
    ]);
    exit;
}

/* Check ownership */
if ($story['userId'] != $userId) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

/* Delete */
$delete = $conn->prepare("DELETE FROM success_stories WHERE id=?");
$delete->bind_param("i", $id);

if ($delete->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Story deleted successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Delete failed"
    ]);
}

$conn->close();
?>
