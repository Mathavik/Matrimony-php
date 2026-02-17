<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'ID required']);
	exit;
}

$stmt = $conn->prepare('SELECT id, profileFor, fullName, gender, dob, age, religion, motherTongue, maritalStatus, caste, height, education, occupation, annualIncome, country, state, city, email, mobile, profilePhoto, isPublic, createdAt FROM users WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
	http_response_code(404);
	echo json_encode(['status' => false, 'message' => 'User not found']);
	exit;
}

$user = $res->fetch_assoc();
$user['profilePhoto'] = $user['profilePhoto'] ? UPLOAD_URL . $user['profilePhoto'] : null;
$user['isPublic'] = (bool)$user['isPublic'];

echo json_encode(['status' => true, 'message' => 'User fetched', 'user' => $user]);

?>
