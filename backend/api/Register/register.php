<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "maha", "matrimonydb");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$passwordInput = $data['password'] ?? '';

if (!$email || !$passwordInput) {
    echo json_encode(["message" => "Email and Password required"]);
    exit;
}

$password = password_hash($passwordInput, PASSWORD_BCRYPT);

$stmt = $conn->prepare("
INSERT INTO users (
profileFor, fullName, gender, dob, age, religion, motherTongue, maritalStatus,
caste, height, education, occupation, annualIncome,
country, state, city, email, mobile, password,
profilePhoto, status, isPremium, isPublic,
rule1, rule2, rule3, rule4, rule5,
createdAt, updatedAt
)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())
");

if (!$stmt) {
    die("Prepare Error: " . $conn->error);
}

$profilePhoto = "";
// Database-la length kammaiya irukkuradhala 'approved'-ku badhila '1' use pandrean
$status = "1"; 
$isPremium = 0;
$isPublic = 1;

// Assigning to variables to avoid 'passed by reference' error
$profileFor   = $data['profileFor'] ?? 'Self';
$fullName     = $data['fullName'] ?? '';
$gender       = $data['gender'] ?? '';
$dob          = $data['dob'] ?? '';
$age          = (int)($data['age'] ?? 0);
$religion     = $data['religion'] ?? '';
$motherTongue = $data['motherTongue'] ?? '';
$maritalStatus = $data['maritalStatus'] ?? '';
$caste        = $data['caste'] ?? '';
$height       = $data['height'] ?? '';
$education    = $data['education'] ?? '';
$occupation   = $data['occupation'] ?? '';
$annualIncome = $data['annualIncome'] ?? '';
$country      = $data['country'] ?? '';
$state        = $data['state'] ?? '';
$city         = $data['city'] ?? '';
$mobile       = $data['mobile'] ?? '';
$rule1        = (int)($data['rule1'] ?? 0);
$rule2        = (int)($data['rule2'] ?? 0);
$rule3        = (int)($data['rule3'] ?? 0);
$rule4        = (int)($data['rule4'] ?? 0);
$rule5        = (int)($data['rule5'] ?? 0);

$stmt->bind_param(
    "ssssisssssssssssssssiiiiiiii", 
    $profileFor,
    $fullName,
    $gender,
    $dob,
    $age,
    $religion,
    $motherTongue,
    $maritalStatus,
    $caste,
    $height,
    $education,
    $occupation,
    $annualIncome,
    $country,
    $state,
    $city,
    $email,
    $mobile,
    $password,
    $profilePhoto,
    $status,               
    $isPremium,            
    $isPublic,             
    $rule1,   
    $rule2,   
    $rule3,   
    $rule4,   
    $rule5    
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Registration successful"]);
} else {
    echo json_encode(["message" => "Registration failed", "error" => $stmt->error]);
}

$conn->close();
?>