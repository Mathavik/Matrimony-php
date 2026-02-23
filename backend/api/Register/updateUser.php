<?php
header("Content-Type: application/json");
require_once("../../config/db.php");

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["message" => "User ID required"]);
    exit;
}

$fields = [];
$params = [];
$types = "";

foreach ($_POST as $key => $value) {

    if ($key === "password" && !empty($value)) {
        $value = password_hash($value, PASSWORD_BCRYPT);
    }

    if ($key === "isPublic") {
        $value = (int)$value;
        $types .= "i";
    } else {
        $types .= "s";
    }

    $fields[] = "$key=?";
    $params[] = $value;
}

if (empty($fields)) {
    echo json_encode(["message" => "No data to update"]);
    exit;
}

$sql = "UPDATE users SET " . implode(",", $fields) . ", updatedAt=NOW() WHERE id=?";
$params[] = $id;
$types .= "i";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["message" => "User updated successfully"]);
} else {
    echo json_encode([
        "message" => "Update failed",
        "error" => $stmt->error
    ]);
}

$conn->close();
?>