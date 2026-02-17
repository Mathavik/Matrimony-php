<?php

function sendEmail($to, $subject, $text, $html = null) {
    // 1. .env ஃபைலில் இருந்து தரவுகளை எடுத்தல்
    $envFile = __DIR__ . '/../.env';
    $gmailEmail = '';
    $gmailPassword = '';
    
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $val) = explode('=', $line, 2);
                $key = trim($key);
                $val = trim($val);
                // உங்கள் .env பெயர்களுக்கு ஏற்ப இங்கே மாற்றப்பட்டுள்ளது
                if ($key === 'SMTP_USER') $gmailEmail = $val;
                if ($key === 'SMTP_PASS') $gmailPassword = $val;
            }
        }
    }
    
    // Fallback: ஒருவேளை .env லோட் ஆகவில்லை என்றால்
    if (empty($gmailEmail)) $gmailEmail = 'majesticjesi@gmail.com';
    if (empty($gmailPassword)) $gmailPassword = 'kiyx kxuo ojbb ljjc';
    
    if (empty($to) || empty($subject) || empty($text)) {
        return ['success' => false, 'error' => 'Missing required parameters'];
    }

    try {
        $body = $html ?: $text;
        $eol = "\r\n";
        
        // Email headers
        $headers = "MIME-Version: 1.0" . $eol;
        $headers .= "Content-Type: text/html; charset=UTF-8" . $eol;
        $headers .= "From: Matrimony <$gmailEmail>" . $eol;
        $headers .= "To: $to" . $eol;
        $headers .= "Subject: $subject" . $eol;
        
        $message = $headers . $eol . $body . $eol . "." . $eol;
        
        // Gmail SMTP Connection
        $context = stream_context_create([
            'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
        ]);
        
        $socket = @stream_socket_client('smtp.gmail.com:587', $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
        
        if (!$socket) return ['success' => false, 'error' => "Connection failed: $errstr"];
        
        // சர்வர் ரெஸ்பான்ஸ் படிக்க ஒரு ஹெல்ப்பர்
        $getResponse = function($s) {
            $r = "";
            while($l = fgets($s, 512)) {
                $r .= $l;
                if(substr($l, 3, 1) == " ") break;
            }
            return $r;
        };

        $getResponse($socket); // Read 220
        
        fwrite($socket, "EHLO localhost" . $eol);
        $getResponse($socket);
        
        fwrite($socket, "STARTTLS" . $eol);
        $getResponse($socket);
        
        // தற்போதைய கனெக்ஷனை பாதுகாப்பானதாக (Encrypted) மாற்றுதல்
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return ['success' => false, 'error' => 'TLS activation failed'];
        }
        
        fwrite($socket, "EHLO localhost" . $eol);
        $getResponse($socket);
        
        fwrite($socket, "AUTH LOGIN" . $eol);
        $getResponse($socket);
        
        fwrite($socket, base64_encode($gmailEmail) . $eol);
        $getResponse($socket);
        
        fwrite($socket, base64_encode($gmailPassword) . $eol);
        $authRes = $getResponse($socket);
        
        if (strpos($authRes, '235') === false) {
            fclose($socket);
            return ['success' => false, 'error' => 'Authentication failed. Check Gmail credentials.'];
        }
        
        fwrite($socket, "MAIL FROM:<$gmailEmail>" . $eol);
        $getResponse($socket);
        
        fwrite($socket, "RCPT TO:<$to>" . $eol);
        $getResponse($socket);
        
        fwrite($socket, "DATA" . $eol);
        $getResponse($socket);
        
        fwrite($socket, $message);
        $finalRes = $getResponse($socket);
        
        fwrite($socket, "QUIT" . $eol);
        fclose($socket);
        
        return (strpos($finalRes, '250') !== false) 
            ? ['success' => true, 'message' => 'Email sent successfully'] 
            : ['success' => false, 'error' => 'Email delivery failed'];
            
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}