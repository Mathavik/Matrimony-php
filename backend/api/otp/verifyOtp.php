<?php
require_once __DIR__ . '/../../config/db.php';

$conn = getDBConnection();

$data = $_POST;
if (empty($data)) {
    $raw = file_get_contents('php://input');
    $tmp = json_decode($raw, true);
    if (is_array($tmp)) $data = $tmp;
}

$email = isset($data['email']) ? trim($data['email']) : null;
$otp = isset($data['otp']) ? trim($data['otp']) : null;

if (!$email || !$otp) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'email and otp are required']);
    exit;
}

// 1. OTP-ஐ சரிபார்த்தல்
$stmt = $conn->prepare('SELECT * FROM otps WHERE email = ? AND otp = ? ORDER BY createdAt DESC LIMIT 1');
$stmt->bind_param('ss', $email, $otp);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'Invalid OTP']);
    exit;
}

$rec = $res->fetch_assoc();
$now = date('Y-m-d H:i:s');
if ($now > $rec['expiresAt']) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'OTP expired']);
    exit;
}

// 2. மொபைல் எண் சிக்கலைச் சரிசெய்தல் (Max 20 chars for 'mobile' column)
// 'otps' டேபிளில் மொபைல் இல்லை என்றால் email-ஐ எடுத்து 20 எழுத்துக்களாகச் சுருக்குகிறோம்
$tempMobile = !empty($rec['mobile']) ? $rec['mobile'] : $rec['email'];
if (strlen($tempMobile) > 20) {
    $tempMobile = substr($tempMobile, 0, 20); 
}

// 3. யூசர் டேட்டா தயார் செய்தல்
$userData = [
    'fullName'   => $rec['name'],
    'email'      => $rec['email'],
    'mobile'     => $tempMobile, 
    'profileFor' => $rec['relation'],
    'gender'     => $rec['gender'],
    'status'     => 'approved',
    'isPublic'   => 1,
    'password'   => password_hash('Temp@1234', PASSWORD_BCRYPT)
];

// 4. டைனமிக் இன்சர்ட் (Table columns-ஐச் சரிபார்த்து)
$colsSql = "SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'";
$stmtCols = $conn->prepare($colsSql);
$dbName = DB_NAME;
$stmtCols->bind_param('s', $dbName);
$stmtCols->execute();
$resCols = $stmtCols->get_result();

$columns = []; $values = []; $placeholders = [];

while ($col = $resCols->fetch_assoc()) {
    $c = $col['COLUMN_NAME'];
    if (in_array($c, ['id', 'createdAt', 'updatedAt'])) continue;

    if (array_key_exists($c, $userData)) {
        $val = $userData[$c];
    } elseif ($col['COLUMN_DEFAULT'] !== null) {
        $def = strtoupper($col['COLUMN_DEFAULT']);
        if (strpos($def, 'CURRENT_TIMESTAMP') !== false) continue;
        $val = $col['COLUMN_DEFAULT'];
    } elseif ($col['IS_NULLABLE'] === 'YES') {
        $val = null;
    } else {
        $type = strtolower($col['DATA_TYPE']);
        $val = ($type == 'date') ? '1990-01-01' : (($type == 'int') ? 0 : '');
    }

    $columns[] = $c;
    $values[] = $val;
    $placeholders[] = '?';
}

$sql = 'INSERT INTO users (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ')';
$ins = $conn->prepare($sql);
$types = str_repeat('s', count($values));
$ins->bind_param($types, ...$values);
$ok = $ins->execute();

if (!$ok) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'User creation failed: ' . $conn->error]);
    exit;
}

$userId = $ins->insert_id;

// 5. OTP டேபிளை அப்டேட் செய்தல்
$up = $conn->prepare('UPDATE otps SET userId = ? WHERE id = ?');
$up->bind_param('ii', $userId, $rec['id']);
$up->execute();

// 6. ரிசல்ட் அனுப்புதல்
$stmtU = $conn->prepare('SELECT * FROM users WHERE id = ?');
$stmtU->bind_param('i', $userId);
$stmtU->execute();
$userRow = $stmtU->get_result()->fetch_assoc();

echo json_encode(['status' => true, 'message' => 'OTP verified, user created', 'user' => $userRow]);
?>