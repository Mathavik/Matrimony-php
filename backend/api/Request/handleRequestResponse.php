<?php 
require_once "../../config/db.php";

$conn = getDBConnection();   // ✅ IMPORTANT

$requestId = $_GET['requestId'] ?? 0;
$status = $_GET['status'] ?? '';

if (!$requestId || !in_array($status, ['accepted','rejected'])) {
    die("Invalid request");
}

$stmt = $conn->prepare("UPDATE interest_requests SET status=?, updatedAt=NOW() WHERE id=?");
$stmt->bind_param("si", $status, $requestId);
$stmt->execute();

echo "<h2>Request $status successfully ✅</h2>";
?>
