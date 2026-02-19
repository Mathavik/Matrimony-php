<?php
require_once "../../config/db.php";

$conn = getDBConnection(); // ✅ MySQLi connection

$query = "SELECT COUNT(*) as count FROM interest_requests WHERE status='accepted'";
$result = $conn->query($query);

$row = $result->fetch_assoc();

echo json_encode($row);
?>
