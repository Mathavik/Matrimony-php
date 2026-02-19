<?php
header("Content-Type: application/json");
require_once("../../config/db.php");

if ($conn->connect_error) {
    echo json_encode(["message" => "Connection failed"]);
    exit;
}

$id = $_GET['id'] ?? '';

if (!$id) {
    echo json_encode(["message" => "User ID required"]);
    exit;
}

// 1️⃣ Check user exists
$stmt = $conn->prepare("SELECT profilePhoto FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["message" => "User not found"]);
    exit;
}

// 🔥 2️⃣ First delete related interest_requests
$deleteInterest = $conn->prepare("DELETE FROM interest_requests WHERE senderId = ?");
$deleteInterest->bind_param("i", $id);
$deleteInterest->execute();

// 🔥 If receiverId also irundha delete pannunga
$deleteInterest2 = $conn->prepare("DELETE FROM interest_requests WHERE receiverId = ?");
$deleteInterest2->bind_param("i", $id);
$deleteInterest2->execute();

// 3️⃣ Delete profile photo if exists
if (!empty($user['profilePhoto'])) {
    $filePath = "../../uploads/" . $user['profilePhoto'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }
}

// 4️⃣ Now delete user
$deleteStmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$deleteStmt->bind_param("i", $id);

if ($deleteStmt->execute()) {
    echo json_encode([
        "message" => "User profile deleted successfully"
    ]);
} else {
    echo json_encode([
        "message" => "Delete failed",
        "error" => $deleteStmt->error
    ]);
}

$conn->close();
?>
