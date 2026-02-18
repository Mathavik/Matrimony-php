<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(["message"=>"Invalid credentials"]);
    exit;
}

echo json_encode([
    "message"=>"Login successful",
    "user"=>[
        "id"=>$user['id'],
        "fullName"=>$user['fullName'],
        "email"=>$user['email']
    ]
]);

$conn->close();
?>
