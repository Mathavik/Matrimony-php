<?php
require_once "../../config/db.php";

$conn = getDBConnection(); // ✅ MySQLi connection

$userId = $_GET['userId'] ?? 0;

if (!$userId) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT u.id, u.fullName, u.age, u.city, u.profilePhoto
    FROM interest_requests ir
    JOIN users u ON ir.receiverId = u.id
    WHERE ir.senderId=?
    ORDER BY ir.createdAt DESC
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$sentInterests = [];

while ($row = $result->fetch_assoc()) {
    $sentInterests[] = $row;
}

echo json_encode($sentInterests);
?>
