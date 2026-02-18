<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

// Support JSON body or traditional form POST
$raw = file_get_contents('php://input');
$parsed = json_decode($raw, true);
if (is_array($parsed)) {
	$data = $parsed;
} else {
	$data = $_POST;
}

$email = isset($data['email']) ? trim($data['email']) : null;
$password = isset($data['password']) ? $data['password'] : null;

if (!$email || !$password) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'Email and password required']);
	exit;
}

$stmt = $conn->prepare('SELECT id, fullName, email, password, profilePhoto, isPublic FROM users WHERE email = ? LIMIT 1');
if (!$stmt) {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Database error preparing statement', 'error' => $conn->error]);
	exit;
}

$stmt->bind_param('s', $email);
if (!$stmt->execute()) {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Database execution error', 'error' => $stmt->error]);
	exit;
}

$res = $stmt->get_result();
if (!$res || $res->num_rows === 0) {
	http_response_code(401);
	echo json_encode(['status' => false, 'message' => 'Invalid credentials']);
	exit;
}

$user = $res->fetch_assoc();

// Ensure stored password exists
if (empty($user['password'])) {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'User has no password set']);
	exit;
}

if (!password_verify($password, $user['password'])) {
	http_response_code(401);
	echo json_encode(['status' => false, 'message' => 'Invalid credentials']);
	exit;
}

// Simple JWT (HS256) implementation
function base64url_encode($data) {
	return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

$header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
$payload = base64url_encode(json_encode(['id' => (int)$user['id'], 'email' => $user['email'], 'exp' => time() + 86400]));
$signature = base64url_encode(hash_hmac('sha256', $header . '.' . $payload, JWT_SECRET, true));
$token = $header . '.' . $payload . '.' . $signature;

$profilePhotoUrl = $user['profilePhoto'] ? UPLOAD_URL . $user['profilePhoto'] : null;

echo json_encode([
	'status' => true,
	'message' => 'Login successful',
	'token' => $token,
	'userId' => (int)$user['id'],
	'fullName' => $user['fullName'],
	'email' => $user['email'],
	'user' => [
		'id' => (int)$user['id'],
		'fullName' => $user['fullName'],
		'email' => $user['email'],
		'profilePhoto' => $profilePhotoUrl,
		'isPublic' => (bool)$user['isPublic']
	]
});

?>
