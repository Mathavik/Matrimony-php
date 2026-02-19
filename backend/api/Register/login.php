<?php
header("Content-Type: application/json");
require_once("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["message" => "Email and Password required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, fullName, email, password FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["message" => "Invalid credentials"]);
    exit;
}

if (!password_verify($password, $user['password'])) {
    echo json_encode(["message" => "Invalid credentials"]);
    exit;
}

echo json_encode([
    "message" => "Login successful",
    "user" => [
        "id" => $user['id'],
        "fullName" => $user['fullName'],
        "email" => $user['email']
    ]
]);

$conn->close();
?>
