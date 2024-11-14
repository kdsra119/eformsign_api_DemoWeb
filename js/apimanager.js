import { manageToken } from './tokenmanager.js';
import { config } from './config.js'; // 설정 파일을 불러옴

// 세션 스토리지에서 사용자 정보를 불러오는 함수
function getUserInfoFromSessionStorage() {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
}

// 사용자 정보를 가져오는 함수 (세션 스토리지 -> config.js 순으로 사용)
function getUserInfo() {
    const userInfoFromSession = getUserInfoFromSessionStorage();
    
    // 세션 스토리지에 사용자 정보가 있으면 사용하고, 없으면 config.js 사용
    return userInfoFromSession || config;
}

/**
 * API 요청을 처리하는 함수
 * 파일 다운로드와 JSON 응답을 Content-Type에 따라 구분합니다.
 * 
 * @param {string} url - 요청할 API URL
 * @param {string} [method='POST'] - HTTP 메서드 (기본값은 'POST')
 * @param {Object} [data=null] - 요청 본문에 포함할 데이터 (GET 요청의 경우 null)
 * @param {Object} [customHeaders={}] - 사용자 정의 헤더 (기본값은 빈 객체)
 * @param {boolean} [isFileDownload=false] - 파일 다운로드 여부를 설정하는 플래그
 * @returns {Promise<Object | void>} - API 응답 데이터를 JSON 형식으로 반환하거나 파일 다운로드를 처리
 */
