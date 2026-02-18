<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$data = json_decode(file_get_contents('php://input'), true);
$userId = isset($data['userId']) ? intval($data['userId']) : null;
if (!$userId) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'User ID required']);
	exit;
}

$stmt = $conn->prepare('SELECT id FROM users WHERE id = ?');
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
	http_response_code(404);
	echo json_encode(['status' => false, 'message' => 'User not found']);
	exit;
}

$fields = ['dob','age','religion','motherTongue','maritalStatus','caste','height','education','occupation','annualIncome','country','state','city','mobile','password','profilePhoto','rule1','rule2','rule3','rule4','rule5'];

$updates = [];
$types = '';
$values = [];
foreach ($fields as $f) {
	if (isset($data[$f])) {
		if ($f === 'password') {
			$updates[] = 'password = ?';
			$types .= 's';
			$values[] = password_hash($data[$f], PASSWORD_BCRYPT);
		} else {
			$updates[] = "$f = ?";
			$types .= 's';
			$values[] = $data[$f];
		}
	}
}

$updates[] = "status = 'approved'";

if (count($values) === 0) {
	echo json_encode(['status' => false, 'message' => 'No fields to update']);
	exit;
}

$sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
$types .= 'i';
$values[] = $userId;

$stmt2 = $conn->prepare($sql);
$stmt2->bind_param($types, ...$values);
$ok = $stmt2->execute();

if ($ok) {
	$stmt3 = $conn->prepare('SELECT * FROM users WHERE id = ?');
	$stmt3->bind_param('i', $userId);
	$stmt3->execute();
	$res3 = $stmt3->get_result();
	$u = $res3->fetch_assoc();
	$u['profilePhoto'] = $u['profilePhoto'] ? UPLOAD_URL . $u['profilePhoto'] : null;
	echo json_encode(['status' => true, 'message' => 'Registration completed', 'user' => $u]);
} else {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Update failed']);
}

?>
