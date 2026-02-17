<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'ID required']);
	exit;
}

$stmt = $conn->prepare('SELECT country, gender FROM users WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
	http_response_code(404);
	echo json_encode(['status' => false, 'message' => 'User not found']);
	exit;
}

$cur = $res->fetch_assoc();
$country = $cur['country'];
$gender = $cur['gender'];

$stmt2 = $conn->prepare('SELECT id, profileFor, fullName, gender, dob, age, religion, motherTongue, maritalStatus, caste, height, education, occupation, annualIncome, country, state, city, email, mobile, profilePhoto, isPublic, createdAt FROM users WHERE country = ? AND gender = ? AND id != ? AND isPublic = 1 ORDER BY createdAt DESC');
$stmt2->bind_param('ssi', $country, $gender, $id);
$stmt2->execute();
$res2 = $stmt2->get_result();

$profiles = [];
while ($row = $res2->fetch_assoc()) {
	$row['profilePhoto'] = $row['profilePhoto'] ? UPLOAD_URL . $row['profilePhoto'] : null;
	$row['isPublic'] = (bool)$row['isPublic'];
	$profiles[] = $row;
}

echo json_encode(['status' => true, 'relatedProfiles' => $profiles]);

?>
