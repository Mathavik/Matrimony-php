<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

// Handle file upload if present
$profilePhoto = null;
if (!empty($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === UPLOAD_ERR_OK) {
	$tmpName = $_FILES['profilePhoto']['tmp_name'];
	$ext = pathinfo($_FILES['profilePhoto']['name'], PATHINFO_EXTENSION);
	$filename = time() . '.' . $ext;
	if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
	move_uploaded_file($tmpName, UPLOAD_DIR . $filename);
	$profilePhoto = $filename;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : null;
$password = isset($_POST['password']) ? $_POST['password'] : null;
$fullName = isset($_POST['fullName']) ? $_POST['fullName'] : null;

if (!$email) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'Email is required']);
	exit;
}

// Check if user already exists
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param('s', $email);
$stmt->execute();

$stmt->store_result();


if ($stmt->num_rows > 0) {
	http_response_code(409);
	echo json_encode(['status' => false, 'message' => 'User already exists']);
	exit;
}


$hashed = null;
if ($password) $hashed = password_hash($password, PASSWORD_BCRYPT);

// Build a safe explicit insert mapping common users columns to POST data
$allowed = [
	'fullName','email','password','mobile','gender','dob','age','religion','caste',
	'motherTongue','maritalStatus','height','education','occupation','annualIncome',
	'country','state','city','aboutMe','profilePhoto','profileFor','isPremium','status'
];

$insertCols = [];
$insertVals = [];
$placeholders = [];

foreach ($allowed as $colName) {
	if ($colName === 'profilePhoto') {
		if ($profilePhoto) {
			$insertCols[] = $colName;
			$insertVals[] = $profilePhoto;
			$placeholders[] = '?';
		}
		continue;
	}

	if ($colName === 'password') {
		$insertCols[] = 'password';
		$insertVals[] = $hashed ?? '';
		$placeholders[] = '?';
		continue;
	}

	if (isset($_POST[$colName]) && $_POST[$colName] !== '') {
		$insertCols[] = $colName;
		$insertVals[] = $_POST[$colName];
		$placeholders[] = '?';
	}
}

// Ensure required fields
if (!in_array('fullName', $insertCols) && $fullName) {
	array_unshift($insertCols, 'fullName');
	array_unshift($insertVals, $fullName);
	array_unshift($placeholders, '?');
}
if (!in_array('email', $insertCols)) {
	array_unshift($insertCols, 'email');
	array_unshift($insertVals, $email);
	array_unshift($placeholders, '?');
}

// Default status if not provided
if (!in_array('status', $insertCols)) {
	$insertCols[] = 'status';
	$insertVals[] = 'pending';
	$placeholders[] = '?';
}

if (count($insertCols) === 0) {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'No data to insert']);
	exit;
}

$sql = 'INSERT INTO users (' . implode(', ', $insertCols) . ') VALUES (' . implode(', ', $placeholders) . ')';
$insert = $conn->prepare($sql);
$types = str_repeat('s', count($insertVals));
$insert->bind_param($types, ...$insertVals);
$ok = $insert->execute();

if ($ok) {
	$userId = $insert->insert_id;
	echo json_encode(['status' => true, 'message' => 'User created', 'userId' => $userId]);
} else {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Failed to create user']);
}

?>
