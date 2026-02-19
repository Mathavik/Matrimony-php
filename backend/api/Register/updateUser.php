<?php
header("Content-Type: application/json");
require_once("../../config/db.php");

if ($conn->connect_error) {
    echo json_encode(["message" => "Connection failed"]);
    exit;
}

// PUT method la body read panna
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? '';

if (!$id) {
    echo json_encode(["message" => "User ID required"]);
    exit;
}

// 1️⃣ Check user exists
$check = $conn->prepare("SELECT * FROM users WHERE id = ?");
$check->bind_param("i", $id);
$check->execute();
$result = $check->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["message" => "User not found"]);
    exit;
}

// 2️⃣ Assign values
$profileFor     = $data['profileFor'] ?? $user['profileFor'];
$fullName       = $data['fullName'] ?? $user['fullName'];
$gender         = $data['gender'] ?? $user['gender'];
$dob            = $data['dob'] ?? $user['dob'];
$age            = $data['age'] ?? $user['age'];
$religion       = $data['religion'] ?? $user['religion'];
$motherTongue   = $data['motherTongue'] ?? $user['motherTongue'];
$maritalStatus  = $data['maritalStatus'] ?? $user['maritalStatus'];
$caste          = $data['caste'] ?? $user['caste'];
$height         = $data['height'] ?? $user['height'];
$education      = $data['education'] ?? $user['education'];
$occupation     = $data['occupation'] ?? $user['occupation'];
$annualIncome   = $data['annualIncome'] ?? $user['annualIncome'];
$country        = $data['country'] ?? $user['country'];
$state          = $data['state'] ?? $user['state'];
$city           = $data['city'] ?? $user['city'];
$email          = $data['email'] ?? $user['email'];
$mobile         = $data['mobile'] ?? $user['mobile'];
$isPublic       = isset($data['isPublic']) ? (int)$data['isPublic'] : $user['isPublic'];

// Password update panna sonna mattum hash pannum
$password = $user['password'];
if (!empty($data['password'])) {
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
}

// 3️⃣ Update query
$stmt = $conn->prepare("
UPDATE users SET
profileFor=?, fullName=?, gender=?, dob=?, age=?, religion=?, motherTongue=?, 
maritalStatus=?, caste=?, height=?, education=?, occupation=?, annualIncome=?, 
country=?, state=?, city=?, email=?, mobile=?, password=?, isPublic=?, updatedAt=NOW()
WHERE id=?
");

$stmt->bind_param(
"ssssisssssssssssssiii",
$profileFor, $fullName, $gender, $dob, $age, $religion, $motherTongue,
$maritalStatus, $caste, $height, $education, $occupation, $annualIncome,
$country, $state, $city, $email, $mobile, $password, $isPublic, $id
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Profile updated successfully"]);
} else {
    echo json_encode(["message" => "Update failed", "error" => $stmt->error]);
}

$conn->close();
?>
