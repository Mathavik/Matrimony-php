<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/emailHelper.php';

$conn = getDBConnection();

$data = $_POST;
// allow JSON body as well
if (empty($data)) {
    $raw = file_get_contents('php://input');
    $tmp = json_decode($raw, true);
    if (is_array($tmp)) $data = $tmp;
}

$email = isset($data['email']) ? trim($data['email']) : null;
$name = isset($data['name']) ? trim($data['name']) : null;
$relation = isset($data['relation']) ? trim($data['relation']) : null;
$gender = isset($data['gender']) ? trim($data['gender']) : null;

if (!$email || !$name || !$relation || !$gender) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'email, name, relation and gender are required']);
    exit;
}

// Check existing user
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'This email is already registered', 'code' => 'ALREADY_REGISTERED']);
    exit;
}

// Generate 6-digit OTP
$otp = strval(rand(100000, 999999));
$expiresAt = date('Y-m-d H:i:s', time() + 5 * 60); // 5 minutes from now

// Insert OTP into database
$ins = $conn->prepare('INSERT INTO otps (email, name, relation, gender, otp, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())');
if (!$ins) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Database error', 'error' => $conn->error]);
    exit;
}

$ins->bind_param('ssssss', $email, $name, $relation, $gender, $otp, $expiresAt);
$ok = $ins->execute();

if (!$ok) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Failed to create OTP']);
    exit;
}

// Send OTP email using Gmail SMTP
$subject = 'Your OTP Code - Matrimony Registration';
$text = "Hello $name,\n\nYour OTP is: $otp\n\nIt expires in 5 minutes.\n\nDo not share this with anyone.\n\nBest regards,\nMatrimony Team";

$html = "
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2 style='color: #d946a6;'>Matrimony Registration OTP</h2>
    <p>Hello <strong>$name</strong>,</p>
    <p>Your OTP code is:</p>
    <h1 style='color: #d946a6; letter-spacing: 2px;'>$otp</h1>
    <p><strong>This OTP expires in 5 minutes.</strong></p>
    <p style='color: red;'><strong>⚠️ Do not share this code with anyone.</strong></p>
    <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
    <p style='color: #999; font-size: 12px;'>Best regards,<br>Matrimony Team</p>
</body>
</html>
";

$emailResult = sendEmail($email, $subject, $text, $html);

echo json_encode([
    'status' => true,
    'message' => $emailResult['success'] ? 'OTP sent successfully' : 'OTP created but email delivery failed',
    'otp' => $otp, // for testing only — remove in production
    'emailSent' => $emailResult['success'],
    'emailMethod' => $emailResult['method'] ?? 'unknown',
    'emailError' => $emailResult['error'] ?? null
]);
?>
