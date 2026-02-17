<?php
// empty
?>
<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'ID required']);
	exit;
}

$stmt = $conn->prepare('SELECT profilePhoto, password FROM users WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
	http_response_code(404);
	echo json_encode(['status' => false, 'message' => 'User not found']);
	exit;
}

$user = $res->fetch_assoc();

// Support form-data (file upload) and JSON
$isMultipart = !empty($_FILES);
if ($isMultipart) {
	$input = $_POST;
} else {
	$input = json_decode(file_get_contents('php://input'), true);
}

$profilePhoto = $user['profilePhoto'];
if (!empty($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === UPLOAD_ERR_OK) {
	// delete old
	if ($profilePhoto && file_exists(UPLOAD_DIR . $profilePhoto)) unlink(UPLOAD_DIR . $profilePhoto);
	$tmpName = $_FILES['profilePhoto']['tmp_name'];
	$ext = pathinfo($_FILES['profilePhoto']['name'], PATHINFO_EXTENSION);
	$filename = time() . '.' . $ext;
	move_uploaded_file($tmpName, UPLOAD_DIR . $filename);
	$profilePhoto = $filename;
}

$password = isset($input['password']) ? $input['password'] : null;
$updatedPassword = $user['password'];
if ($password) {
	$updatedPassword = password_hash($password, PASSWORD_BCRYPT);
}

$isPublic = isset($input['isPublic']) ? ($input['isPublic'] === 'true' || $input['isPublic'] === true ? 1 : 0) : $user['isPublic'];

$fields = [
	'profileFor','fullName','gender','dob','age','religion','motherTongue','maritalStatus','caste','height','education','occupation','annualIncome','country','state','city','email','mobile'
];

$updates = [];
$types = '';
$values = [];
foreach ($fields as $f) {
	if (isset($input[$f])) {
		$updates[] = "$f = ?";
		$types .= 's';
		$values[] = $input[$f];
	}
}

$updates[] = 'password = ?'; $types .= 's'; $values[] = $updatedPassword;
$updates[] = 'profilePhoto = ?'; $types .= 's'; $values[] = $profilePhoto;
$updates[] = 'isPublic = ?'; $types .= 'i'; $values[] = $isPublic;

$sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
$types .= 'i'; $values[] = $id;

$stmt2 = $conn->prepare($sql);
$stmt2->bind_param($types, ...$values);
$ok = $stmt2->execute();

if ($ok) {
	$stmt3 = $conn->prepare('SELECT id, profileFor, fullName, gender, dob, age, religion, motherTongue, maritalStatus, caste, height, education, occupation, annualIncome, country, state, city, email, mobile, profilePhoto, isPublic, createdAt FROM users WHERE id = ?');
	$stmt3->bind_param('i', $id);
	$stmt3->execute();
	$res3 = $stmt3->get_result();
	$u = $res3->fetch_assoc();
	$u['profilePhoto'] = $u['profilePhoto'] ? UPLOAD_URL . $u['profilePhoto'] : null;
	$u['isPublic'] = (bool)$u['isPublic'];
	echo json_encode(['status' => true, 'message' => 'Profile updated', 'user' => $u]);
} else {
	http_response_code(500);
	echo json_encode(['status' => false, 'message' => 'Update failed']);
}

?>
