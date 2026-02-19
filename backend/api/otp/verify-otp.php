<?php
header("Content-Type: application/json");

// DB Connection
$conn = new mysqli("localhost", "root", "jesi44", "matrimonydb");

if ($conn->connect_error) {
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$otp   = trim($data['otp'] ?? '');

if (!$email || !$otp) {
    echo json_encode([
        "message" => "Email and OTP required",
        "code" => "MISSING_FIELDS"
    ]);
    exit;
}

/* 🔍 Get latest OTP */
$stmt = $conn->prepare("
    SELECT * FROM otps 
    WHERE email=? 
    ORDER BY createdAt DESC 
    LIMIT 1
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$record = $result->fetch_assoc();

if (!$record) {
    echo json_encode([
        "message" => "No OTP found for this email",
        "code" => "INVALID_OTP"
    ]);
    exit;
}

/* ❌ Check OTP match */
if ($record['otp'] !== $otp) {
    echo json_encode([
        "message" => "Invalid OTP",
        "code" => "INVALID_OTP"
    ]);
    exit;
}

/* ⏰ Check expiry */
if (strtotime($record['expiresAt']) < time()) {
    echo json_encode([
        "message" => "OTP expired",
        "code" => "OTP_EXPIRED"
    ]);
    exit;
}

/* 🔐 Check user already exists */
$checkUser = $conn->prepare("SELECT id FROM users WHERE email=?");
$checkUser->bind_param("s", $email);
$checkUser->execute();
$checkUser->store_result();

if ($checkUser->num_rows > 0) {
    echo json_encode([
        "message" => "User already registered",
        "code" => "ALREADY_REGISTERED"
    ]);
    exit;
}

/* ✅ Create user */
$insert = $conn->prepare("
    INSERT INTO users 
    (fullName,email,profileFor,gender,status,isPublic,createdAt)
    VALUES (?,?,?,?,'approved',1,NOW())
");

$insert->bind_param(
    "ssss",
    $record['name'],
    $record['email'],
    $record['relation'],
    $record['gender']
);

$insert->execute();
$userId = $insert->insert_id;

/* 🧹 Delete used OTP */
$deleteOtp = $conn->prepare("DELETE FROM otps WHERE id=?");
$deleteOtp->bind_param("i", $record['id']);
$deleteOtp->execute();

echo json_encode([
    "message" => "OTP verified, user created!",
    "user" => [
        "id" => $userId,
        "fullName" => $record['name'],
        "email" => $record['email']
    ]
]);

$conn->close();
?>
