// API 요청에 필요한 헤더를 생성하는 함수
export function getHeaders(apiKey, signatureToken) {
    const encodedApiKey = btoa(apiKey); // base64 인코딩 (브라우저에서 기본 제공)
    const headers = {
        "Content-Type": "application/json",
        "eformsign_signature": `Bearer ${signatureToken}`,
        "Authorization": `Bearer ${encodedApiKey}`
    };
    return headers;
}

// 액세스 토큰을 관리하는 함수
export async function manageToken(apiKey, signatureToken, memberId, refreshToken = null, tokenExpiry = null) {
    // 토큰이 존재하고, 만료되지 않았다면 기존 토큰을 사용
    if (refreshToken && tokenExpiry && Date.now() < tokenExpiry) {
        return { accessToken: refreshToken, tokenExpiry };
    }

    // 새로 토큰을 발급받기 위한 API 호출
    const url = "https://api.eformsign.com/v2.0/api_auth/access_token";
    const headers = getHeaders(apiKey, signatureToken);
    const payload = {
        "execution_time": Date.now().toString(),
        "member_id": memberId
    };

    // Refresh Token이 존재하는 경우 payload에 추가
    if (refreshToken) {
        payload["refresh_token"] = refreshToken;
    }

    // API 호출로 토큰 발급 요청
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const tokenData = await response.json();
        const accessToken = tokenData['oauth_token']['access_token'];
        const newRefreshToken = tokenData['oauth_token']['refresh_token'];
        const expiresIn = tokenData['oauth_token']['expires_in'];
        const tokenExpiry = Date.now() + expiresIn * 1000;

        return { accessToken, refreshToken: newRefreshToken, tokenExpiry };
    } else {
        throw new Error(`Failed to retrieve access token. Status code: ${response.status}, Response: ${await response.text()}`);
    }
}
