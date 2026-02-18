<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$email = $_POST['email'] ?? '';

if (!$email) {
    echo json_encode(["message"=>"Email required"]);
    exit;
}

$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("
UPDATE users SET
dob=?, age=?, religion=?, motherTongue=?, maritalStatus=?,
caste=?, height=?, education=?, occupation=?, annualIncome=?,
country=?, state=?, city=?, mobile=?, password=?,
rule1=?, rule2=?, rule3=?, rule4=?, rule5=?,
updatedAt=NOW()
WHERE email=?
");

$stmt->bind_param(
"sssssssssssssssiiiii s",
$_POST['dob'],
$_POST['age'],
$_POST['religion'],
$_POST['motherTongue'],
$_POST['maritalStatus'],
$_POST['caste'],
$_POST['height'],
$_POST['education'],
$_POST['occupation'],
$_POST['annualIncome'],
$_POST['country'],
$_POST['state'],
$_POST['city'],
$_POST['mobile'],
$password,
$_POST['rule1'],
$_POST['rule2'],
$_POST['rule3'],
$_POST['rule4'],
$_POST['rule5'],
$email
);

$stmt->execute();

echo json_encode(["message"=>"Registration completed"]);

$conn->close();
?>
