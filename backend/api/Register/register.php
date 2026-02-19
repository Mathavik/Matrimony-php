<?php
header("Content-Type: application/json");
require_once(__DIR__ . "/../../config/db.php");

// $conn = new mysqli("localhost", "root", "maha", "matrimonydb");

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    echo json_encode(["message" => "Email required"]);
    exit;
}

// 1. Check if user was already created during OTP verification
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$res = $check->get_result();
$user = $res->fetch_assoc();

if (!$user) {
    echo json_encode(["message" => "User not found. Please verify OTP first."]);
    exit;
}

$userId = $user['id'];
$password = password_hash($data['password'] ?? '', PASSWORD_BCRYPT);

// 2. INSERT-ku badhila UPDATE use pandrom
$stmt = $conn->prepare("
    UPDATE users SET 
    dob = ?, age = ?, religion = ?, motherTongue = ?, maritalStatus = ?, 
    caste = ?, height = ?, education = ?, occupation = ?, annualIncome = ?, 
    country = ?, state = ?, city = ?, mobile = ?, password = ?, 
    status = 'approved', updatedAt = NOW()
    WHERE id = ?
");

// Pre-assign variables for bind_param
$dob = $data['dob'] ?? '';
$age = (int)($data['age'] ?? 0);
$religion = $data['religion'] ?? '';
$mTongue = $data['motherTongue'] ?? '';
$mStatus = $data['maritalStatus'] ?? '';
$caste = $data['caste'] ?? '';
$height = $data['height'] ?? '';
$edu = $data['education'] ?? '';
$occ = $data['occupation'] ?? '';
$income = $data['annualIncome'] ?? '';
$country = $data['country'] ?? '';
$state = $data['state'] ?? '';
$city = $data['city'] ?? '';
$mobile = $data['mobile'] ?? '';

$stmt->bind_param(
    "sisssssssssssssi", 
    $dob, $age, $religion, $mTongue, $mStatus, 
    $caste, $height, $edu, $occ, $income, 
    $country, $state, $city, $mobile, $password, 
    $userId
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Registration Successful (Profile Updated)"]);
} else {
    echo json_encode(["message" => "Update failed", "error" => $stmt->error]);
}

$conn->close();
?>