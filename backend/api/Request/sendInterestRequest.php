<?php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../helpers/sendEmail.php";

$conn = getDBConnection();

$data = json_decode(file_get_contents("php://input"), true);

$senderId   = $data['senderId'] ?? null;
$receiverId = $data['receiverId'] ?? null;

if (!$senderId || !$receiverId) {
    echo json_encode(["message" => "Missing senderId or receiverId"]);
    exit;
}

/* ✅ 1. Check sender exists */
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $senderId);
$stmt->execute();
$sender = $stmt->get_result()->fetch_assoc();

if (!$sender) {
    echo json_encode(["message" => "Sender not found"]);
    exit;
}

/* ✅ 2. Check receiver exists */
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $receiverId);
$stmt->execute();
$receiver = $stmt->get_result()->fetch_assoc();

if (!$receiver) {
    echo json_encode(["message" => "Receiver not found"]);
    exit;
}

/* ✅ 3. Check receiver is premium */
$stmt = $conn->prepare("SELECT * FROM premiumpayments WHERE userId = ? AND status = 'success'");
$stmt->bind_param("i", $receiverId);
$stmt->execute();
$receiverPremium = $stmt->get_result()->fetch_assoc();

if (!$receiverPremium) {
    echo json_encode([
        "message" => "You can send requests only to Premium members."
    ]);
    exit;
}

/* ✅ 4. Check existing request (both directions) */
$stmt = $conn->prepare("
    SELECT * FROM interest_requests 
    WHERE (senderId = ? AND receiverId = ?) 
       OR (senderId = ? AND receiverId = ?)
");
$stmt->bind_param("iiii", $senderId, $receiverId, $receiverId, $senderId);
$stmt->execute();
$existingRequest = $stmt->get_result()->fetch_assoc();

if ($existingRequest) {

    if ($existingRequest['status'] == 'pending' || 
        $existingRequest['status'] == 'accepted') {

        echo json_encode([
            "message" => "Request already " . $existingRequest['status']
        ]);
        exit;
    }

    if ($existingRequest['status'] == 'rejected') {

        $updateStmt = $conn->prepare("UPDATE interest_requests SET status='pending' WHERE id=?");
        $updateStmt->bind_param("i", $existingRequest['id']);
        $updateStmt->execute();

        echo json_encode([
            "message" => "Request re-sent successfully."
        ]);
        exit;
    }
}

/* ✅ 5. Create new request */
// $stmt = $conn->prepare("INSERT INTO interest_requests (senderId, receiverId, status, createdAt, updatedAt) VALUES (?, ?, 'pending', NOW(), NOW())");
// $stmt->bind_param("ii", $senderId, $receiverId);
// $stmt->execute();

// echo json_encode([
//     "message" => "Interest request sent successfully"
// ]);

/* ✅ 5. Create new request */
$stmt = $conn->prepare("INSERT INTO interest_requests (senderId, receiverId, status, createdAt, updatedAt) VALUES (?, ?, 'pending', NOW(), NOW())");
$stmt->bind_param("ii", $senderId, $receiverId);
$stmt->execute();

$requestId = $stmt->insert_id;

/* ✅ 6. Send Email */

$BASE_URL = "http://localhost/Matrimony-php";

$acceptUrl = $BASE_URL . "/backend/api/Request/handleRequestResponse.php?requestId=" . $requestId . "&status=accepted";
$rejectUrl = $BASE_URL . "/backend/api/Request/handleRequestResponse.php?requestId=" . $requestId . "&status=rejected";

$subject = "New Interest Request from " . $sender['fullName'];

$html = "
<h2>New Interest Request 💌</h2>
<p><strong>{$sender['fullName']}</strong> has shown interest in your profile.</p>
<br/>
<a href='$acceptUrl' style='padding:10px;background:green;color:white;text-decoration:none;'>Accept</a>
&nbsp;&nbsp;
<a href='$rejectUrl' style='padding:10px;background:red;color:white;text-decoration:none;'>Reject</a>
";

$emailSent = sendEmail($receiver['email'], $subject, $html);

echo json_encode([
    "message" => "Interest request sent successfully",
    "emailSent" => $emailSent
]);
