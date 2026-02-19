<?php
require_once "../../config/db.php";

$conn = getDBConnection(); // ✅ MySQLi connection

$userId = $_GET['userId'] ?? 0;

if (!$userId) {
    echo json_encode(["count" => 0]);
    exit;
}

$stmt = $conn->prepare("
    SELECT COUNT(*) as count
    FROM interest_requests
    WHERE receiverId=? AND status='pending'
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode($row);
?>
