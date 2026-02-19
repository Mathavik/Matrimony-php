<?php
header("Content-Type: application/json");
require_once(__DIR__ . "/../../config/db.php");

/* Read PUT data (JSON) */
$data = json_decode(file_get_contents("php://input"), true);

$id = $_GET['id'] ?? 0;

$names = $data['names'] ?? '';
$location = $data['location'] ?? '';
$date = $data['date'] ?? '';
$story = $data['story'] ?? '';
$userId = $data['userId'] ?? 0;

if (!$id || !$userId) {
    echo json_encode(["message" => "Missing ID or User"]);
    exit;
}

/* Check story exists */
$stmt = $conn->prepare("SELECT * FROM success_stories WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$existing = $result->fetch_assoc();

if (!$existing) {
    echo json_encode(["message" => "Story not found"]);
    exit;
}

/* Check ownership */
if ($existing['userId'] != $userId) {
    echo json_encode(["message" => "Unauthorized"]);
    exit;
}

/* Validate story length */
if ($story && strlen(trim($story)) < 164) {
    echo json_encode(["message" => "Story must have at least 164 characters"]);
    exit;
}

/* Update */
$update = $conn->prepare("
UPDATE success_stories 
SET names=?, location=?, marriedDate=?, story=?, testimonial=?, updatedAt=NOW()
WHERE id=?
");

$update->bind_param(
    "sssssi",
    $names,
    $location,
    $date,
    $story,
    $story,
    $id
);

if ($update->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Story updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed"
    ]);
}

$conn->close();
?>
