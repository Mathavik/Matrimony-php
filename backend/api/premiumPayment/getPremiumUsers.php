<?php
require_once "../../config/db.php";

$conn = getDBConnection();

header("Content-Type: application/json");

// ✅ Get only premium users
$query = "SELECT id, fullName, gender, age, occupation, state, profilePhoto 
          FROM users 
          WHERE isPremium = 1 AND status = 'approved'";

$result = $conn->query($query);

$users = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "users" => $users
]);

$conn->close();
?>