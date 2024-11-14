import { config } from './config.js';

// 사용자 정보를 세션 스토리지에서 불러오는 함수
function getUserInfoFromSessionStorage() {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
}

// URL에서 특정 파라미터를 추출하는 함수
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);

    // 소문자로 변환하여 비교
    const lowerCaseParams = new URLSearchParams(
        Array.from(urlParams.entries()).map(([key, value]) => [key.toLowerCase(), value])
    );

    // 파라미터 이름을 소문자로 변환하여 조회
    const value = lowerCaseParams.get(name.toLowerCase());
    
    console.log(`URL : ${window.location.search}`);
    console.log(`Parameter: ${name}, Value: ${value}`);  // 로그 추가
    return value;
}

// 사용자 정보를 가져오는 함수 (세션 스토리지 -> config.js 순으로 사용)
function getUserInfo() {
    const useConfig = getUrlParameter('useConfig');

    // URL 파라미터가 있을 때 config.js 정보를 사용
    if (useConfig === 'true') {
        return config;
    }

    // 세션 스토리지에서 사용자 정보를 불러옴
    const userInfoFromSession = getUserInfoFromSessionStorage();
    return userInfoFromSession || null;
}

// 사용자 정보를 초기화하는 함수
export async function initializeUserInfo() {
    const userInfo = getUserInfo();

    // 세션 스토리지에 정보가 없으면 사용자 입력창 띄움
    if (!userInfo) {
        showUserInputForm();
        return false; // 사용자 정보 입력이 필요함을 알림
    } else {
        console.log("사용자 정보:", userInfo);
        return true; // 사용자 정보가 이미 초기화됨을 알림
    }
}

// 사용자 정보를 입력하는 창을 띄우는 함수
function showUserInputForm() {
    const formHtml = `
        <div class="login-container">
            <img src="eformsign.png" alt="eformsign 로고">
            <h2>사용자 정보 입력</h2>
            <div class="input-group">
                <label for="apiKey">API Key</label>
                <input type="text" id="apiKey" placeholder="API Key를 입력하세요">
            </div>
            <div class="input-group">
                <label for="signatureToken">Signature Token</label>
                <input type="text" id="signatureToken" placeholder="Signature Token을 입력하세요">
            </div>
            <div class="input-group">
                <label for="memberId">Member ID</label>
                <input type="text" id="memberId" placeholder="Member ID를 입력하세요">
            </div>
            <button class="login-button" onclick="saveUserInfo()">저장</button>
        </div>
    `;
    document.getElementById('loginContainer').innerHTML = formHtml; // 사용자 입력창을 표시
}

// 사용자가 정보를 입력하면 세션 스토리지에 저장하는 함수
export function saveUserInfo() {
    const newUserInfo = {
        apiKey: document.getElementById('apiKey').value,
        signatureToken: document.getElementById('signatureToken').value,
        memberId: document.getElementById('memberId').value,
    };

    sessionStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    console.log("사용자 정보가 저장되었습니다:", newUserInfo);
    location.reload(); // 새로고침하여 정보 적용
}
