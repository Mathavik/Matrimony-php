<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode([
        "status" => false,
        "message" => "Email and Password required"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id, fullName, email, password FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid credentials"
    ]);
    exit;
}

if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid credentials"
    ]);
    exit;
}

/* 🔥 Dummy token generate (simple) */
$token = base64_encode($user['email'] . time());

echo json_encode([
    "status" => true,
    "message" => "Login successful",
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "fullName" => $user['fullName'],
        "email" => $user['email']
    ]
]);

$conn->close();
?>
