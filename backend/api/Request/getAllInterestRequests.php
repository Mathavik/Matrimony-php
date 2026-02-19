<?php
require_once "../../config/db.php";

$conn = getDBConnection(); // ✅ MySQLi connection

$sql = "
SELECT ir.*, 
s.fullName as senderName,
r.fullName as receiverName
FROM interest_requests ir
JOIN users s ON ir.senderId = s.id
JOIN users r ON ir.receiverId = r.id
ORDER BY ir.createdAt DESC
";

$result = $conn->query($sql);

$requests = [];

while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode($requests);
?>
