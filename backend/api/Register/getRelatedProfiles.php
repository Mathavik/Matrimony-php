<?php
header("Content-Type: application/json");
require_once "../../config/db.php"; // un db connection file path correct ah set pannu

if (!isset($_GET['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit;
}

$id = intval($_GET['id']);

// 1️⃣ Get current user
$currentUserQuery = $conn->prepare("SELECT country, gender FROM users WHERE id = ?");
$currentUserQuery->bind_param("i", $id);
$currentUserQuery->execute();
$currentResult = $currentUserQuery->get_result();

if ($currentResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
    exit;
}

$currentUser = $currentResult->fetch_assoc();
$country = $currentUser['country'];
$gender  = $currentUser['gender'];

// 2️⃣ Get related users
$relatedQuery = $conn->prepare("
    SELECT * FROM users 
    WHERE country = ? 
    AND gender = ? 
    AND id != ? 
    AND isPublic = 1
    ORDER BY createdAt DESC
");

$relatedQuery->bind_param("ssi", $country, $gender, $id);
$relatedQuery->execute();
$result = $relatedQuery->get_result();

$profiles = [];

while ($row = $result->fetch_assoc()) {

    if (!empty($row['profilePhoto'])) {
        $row['profilePhoto'] = "http://localhost/matrimony/uploads/" . $row['profilePhoto'];
    } else {
        $row['profilePhoto'] = null;
    }

    $profiles[] = $row;
}

echo json_encode([
    "success" => true,
    "relatedProfiles" => $profiles
]);