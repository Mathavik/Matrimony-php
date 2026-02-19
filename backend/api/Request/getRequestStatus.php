<?php
require_once "../../config/db.php";

$conn = getDBConnection(); // ✅ create mysqli connection

$senderId = $_GET['senderId'] ?? 0;
$receiverId = $_GET['receiverId'] ?? 0;

if (!$senderId || !$receiverId) {
    echo json_encode(["status" => "none"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT * FROM interest_requests
    WHERE (senderId=? AND receiverId=?)
       OR (senderId=? AND receiverId=?)
    ORDER BY createdAt DESC 
    LIMIT 1
");

$stmt->bind_param("iiii", $senderId, $receiverId, $receiverId, $senderId);
$stmt->execute();

$result = $stmt->get_result();
$request = $result->fetch_assoc();

if (!$request) {
    echo json_encode(["status" => "none"]);
} else {
    echo json_encode($request);
}
?>
