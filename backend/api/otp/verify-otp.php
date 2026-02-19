<?php
header("Content-Type: application/json");
require_once(__DIR__ . "/../../config/db.php");

// DB Connection
// $conn = new mysqli("localhost", "root", "maha", "matrimonydb");

if ($conn->connect_error) {
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$otp   = trim($data['otp'] ?? '');

if (!$email || !$otp) {
    echo json_encode(["message" => "Email and OTP required"]);
    exit;
}

/* 1. Get latest OTP details */
$stmt = $conn->prepare("SELECT * FROM otps WHERE email=? ORDER BY createdAt DESC LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$record = $stmt->get_result()->fetch_assoc();

if (!$record || $record['otp'] != $otp) {
    echo json_encode(["message" => "Invalid OTP"]);
    exit;
}

/* 2. Check expiry */
if (strtotime($record['expiresAt']) < time()) {
    echo json_encode(["message" => "OTP expired"]);
    exit;
}

/* 3. Check user already exists */
$checkUser = $conn->prepare("SELECT id FROM users WHERE email=?");
$checkUser->bind_param("s", $email);
$checkUser->execute();
if ($checkUser->get_result()->num_rows > 0) {
    echo json_encode(["message" => "User already registered"]);
    exit;
}

/* 4. Create User in 'users' table */
// Unga structure-la status ENUM, so 'approved' nu kudukrom
$insert = $conn->prepare("
    INSERT INTO users 
    (fullName, email, profileFor, gender, status, isPublic, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, 'approved', 1, NOW(), NOW())
");

$insert->bind_param(
    "ssss",
    $record['name'],
    $record['email'],
    $record['relation'],
    $record['gender']
);

if ($insert->execute()) {
    $newUserId = $conn->insert_id; // Intha ID dhaan Register ID

    /* 5. Update 'otps' table with this Register ID */
    $updateOtp = $conn->prepare("UPDATE otps SET registerUserId = ? WHERE id = ?");
    $updateOtp->bind_param("ii", $newUserId, $record['id']);
    $updateOtp->execute();

    echo json_encode([
        "message" => "OTP verified and user created!",
        "registerId" => $newUserId,
        "user" => [
            "fullName" => $record['name'],
            "email" => $record['email']
        ]
    ]);
} else {
    echo json_encode(["message" => "User creation failed", "error" => $conn->error]);
}

$conn->close();
?>
















<!-- <?php
header("Content-Type: application/json");

// DB Connection
$conn = new mysqli("localhost", "root", "maha", "matrimonydb");

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

/* Get latest OTP */
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

/* Check OTP match */
if ($record['otp'] != $otp) {
    echo json_encode([
        "message" => "Invalid OTP",
        "code" => "INVALID_OTP"
    ]);
    exit;
}

/* Check expiry */
if (strtotime($record['expiresAt']) < time()) {
    echo json_encode([
        "message" => "OTP expired",
        "code" => "OTP_EXPIRED"
    ]);
    exit;
}

/* Check user already exists */
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

/* Create user */
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




echo json_encode([
    "message" => "OTP verified, user created!",
    "user" => [
        "id" => $userId,
        "fullName" => $record['name'],
        "email" => $record['email']
    ]
]);

$conn->close();
?> -->
