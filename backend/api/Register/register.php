<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once(__DIR__ . "/../../config/db.php");

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed"]));
}

$data = $_POST;
$email = trim($data['email'] ?? '');

if (!$email) {
    echo json_encode(["message" => "Email required"]);
    exit;
}

/* =============================
   1️⃣ CHECK USER EXISTS
============================= */
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

/* =============================
   2️⃣ GET FORM VALUES FIRST
============================= */
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
$password = password_hash($data['password'] ?? '', PASSWORD_BCRYPT);

/* =============================
   3️⃣ HANDLE PHOTO UPLOAD
============================= */
$profilePhotoName = null;

if (isset($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === 0) {

    $uploadDir = __DIR__ . "/../../uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

$extension = pathinfo($_FILES["profilePhoto"]["name"], PATHINFO_EXTENSION);
$profilePhotoName = uniqid() . "." . $extension;
    $targetPath = $uploadDir . $profilePhotoName;

    if (!move_uploaded_file($_FILES["profilePhoto"]["tmp_name"], $targetPath)) {
        echo json_encode(["message" => "Photo upload failed"]);
        exit;
    }
}

/* =============================
   4️⃣ UPDATE USER
============================= */

if ($profilePhotoName) {

    $stmt = $conn->prepare("
        UPDATE users SET 
        dob=?, age=?, religion=?, motherTongue=?, maritalStatus=?, 
        caste=?, height=?, education=?, occupation=?, annualIncome=?, 
        country=?, state=?, city=?, mobile=?, password=?, 
        profilePhoto=?, 
        status='approved', updatedAt=NOW()
        WHERE id=?
    ");

    $stmt->bind_param(
        "sissssssssssssssi",
        $dob, $age, $religion, $mTongue, $mStatus,
        $caste, $height, $edu, $occ, $income,
        $country, $state, $city, $mobile, $password,
        $profilePhotoName,
        $userId
    );

} else {

    $stmt = $conn->prepare("
        UPDATE users SET 
        dob=?, age=?, religion=?, motherTongue=?, maritalStatus=?, 
        caste=?, height=?, education=?, occupation=?, annualIncome=?, 
        country=?, state=?, city=?, mobile=?, password=?, 
        status='approved', updatedAt=NOW()
        WHERE id=?
    ");

    $stmt->bind_param(
        "sisssssssssssssi",
        $dob, $age, $religion, $mTongue, $mStatus,
        $caste, $height, $edu, $occ, $income,
        $country, $state, $city, $mobile, $password,
        $userId
    );
}

/* =============================
   5️⃣ EXECUTE
============================= */

if ($stmt->execute()) {
    echo json_encode([
        "message" => "Registration Successful",
        "photo" => $profilePhotoName
    ]);
} else {
    echo json_encode([
        "message" => "Update failed",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>