<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$query = "SELECT id, profileFor, fullName, gender, dob, age, religion, motherTongue, maritalStatus, caste, height, education, occupation, annualIncome, country, state, city, email, mobile, profilePhoto, status, isPremium, isPublic, createdAt FROM users ORDER BY createdAt DESC";
$res = $conn->query($query);

$users = [];
while ($row = $res->fetch_assoc()) {
	$row['profilePhoto'] = $row['profilePhoto'] ? UPLOAD_URL . $row['profilePhoto'] : null;
	$row['isPublic'] = (bool)$row['isPublic'];
	$users[] = $row;
}

echo json_encode(['status' => true, 'message' => 'Users fetched', 'users' => $users]);

?>
