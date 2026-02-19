<?php
header("Content-Type: application/json");
require_once(__DIR__ . "/../../config/db.php");

// Get id from URL
$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(["message" => "User ID required"]);
    exit;
}

// Hash password if provided
$password = !empty($_POST['password']) ? password_hash($_POST['password'], PASSWORD_BCRYPT) : null;

// Prepare SQL
$sql = "
UPDATE users SET
dob=?, age=?, religion=?, motherTongue=?, maritalStatus=?,
caste=?, height=?, education=?, occupation=?, annualIncome=?,
country=?, state=?, city=?, mobile=?";

$params = [
    $_POST['dob'] ?? null,
    $_POST['age'] ?? null,
    $_POST['religion'] ?? null,
    $_POST['motherTongue'] ?? null,
    $_POST['maritalStatus'] ?? null,
    $_POST['caste'] ?? null,
    $_POST['height'] ?? null,
    $_POST['education'] ?? null,
    $_POST['occupation'] ?? null,
    $_POST['annualIncome'] ?? null,
    $_POST['country'] ?? null,
    $_POST['state'] ?? null,
    $_POST['city'] ?? null,
    $_POST['mobile'] ?? null
];

// Add password if provided
if ($password) {
    $sql .= ", password=?";
    $params[] = $password;
}

// Add rules if provided
for ($i = 1; $i <= 5; $i++) {
    $rule = isset($_POST["rule$i"]) ? $_POST["rule$i"] : 0; // default to 0

    $sql .= ", rule$i=?";
    $params[] = $rule;
}

$sql .= ", updatedAt=NOW() WHERE id=?";
$params[] = $id;

// Bind types: s = string, i = int
$types = str_repeat("s", count($params)-1) . "i";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["message" => "User updated successfully"]);
} else {
    echo json_encode(["message" => "Update failed", "error" => $stmt->error]);
}

$conn->close();
?>
