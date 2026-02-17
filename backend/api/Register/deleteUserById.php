<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'ID required']);
	exit;
}

$stmt = $conn->prepare('SELECT profilePhoto FROM users WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
	http_response_code(404);
	echo json_encode(['status' => false, 'message' => 'User not found']);
	exit;
}

$row = $res->fetch_assoc();
if ($row['profilePhoto']) {
	$p = UPLOAD_DIR . $row['profilePhoto'];
	if (file_exists($p)) unlink($p);
}

$del = $conn->prepare('DELETE FROM users WHERE id = ?');
$del->bind_param('i', $id);
$ok = $del->execute();

if ($ok) {
	echo json_encode(['status' => true, 'message' => 'User deleted']);
} else {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Delete failed']);
}

?>
