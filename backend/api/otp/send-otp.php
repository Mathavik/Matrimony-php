<?php
header("Content-Type: application/json");
// require_once("../../config/db.php");
$conn = new mysqli("localhost", "root", "maha", "matrimonydb");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$name = $data['name'] ?? '';
$relation = $data['relation'] ?? '';
$gender = $data['gender'] ?? '';

if (!$email || !$name || !$relation || !$gender) {
    echo json_encode(["message" => "All fields required"]);
    exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "message" => "This email already registered",
        "code" => "ALREADY_REGISTERED"
    ]);
    exit;
}

$otp = rand(100000, 999999);
$expiresAt = date("Y-m-d H:i:s", strtotime("+5 minutes"));

$stmt = $conn->prepare("
INSERT INTO otps (email,name,relation,gender,otp,expiresAt,createdAt)
VALUES (?,?,?,?,?,?,NOW())
");

$stmt->bind_param("ssssss", $email, $name, $relation, $gender, $otp, $expiresAt);
$stmt->execute();

echo json_encode([
    "message" => "OTP sent successfully",
    "otp" => $otp
]);

$conn->close();
?>
