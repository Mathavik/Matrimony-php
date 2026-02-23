<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../../config/db.php");

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["message" => "User ID required"]);
    exit;
}

$fields = [];
$params = [];
$types = "";

/* =========================
   1️⃣ HANDLE IMAGE UPDATE
========================= */

if (isset($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === 0) {

    $uploadDir = __DIR__ . "/../../uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = pathinfo($_FILES["profilePhoto"]["name"], PATHINFO_EXTENSION);
    $fileName = uniqid() . "." . $extension;

    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["profilePhoto"]["tmp_name"], $targetPath)) {
        $fields[] = "profilePhoto=?";
        $params[] = $fileName;
        $types .= "s";
    }
}

/* =========================
   2️⃣ HANDLE OTHER FIELDS
========================= */

foreach ($_POST as $key => $value) {

    // ❌ Skip profilePhoto from POST
    if ($key === "profilePhoto") continue;

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

/* =========================
   3️⃣ FINAL QUERY
========================= */

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






