<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'ID required']);
	exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$isPublic = isset($data['isPublic']) ? ($data['isPublic'] === 'true' || $data['isPublic'] === true ? 1 : 0) : null;
if ($isPublic === null) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'isPublic required']);
	exit;
}

$stmt = $conn->prepare('UPDATE users SET isPublic = ? WHERE id = ?');
$stmt->bind_param('ii', $isPublic, $id);
$ok = $stmt->execute();

if ($ok) {
	echo json_encode(['status' => true, 'message' => 'Privacy updated', 'user' => ['id' => $id, 'isPublic' => (bool)$isPublic]]);
} else {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Update failed']);
}

?>
