<?php
header("Content-Type: application/json");
require_once(__DIR__ . "/../../config/db.php");

/* Support JSON + form-data */
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $names = $data['names'] ?? '';
    $location = $data['location'] ?? '';
    $date = $data['date'] ?? 'Recently';
    $story = $data['story'] ?? '';
    $userId = $data['userId'] ?? 0;
    $color = $data['color'] ?? 'from-rose-500 to-pink-600';
} else {
    $names = $_POST['names'] ?? '';
    $location = $_POST['location'] ?? '';
    $date = $_POST['date'] ?? 'Recently';
    $story = $_POST['story'] ?? '';
    $userId = $_POST['userId'] ?? 0;
    $color = $_POST['color'] ?? 'from-rose-500 to-pink-600';
}

/* Validation */
if (!$names || !$location || !$story || !$userId) {
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

if (strlen(trim($story)) < 164) {
    echo json_encode(["message" => "Story must have at least 164 characters"]);
    exit;
}

/* Default Image */
$imagePath = "uploads/default_couple.png";

/* Handle Image Upload (only if form-data used) */
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {

    $uploadDir = __DIR__ . "/../../uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = time() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        $imagePath = "uploads/" . $fileName;
    }
}

/* Insert Query */
$stmt = $conn->prepare("
INSERT INTO success_stories 
(names, location, marriedDate, story, testimonial, image, userId, isFeatured, color, createdAt, updatedAt) 
VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, NOW(), NOW())
");

$stmt->bind_param(
    "ssssssis",
    $names,
    $location,
    $date,
    $story,
    $story,
    $imagePath,
    $userId,
    $color
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Story submitted successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
