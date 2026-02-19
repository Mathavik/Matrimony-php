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
WHERE ir.status='accepted'
ORDER BY ir.createdAt DESC
";

$result = $conn->query($sql);

$matches = [];

while ($row = $result->fetch_assoc()) {
    $matches[] = $row;
}

echo json_encode($matches);
?>