export async function apiRequest(url, method = 'POST', data = null, apiDataHeaders = {}, isFileDownload = false) {
    try {
        // 사용자 정보를 가져옴 (세션 스토리지 또는 config.js)
        const userInfo = getUserInfo();
        const apiKey = userInfo.apiKey;
        const signatureToken = userInfo.signatureToken;
        const memberId = userInfo.memberId;

        console.log('API 요청 시작: ', { url, method, data });

        let accessToken = null;

        // Authorization에 API key인 경우는 manageToken()을 호출하지 않음.
        const hasApiKey = Object.entries(apiDataHeaders).some(([key, fieldInfo]) => {
            return fieldInfo.value && fieldInfo.value.includes('<api key>');
        });
        
        if (!hasApiKey) {
            const tokenData = await manageToken(apiKey, signatureToken, memberId);
            accessToken = tokenData.accessToken;
        }

        // API 요청을 위한 헤더 생성
        const headers = {};
        Object.entries(apiDataHeaders).forEach(([key, fieldInfo]) => {
            if (key === 'Authorization') {
                if (fieldInfo.value.includes('<api key>')) {
                    // Authorization에 API Key를 base64 인코딩하여 사용
                    const encodedApiKey = btoa(apiKey);
                    headers[key] = `Bearer ${encodedApiKey}`; // <api key>를 실제 API Key로 대체
                } else if (fieldInfo.value.includes('<access_token>')) {
                    // Authorization에 Access Token 사용
                    headers[key] = `Bearer ${accessToken}`; // <access_token>을 실제 Access Token으로 대체
                } else {
                    headers[key] = fieldInfo.value; // 기본적으로 제공된 value 그대로 사용
                }
            } else if (key === 'eformsign_signature') {
                headers[key] = `Bearer ${signatureToken}`; // eformsign_signature 처리
            } else {
                headers[key] = fieldInfo.value;
            }
        });


        // fetch API에 전달할 옵션 설정
        const options = {
            method: method, // HTTP 메서드를 설정 (POST, GET 등)
            headers: headers // 생성된 헤더를 포함
        };

        // 요청 바디에 데이터를 포함시킵니다. (GET 요청이지만 data가 존재할 경우에도 body에 추가)
        if (data && (method !== 'GET' || (method === 'GET' && Object.keys(data).length > 0))){
            options.body = JSON.stringify(data); // 데이터를 JSON 문자열로 변환하여 요청 본문에 추가
        }
        console.log(data);

        // **전송 전 preJsonPreview에 url과 options를 출력**
        const preJsonPreview = document.getElementById('preJsonPreview');
        if (preJsonPreview) {
            const displayOptions = { ...options };

            // GET 요청일 경우 body는 표시하지 않음
            if (method === 'GET') {
                delete displayOptions.body;
            }

            // JSON 문자열의 백슬래시를 제거하여 출력
            const formattedOptions = JSON.stringify(displayOptions, null, 4).replace(/\\/g, '');

            // preJsonPreview에 URL과 options 출력
            preJsonPreview.textContent = `URL: ${url}\n\nJSON:\n${formattedOptions}`;
        }

        // fetch API를 사용하여 API 요청을 수행합니다.
        const response = await fetch(url, options);

        // 응답 상태 코드가 200-299 범위 밖일 경우 오류를 발생시킵니다.
        if (!response.ok) {
            const errorText = await response.text();
            const errorStatue = response.status;

            // 응답 전체를 preJsonPreview에 출력 (에러 상황)
            if (preJsonPreview) {
                preJsonPreview.textContent += `\n\n에러 Status: ${errorStatue} \n 에러 응답 데이터:\n${errorText}`;
            }

            throw new Error(`HTTP error! status: ${response.status}, Response: ${errorText}`);
        }

        // 응답 Content-Type을 가져옵니다.
        const contentType = response.headers.get('Content-Type');
        if(!contentType){
            // 응답을 복사본으로 처리하여 본문을 여러 번 읽을 수 있도록 함
            const clonedResponse = response.clone();
            const responseText = await response.text(); // 응답을 텍스트로 받음
            console.log('Content-Type 없음, 응답 전체:', response);
            console.log('응답 텍스트:', responseText);

            if (preJsonPreview) {
                preJsonPreview.textContent += `\n\nContent-Type 없음, 응답 전체:\n${JSON.stringify(response, null, 4)}`;
                preJsonPreview.textContent += `\n\n응답 텍스트:\n${responseText}`;
            }

            // Base64로 인코딩된 이미지인지 확인
            if (responseText.startsWith('data:image/png;base64,')) {
                const base64Data = responseText.split(',')[1]; // Base64 데이터 부분만 추출
                const binaryString = atob(base64Data); // Base64 디코딩

                // 바이너리 데이터를 Blob 형태로 변환
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const blob = new Blob([bytes], { type: 'image/png' });
                const downloadUrl = window.URL.createObjectURL(blob);

                // 파일 다운로드를 위한 링크 생성 및 클릭
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'downloaded_image.png'; // 파일명 설정
                document.body.appendChild(a);
                a.click();
                a.remove();

                console.log('Base64 인코딩된 이미지 파일이 다운로드되었습니다.');
                return { message: `'Base64 인코딩된 이미지 파일이 다운로드되었습니다. \n\n ${base64Data}`};

            } else if (responseText.startsWith('�PNG')) { // PNG 파일인 경우
                // Blob으로 변환하여 다운로드 처리
                const blob = await clonedResponse.blob(); // 바이너리 데이터를 Blob으로 변환
                const downloadUrl = window.URL.createObjectURL(blob);

                // 파일 다운로드를 위한 링크 생성 및 클릭
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'downloaded_image.png'; // 파일명 설정
                document.body.appendChild(a);
                a.click();
                a.remove();

                console.log('PNG 파일이 다운로드되었습니다.');
                return { message: `PNG 파일이 다운로드되었습니다. \n\n 파일명 : ${a.download} \n\n 응답 : ${blob}`};
            } else if (responseText.includes('OZ Report File')) { // OZR 파일인 경우
                // "OZ Report File" 형식이 발견된 경우 처리
                // 파일 다운로드 처리
                const blob = new Blob([responseText], { type: 'application/octet-stream' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'oz_report_file.ozr'; // 파일명을 고정
                document.body.appendChild(a);
                a.click();
                a.remove();

                console.log("oz_report_file.ozr 파일이 다운로드되었습니다.");
                return { message: `oz_report_file.ozr 파일이 다운로드되었습니다. \n\n 파일명 : ${a.download} \n\n 응답 : ${blob}`};
            } else {
                // Content-Type이 없고, 응답이 예상되지 않은 형식인 경우 오류 처리
                throw new Error(`지원되지 않는 데이터 형식입니다. 응답 텍스트: ${responseText}`);
            }
        }

        // Content-Type에 따른 처리: 파일 다운로드 또는 JSON 응답
        if (contentType && contentType.includes('application/json')) {
            // JSON 응답 처리
            const jsonResponse = await response.json();

            // 전체 응답을 콘솔과 preJsonPreview에 출력
            console.log('전체 응답:', jsonResponse);

            if (preJsonPreview) {
                const formattedResponse = JSON.stringify(jsonResponse, null, 4);
                preJsonPreview.textContent += `\n\n응답 데이터:\n${formattedResponse}`;
            }

            return await jsonResponse;
        } else if (contentType && isFileDownload && (contentType.includes('application/pdf') || contentType.includes('application/zip') || contentType.includes('application/octet-stream'))) {
            // 파일 다운로드 처리
            const blob = await response.blob(); // 응답을 Blob 형태로 변환
            const contentDisposition = response.headers.get('Content-Disposition'); // 파일명을 위한 헤더 확인

            // 기본 파일명 설정 (헤더에 파일명이 없는 경우)
            let fileName = 'downloaded_file';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/); // 정규식으로 파일명 추출
                if (fileNameMatch && fileNameMatch.length > 1) {
                    fileName = fileNameMatch[1].replace(/["\\]/g, '').replace(/;/g, ''); // 이스케이프 문자와 세미콜론 제거
                    console.log("추출된 파일명: ", fileName); // 파일명을 확인
                }
            }

            const downloadUrl = window.URL.createObjectURL(blob); // Blob을 객체 URL로 변환

            // 파일 다운로드를 위한 링크 생성
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName; // 추출한 파일명 설정

            // 파일 다운로드
            document.body.appendChild(a);
            a.click();
            a.remove();

            // 파일 다운로드 응답 전체를 출력
            /*if (preJsonPreview) {
                preJsonPreview.textContent += `\n\n파일 다운로드 응답:\nContent-Disposition: ${contentDisposition}\n파일명: ${fileName}`;
            }*/

            // UI에 파일 다운로드 성공 정보 출력
            return { message: `파일이 다운로드되었습니다: ${fileName}, ${downloadUrl} \n Content-Disposition: ${contentDisposition}` };
        } else if(contentType) {
            // 지원되지 않는 Content-Type의 경우 전체 응답을 출력
            const responseText = await response.text();
            console.log('지원되지 않는 Content-Type 응답:', responseText);

            if (preJsonPreview) {
                preJsonPreview.textContent += `\n\n지원되지 않는 Content-Type 응답 데이터:\n${responseText}`;
            }
            throw new Error('Unsupported Content-Type received');
        }
    } catch (error) {
        // 오류 발생 시 콘솔에 로그를 출력하고 호출 함수로 오류를 전달합니다.
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
}

/* 2024.09.25
import { manageToken } from './tokenmanager.js';
import { config } from './config.js'; // 설정 파일을 불러옴

// 세션 스토리지에서 사용자 정보를 불러오는 함수
function getUserInfoFromSessionStorage() {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
}

// 사용자 정보를 가져오는 함수 (세션 스토리지 -> config.js 순으로 사용)
function getUserInfo() {
    const userInfoFromSession = getUserInfoFromSessionStorage();
    
    // 세션 스토리지에 사용자 정보가 있으면 사용하고, 없으면 config.js 사용
    return userInfoFromSession || config;
}

export async function apiRequest(url, method = 'POST', data = null, apiDataHeaders = {}, isFileDownload = false) {
    try {
        // 사용자 정보를 가져옴 (세션 스토리지 또는 config.js)
        const userInfo = getUserInfo();
        const apiKey = userInfo.apiKey;
        const signatureToken = userInfo.signatureToken;
        const memberId = userInfo.memberId;

        console.log('API 요청 시작: ', { url, method, data });

        // Apiauth-access 경우는 manageToken()을 호출하지 않고, API Key를 Authorization에 포함
        const isTokenAccessApi = url.includes('/api_auth/access_token') && data && data.execution_time;
        let accessToken = null;

        // Apiauth-refresh일 경우만 manageToken()을 통해 토큰을 갱신
        if (!isTokenAccessApi) {
            const tokenData = await manageToken(apiKey, signatureToken, memberId);
            accessToken = tokenData.accessToken;
        }

        // API 요청을 위한 헤더 생성
        const headers = {};
        Object.entries(apiDataHeaders).forEach(([key, fieldInfo]) => {
            if (key === 'Authorization') {
                if (fieldInfo.value.includes('<api key>')) {
                    // Authorization에 API Key를 base64 인코딩하여 사용
                    const encodedApiKey = btoa(apiKey);
                    headers[key] = `Bearer ${encodedApiKey}`; // <api key>를 실제 API Key로 대체
                } else if (fieldInfo.value.includes('<access_token>')) {
                    // Authorization에 Access Token 사용
                    headers[key] = `Bearer ${accessToken}`; // <access_token>을 실제 Access Token으로 대체
                } else {
                    headers[key] = fieldInfo.value; // 기본적으로 제공된 value 그대로 사용
                }
            } else if (key === 'eformsign_signature') {
                headers[key] = `Bearer ${signatureToken}`; // eformsign_signature 처리
            } else {
                headers[key] = fieldInfo.value;
            }
        });


        // fetch API에 전달할 옵션 설정
        const options = {
            method: method, // HTTP 메서드를 설정 (POST, GET 등)
            headers: headers // 생성된 헤더를 포함
        };

        // 요청 바디에 데이터를 포함시킵니다. (GET 요청 시에는 body를 생략)
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data); // 데이터를 JSON 문자열로 변환하여 요청 본문에 추가
        }
        console.log(data);

        // **전송 전 preJsonPreview에 url과 options를 출력**
        const preJsonPreview = document.getElementById('preJsonPreview');
        if (preJsonPreview) {
            const displayOptions = { ...options };

            // GET 요청일 경우 body는 표시하지 않음
            if (method === 'GET') {
                delete displayOptions.body;
            }

            // JSON 문자열의 백슬래시를 제거하여 출력
            const formattedOptions = JSON.stringify(displayOptions, null, 4).replace(/\\/g, '');

            // preJsonPreview에 URL과 options 출력
            preJsonPreview.textContent = `URL: ${url}\n\nJSON:\n${formattedOptions}`;
        }

        // fetch API를 사용하여 API 요청을 수행합니다.
        const response = await fetch(url, options);

        // 응답 상태 코드가 200-299 범위 밖일 경우 오류를 발생시킵니다.
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, Response: ${errorText}`);
        }

        // 응답 Content-Type을 가져옵니다.
        const contentType = response.headers.get('Content-Type');

        // Content-Type에 따른 처리: 파일 다운로드 또는 JSON 응답
        if (contentType.includes('application/json')) {
            // JSON 응답 처리
            return await response.json();
        } else if (isFileDownload && (contentType.includes('application/pdf') || contentType.includes('application/zip') || contentType.includes('application/octet-stream'))) {
            // 파일 다운로드 처리
            const blob = await response.blob(); // 응답을 Blob 형태로 변환
            const contentDisposition = response.headers.get('Content-Disposition'); // 파일명을 위한 헤더 확인

            // 기본 파일명 설정 (헤더에 파일명이 없는 경우)
            let fileName = 'downloaded_file';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/); // 정규식으로 파일명 추출
                if (fileNameMatch && fileNameMatch.length > 1) {
                    fileName = fileNameMatch[1].replace(/["\\]/g, '').replace(/;/g, ''); // 이스케이프 문자와 세미콜론 제거
                    console.log("추출된 파일명: ", fileName); // 파일명을 확인
                }
            }

            const downloadUrl = window.URL.createObjectURL(blob); // Blob을 객체 URL로 변환

            // 파일 다운로드를 위한 링크 생성
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName; // 추출한 파일명 설정

            // 파일 다운로드
            document.body.appendChild(a);
            a.click();
            a.remove();

            // UI에 파일 다운로드 성공 정보 출력
            return { message: `파일이 다운로드되었습니다: ${fileName}`, downloadUrl };
        } else {
            // 지원되지 않는 Content-Type의 경우 오류 발생
            throw new Error('Unsupported Content-Type received');
        }
    } catch (error) {
        // 오류 발생 시 콘솔에 로그를 출력하고 호출 함수로 오류를 전달합니다.
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
}
*/