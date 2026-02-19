<?php
header("Content-Type: application/json");
// require_once("../../config/db.php");

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

$password = password_hash($passwordInput,PASSWORD_BCRYPT);

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
$status = "approved";
$isPremium = 0;
$isPublic = 1;

$stmt->bind_param(
    "ssssisssssssssssssssiiiiiii", // Total 28 characters
    $data['profileFor'],
    $data['fullName'],
    $data['gender'],
    $data['dob'],
    $data['age'],          // i
    $data['religion'],
    $data['motherTongue'],
    $data['maritalStatus'],
    $data['caste'],
    $data['height'],
    $data['education'],
    $data['occupation'],
    $data['annualIncome'],
    $data['country'],
    $data['state'],
    $data['city'],
    $email,
    $data['mobile'],
    $password,
    $profilePhoto,
    $status,               // s
    $isPremium,            // i
    $isPublic,             // i
    $data['rule1'],        // i
    $data['rule2'],        // i
    $data['rule3'],        // i
    $data['rule4'],        // i
    $data['rule5']         // i
);



if ($stmt->execute()) {
    echo json_encode(["message" => "Registration successful"]);
} else {
    echo json_encode(["message" => "Registration failed", "error" => $stmt->error]);
}

$conn->close();
?>
