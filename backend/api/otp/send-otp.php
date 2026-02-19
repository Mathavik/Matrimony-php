<?php
header("Content-Type: application/json");

require_once("../../helpers/emailHelper.php");

$conn = new mysqli("localhost", "root", "maha", "matrimonydb");

if ($conn->connect_error) {
    die(json_encode(["message" => "DB connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);

$email    = trim($data['email'] ?? '');
$name     = trim($data['name'] ?? '');
$relation = trim($data['relation'] ?? '');
$gender   = trim($data['gender'] ?? '');

if (!$email || !$name || !$relation || !$gender) {
    echo json_encode(["message" => "All fields required"]);
    exit;
}

/* Generate OTP */
$otp = rand(100000, 999999);
$expiresAt = date("Y-m-d H:i:s", strtotime("+5 minutes"));

/* Delete old OTP */
$delete = $conn->prepare("DELETE FROM otps WHERE email=?");
$delete->bind_param("s", $email);
$delete->execute();

/* Insert OTP */
$stmt = $conn->prepare("
INSERT INTO otps 
(email,name,gender,relation,otp,expiresAt,registerUserId,createdAt,updatedAt)
VALUES (?,?,?,?,?,?,NULL,NOW(),NOW())
");

$stmt->bind_param(
    "ssssss",
    $email,
    $name,
    $gender,
    $relation,
    $otp,
    $expiresAt
);

if (!$stmt->execute()) {
    echo json_encode([
        "message" => "DB Insert Failed",
        "error" => $stmt->error
    ]);
    exit;
}

/* Send Email */
$subject = "Your OTP Verification Code";
$message = "
<h2>Hello $name</h2>
<p>Your OTP is:</p>
<h1>$otp</h1>
<p>This OTP valid for 5 minutes.</p>
";

sendEmail($email, $subject, $message, $message);

echo json_encode([
    "message" => "OTP sent successfully"
]);

$conn->close();
?>
