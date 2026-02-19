<?php
header("Content-Type: application/json");
require_once("../../config/db.php"); // un db connection path correct panniko

if ($conn->connect_error) {
    echo json_encode(["message" => "Connection failed"]);
    exit;
}

$sql = "SELECT 
            id,
            profileFor,
            fullName,
            gender,
            dob,
            age,
            religion,
            motherTongue,
            maritalStatus,
            caste,
            height,
            education,
            occupation,
            annualIncome,
            country,
            state,
            city,
            email,
            mobile,
            profilePhoto,
            status,
            isPremium,
            isPublic,
            createdAt
        FROM users
        ORDER BY createdAt DESC";

$result = $conn->query($sql);

$users = [];

if ($result->num_rows > 0) {

    $baseUrl = "http://localhost/matrimony-php/backend/uploads/";

    while ($row = $result->fetch_assoc()) {

        $row['profilePhoto'] = $row['profilePhoto']
            ? $baseUrl . $row['profilePhoto']
            : null;

        $users[] = $row;
    }

    echo json_encode([
        "message" => "Users fetched successfully",
        "users" => $users
    ]);

} else {
    echo json_encode([
        "message" => "No users found",
        "users" => []
    ]);
}

$conn->close();
?>
