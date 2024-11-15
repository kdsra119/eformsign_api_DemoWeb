import { categories } from './categories.js';
import { apiRequest } from './apimanager.js'; // apiManager.js에서 apiRequest 함수 가져오기
import { renderForm } from './formmanager.js'; // 폼 렌더링 함수 가져오기
import { validateForm, validateRequestBody } from './validation.js'; //validation 함수 가져오기

let currentApiName = null;
let currentApiData = null;

export function loadCategories() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let categoryHTML = '<h3>API 카테고리</h3>';

    // 카테고리 로드
    categories.forEach(category => {
        // id가 'embedding-demo'인 경우 특별한 동작 설정
        if (category.id === 'embedding-demo') {
            categoryHTML += `<button onclick="openEmbeddingPopup()">${category.name}</button>`;
        } else {
            categoryHTML += `<button onclick="toggleDropdown('${category.id}')">${category.name}</button>`;
        }
        categoryHTML += `<div id="${category.id}" class="dropdown-content" style="display: none;">`;

        // 소분류 로드
        category.subcategories.forEach(subcat => {
            if (subcat.subgroups) {
                // 하위 그룹 로드
                categoryHTML += `<button onclick="toggleDropdown('${subcat.id}')">${subcat.name}</button>`;
                categoryHTML += `<div id="${subcat.id}" class="dropdown-content" style="display: none;">`;

                // 하위 그룹의 소분류 표시
                subcat.subgroups.forEach(subgroup => {
                    categoryHTML += `<a href="#" onclick="showForm('${subgroup.id}')">${subgroup.name}</a>`;
                });
                categoryHTML += `</div>`;
            } else {
                // 하위 그룹이 없는 경우
                categoryHTML += `<a href="#" onclick="showForm('${subcat.id}')">${subcat.name}</a>`;
            }
        });

        categoryHTML += `</div>`;
    });

    // 생성된 HTML을 사이드바에 삽입
    sidebar.innerHTML = categoryHTML;
}

// 새 창 팝업 호출 함수
function openEmbeddingPopup() {
    const popupUrl = "https://eformsign-api-demo-web.vercel.app/webhook.html";
    const popupOptions = "width=800,height=600,scrollbars=yes,resizable=yes";
    window.open(popupUrl, "Embedding Demo", popupOptions);
}

export function toggleDropdown(categoryId) {
    const dropdownContent = document.getElementById(categoryId);
    if (dropdownContent) {
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    }
}

// uimanager.js

export async function showForm(apiName) {
    const category = apiName.split('-')[0];
    const module = await import(`./api/${category}.js`);
    const apiData = module.apis[apiName];

    if (!apiData) {
        console.log('해당 API를 찾을 수 없습니다:', apiName);
        return;
    }

    toggleSidebar();  // 폼이 로드될 때 사이드바를 자동으로 닫음

    // preview 영역 초기화
    const preJsonPreview = document.getElementById('preJsonPreview');
    const jsonPreview = document.getElementById('jsonPreview');
    if (preJsonPreview) preJsonPreview.textContent = '';
    if (jsonPreview) jsonPreview.textContent = '';

    // 전역 변수에 API 정보 저장
    currentApiName = apiName;
    currentApiData = apiData;

    // 메뉴 선택 시 QueryString 상태 초기화 toggleQueryString()을 renderForm()에서 한번 더 진행하기에 주석처리
    /*const queryStringCheckbox = document.getElementById('queryStringCheckbox');
    if (queryStringCheckbox) {
        queryStringCheckbox.checked = false; // 초기화
        toggleQueryString(); // QueryString을 초기화 상태로 감춤
    }*/


    // **메뉴 선택 시 폼 데이터 초기화**
    const finalUrlElement = document.getElementById('finalUrl');
    const requestBodyTextarea = document.getElementById('requestBody');
    
    if (finalUrlElement) {
        finalUrlElement.value = ''; // finalUrl 초기화
    }

    if (requestBodyTextarea) {
        requestBodyTextarea.value = ''; // requestBody 초기화
    }


    // 메뉴 선택 시 폼 데이터를 한 번만 초기화하고 렌더링
    renderForm(currentApiName, currentApiData);  // 여기서 renderForm() 호출

    // 첫 번째 탭을 기본으로 렌더링하면서 showTab() 호출
    showTab('urlTab');  
}


// 전역 변수를 사용하여 API 이름과 데이터를 참조
export async function executeButton() {
    const apiName = currentApiName;  // 전역 변수에서 가져옴
    const apiData = currentApiData;  // 전역 변수에서 가져옴
    const queryStringCheckbox = document.getElementById('queryStringCheckbox');

    if (!apiName || !apiData) {
        console.error("API 정보가 설정되지 않았습니다.");
        return;
    }

    let formDataCollected = {};

    // 1. URL 및 QueryString validation (동적 URL 필드 및 QueryString 필드의 필수값 확인)
    if (apiData.dynamicUrlField) {
        const dynamicUrlValid = validateForm(apiData.dynamicUrlField);
        if (!dynamicUrlValid) {
            alert('동적 URL 필드가 비어 있습니다. 필수 항목을 확인하세요.');
            return;
        }
    }

    if (apiData.queryStringField) {
        const queryStringValid = validateForm(apiData.queryStringField);
        if (!queryStringValid) {
            alert('QueryString 필드가 비어 있습니다. 필수 항목을 확인하세요.');
            return;
        }
    }

    // 2. requestBody 검증
    const requestBodyElement = document.getElementById('requestBody');
    if (requestBodyElement) {
        let requestBodyText = requestBodyElement.value.trim();

        // body 자체가 없는 경우 예외처리
        if (!apiData.body || Object.keys(apiData.body).length === 0) {
            // body가 필요 없는 API일 때도 formDataCollected는 빈 객체로 설정
            formDataCollected = {};
        } else {
            // JSON 스키마에 따라 필수 값 검증
            if (!validateRequestBody(apiData.body.properties)) {
                return; // 필수 값 검증 실패 시 API 요청 중단
            }

            try {
                // "RequestBody 입력이 필요 없는 API 입니다" 기본 메시지가 있는 경우 처리
                if (requestBodyText === "RequestBody 입력이 필요 없는 API 입니다") {
                    requestBodyText = '{}'; // 기본 메시지를 빈 JSON 객체로 대체
                }

                // JSON으로 파싱
                const requestBodyJson = JSON.parse(requestBodyText);

                // 빈 값이 아닌 항목만 formDataCollected에 추가
                formDataCollected = requestBodyJson;

            } catch (error) {
                console.error('Request Body를 JSON으로 변환하는 데 실패했습니다:', error.message);
                alert(`JSON 형식 오류: ${error.message}\n올바른 JSON 형식이어야 합니다.`);
                return;  // 잘못된 형식일 경우 실행 중단
            }
        }
    } else {
        console.error('Request Body를 찾을 수 없습니다.');
        return;
    }


    // 기본 URL 설정
    let url = apiData.url;

    let dynamicUrlParts = []; // URL에 추가될 동적 필드들을 저장
    let subpathParts = []; // 서브패스 뒤에 추가될 동적 필드들을 저장

    // **동적 URL 필드 값 추가**: 동적 URL 필드가 필수이고 값이 비어있으면 오류 메시지 출력    
    if (apiData.dynamicUrlField) {
        Object.entries(apiData.dynamicUrlField).forEach(([key, fieldInfo]) => {
            const dynamicFieldElement = document.getElementById(key);
            const dynamicFieldValue = dynamicFieldElement ? dynamicFieldElement.value.trim() : fieldInfo.value;

            if (fieldInfo.required && !dynamicFieldValue) {
                alert(`동적 필드 ${key}는 필수입니다.`);
                return; // 필수 값이 없으면 실행 중단
            }

            /*if (dynamicFieldValue) {
                url = `${url}/${dynamicFieldValue}`; // 동적 URL 필드 값을 URL에 추가 (기존 코드. 2024.11.04. subpath 뒤에 입력부분 추가)
            }*/

            // 필드 위치에 따라 처리
            if (fieldInfo.position === 'subpath') {
                subpathParts.push(dynamicFieldValue); // 서브패스 뒤에 추가
            } else {
                dynamicUrlParts.push(dynamicFieldValue); // URL 뒤에 추가
            }           
        });
    }

    // URL에 dynamicUrlParts 추가
    for (let i = 0; i < dynamicUrlParts.length; i++){
        url = `${url}/${dynamicUrlParts.join('/')}`;
    }

    // **서브패스 추가**: subpath 값이 있는 경우 URL 뒤에 추가
    if (apiData.subpath) {
        url = `${url}${apiData.subpath}`;
    }

    // URL에 subpathParts 추가
    for (let i = 0; i < subpathParts.length; i++){
        url = `${url}/${subpathParts.join('/')}`;
    }

    // **쿼리 스트링 필드 값 추가**: queryStringField 값이 있으면 직접 쿼리 파라미터로 변환
    let queryString = '';
    if (apiData.queryStringField && queryStringCheckbox.checked) {          //2024.11.04 queryStringCheckbox.checked일 경우 로직 추가
        const queryParts = [];

        Object.entries(apiData.queryStringField).forEach(([key, fieldInfo]) => {
            const queryFieldElement = document.getElementById(key);
            const fieldCheckbox = document.getElementById(`checkbox_${key}`);
            /*const queryFieldValue = queryFieldElement ? queryFieldElement.value : fieldInfo.value;

            // 필드 값이 false가 아니거나 undefined가 아니면 추가           //2024.11.04 기존 코드 주석 처리
            if (queryFieldValue !== false && queryFieldValue !== undefined && queryFieldValue !== null) {
                // 콤마가 포함된 경우에는 인코딩하지 않고 그대로 사용
                if (queryFieldValue.includes(',')) {
                    queryParts.push(`${encodeURIComponent(key)}=${queryFieldValue}`);
                } else {
                    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(queryFieldValue)}`);
                }
            }*/
            // 필드 체크박스가 체크된 경우에만 값을 가져옴
            if (fieldCheckbox && fieldCheckbox.checked) {
                const queryFieldValue = queryFieldElement ? queryFieldElement.value : fieldInfo.value;

                // 필드 값이 false가 아니거나 undefined가 아니면 추가
                if (queryFieldValue !== false && queryFieldValue !== undefined && queryFieldValue !== null) {
                    // 콤마가 포함된 경우에는 인코딩하지 않고 그대로 사용
                    if (queryFieldValue.includes(',')) {
                        queryParts.push(`${encodeURIComponent(key)}=${queryFieldValue}`);
                    } else {
                        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(queryFieldValue)}`);
                    }
                }
            }
        });
        queryString = queryParts.join('&'); // '&'로 파라미터들을 연결하여 쿼리 스트링 생성
    }

    // **GET 이외의 요청에도 쿼리 파라미터 추가**: 쿼리 파라미터가 있으면 URL에 추가
    if (queryString) {
        url = `${url}?${queryString}`;
    }

    // **isFileDownload 설정**: subpath에 'download'라는 단어가 포함되어 있으면 true로 설정
    let isFileDownload = false;
    if (apiData.subpath && (apiData.subpath.includes('/download_files') || apiData.subpath.includes('/download_attach_files'))) {
        isFileDownload = true;
    }

    // API 요청을 수행하고 결과를 받아옴
    try {
        const response = await apiRequest(url, apiData.method, formDataCollected, apiData.headers, isFileDownload);

        

        // **파일 다운로드 응답 처리**
        if (response && response.message) {
            const jsonPreview = document.getElementById('jsonPreview');
            jsonPreview.textContent = `API 응답:\n${JSON.stringify(response, null, 4)}`; // UI에 메시지 출력
        } else {
            // **JSON 응답 처리**
            const jsonPreview = document.getElementById('jsonPreview');
            jsonPreview.textContent = `API 응답:\n${JSON.stringify(response, null, 4)}`;
        }
    } catch (error) {
        console.error('API 요청 실패:', error);
        const jsonPreview = document.getElementById('jsonPreview');
        jsonPreview.textContent = `API 요청 실패:\n${error}`;
    }
}


export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

//탭 전환 처리 함수
export function showTab(tabId) {
    // 모든 탭 내용 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    // 선택된 탭만 표시
    document.getElementById(tabId).classList.remove('hidden');
    // 모든 탭의 활성 상태 제거
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    // 선택된 탭 활성화
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
    
    // 여기서는 단순히 display 처리만 하고, 데이터는 유지
    // 데이터 재렌더링 필요 없음 (renderForm()은 showForm()에서만 호출됨)
}

//QueryString 입력창 숨김 여부
export function toggleQueryString() {
    const queryStringContainer = document.getElementById('queryStringContainer');
    const queryStringCheckbox = document.getElementById('queryStringCheckbox');
    
    // 체크박스의 상태에 따라 QueryString 필드의 표시/숨김 처리
    if (queryStringCheckbox.checked) {
        queryStringContainer.style.display = 'block'; // QueryString 필드 보이기
    } else {
        queryStringContainer.style.display = 'none'; // QueryString 필드 숨기기
    }
}

/* 2024.09.23
import { categories } from './categories.js';
import { apiRequest } from './apimanager.js'; // apiManager.js에서 apiRequest 함수 가져오기
import { renderForm } from './formmanager.js'; // 폼 렌더링 함수 가져오기

let currentApiName = null;
let currentApiData = null;

export function loadCategories() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let categoryHTML = '<h3>API 카테고리</h3>';

    // 카테고리 로드
    categories.forEach(category => {
        categoryHTML += `<button onclick="toggleDropdown('${category.id}')">${category.name}</button>`;
        categoryHTML += `<div id="${category.id}" class="dropdown-content" style="display: none;">`;

        // 소분류 로드
        category.subcategories.forEach(subcat => {
            if (subcat.subgroups) {
                // 하위 그룹 로드
                categoryHTML += `<button onclick="toggleDropdown('${subcat.id}')">${subcat.name}</button>`;
                categoryHTML += `<div id="${subcat.id}" class="dropdown-content" style="display: none;">`;

                // 하위 그룹의 소분류 표시
                subcat.subgroups.forEach(subgroup => {
                    categoryHTML += `<a href="#" onclick="showForm('${subgroup.id}')">${subgroup.name}</a>`;
                });
                categoryHTML += `</div>`;
            } else {
                // 하위 그룹이 없는 경우
                categoryHTML += `<a href="#" onclick="showForm('${subcat.id}')">${subcat.name}</a>`;
            }
        });

        categoryHTML += `</div>`;
    });

    // 생성된 HTML을 사이드바에 삽입
    sidebar.innerHTML = categoryHTML;
}

export function toggleDropdown(categoryId) {
    const dropdownContent = document.getElementById(categoryId);
    if (dropdownContent) {
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    }
}

export async function showForm(apiName) {
    const category = apiName.split('-')[0];
    const module = await import(`./api/${category}.js`);
    const apiData = module.apis[apiName];

    if (!apiData) {
        console.log('해당 API를 찾을 수 없습니다:', apiName);
        return;
    }

    // preview 영역 초기화
    const preJsonPreview = document.getElementById('preJsonPreview');
    const jsonPreview = document.getElementById('jsonPreview');

    if (preJsonPreview) preJsonPreview.textContent = '';
    if (jsonPreview) jsonPreview.textContent = '';

    toggleSidebar();  // 폼이 로드될 때 사이드바를 자동으로 닫음

    currentApiName = apiName;  // 전역 변수에 API 이름 저장
    currentApiData = apiData;  // 전역 변수에 API 데이터 저장

    // 메뉴 선택 시 폼 데이터 초기화
    const finalUrlElement = document.getElementById('finalUrl');
    const requestBodyTextarea = document.getElementById('requestBody');

    if (finalUrlElement) {
        finalUrlElement.value = ''; // finalUrl 초기화
    }

    if (requestBodyTextarea) {
        requestBodyTextarea.value = ''; // requestBody 초기화
    }


    // 첫 번째 탭을 기본으로 렌더링
    showTab('urlTab');  
}

// 전역 변수를 사용하여 API 이름과 데이터를 참조
export async function executeButton() {
    const apiName = currentApiName;  // 전역 변수에서 가져옴
    const apiData = currentApiData;  // 전역 변수에서 가져옴

    if (!apiName || !apiData) {
        console.error("API 정보가 설정되지 않았습니다.");
        return;
    }

    let formDataCollected = {};

    // **requestBody 값 가져오기**: textarea에서 JSON 형식의 body 가져오기
    const requestBodyElement = document.getElementById('requestBody');
    if (requestBodyElement) {
        try {
            // 텍스트 영역의 값을 JSON으로 변환하기 전에 공백을 제거하여 잘못된 입력을 방지
            const requestBodyText = requestBodyElement.value.trim();

            // 입력된 값이 빈 값인지 확인 (빈 값은 유효한 JSON이 아니므로 에러 처리)
            if (!requestBodyText) {
                throw new Error('Request Body가 비어 있습니다.');
            }

            // **JSON으로 파싱**: 텍스트 영역의 값을 JSON으로 변환
            const requestBodyJson = JSON.parse(requestBodyElement.value);

            // **빈 값이 아닌 항목만 formDataCollected에 추가**
            
            formDataCollected = requestBodyJson;

        } catch (error) {
            console.error('Request Body를 JSON으로 변환하는 데 실패했습니다:', error);
            alert('Request Body의 형식이 잘못되었습니다. 올바른 JSON 형식이어야 합니다.');
            return;  // 잘못된 형식일 경우 실행 중단
        }
    } else {
        console.error('Request Body를 찾을 수 없습니다.');
        return;
    }

    // 기본 URL 설정
    let url = apiData.url;

    // **동적 URL 필드 값 추가**: 동적 URL 필드가 필수이고 값이 비어있으면 오류 메시지 출력
    if (apiData.dynamicUrlField) {
        Object.entries(apiData.dynamicUrlField).forEach(([key, fieldInfo]) => {
            const dynamicFieldElement = document.getElementById(key);
            const dynamicFieldValue = dynamicFieldElement ? dynamicFieldElement.value.trim() : fieldInfo.value;

            if (fieldInfo.required && !dynamicFieldValue) {
                alert(`동적 필드 ${key}는 필수입니다.`);
                return; // 필수 값이 없으면 실행 중단
            }

            if (dynamicFieldValue) {
                url = `${url}/${dynamicFieldValue}`; // 동적 URL 필드 값을 URL에 추가
            }
        });
    }

    // **서브패스 추가**: subpath 값이 있는 경우 URL 뒤에 추가
    if (apiData.subpath) {
        url = `${url}${apiData.subpath}`;
    }

    // **쿼리 스트링 필드 값 추가**: queryStringField 값이 있으면 직접 쿼리 파라미터로 변환
    let queryString = '';
    if (apiData.queryStringField) {
        const queryParts = [];
        Object.entries(apiData.queryStringField).forEach(([key, fieldInfo]) => {
            const queryFieldElement = document.getElementById(key);
            const queryFieldValue = queryFieldElement ? queryFieldElement.value : fieldInfo.value;

            // 필드 값이 false가 아니거나 undefined가 아니면 추가
            if (queryFieldValue !== false && queryFieldValue !== undefined && queryFieldValue !== null) {
                // 콤마가 포함된 경우에는 인코딩하지 않고 그대로 사용
                if (queryFieldValue.includes(',')) {
                    queryParts.push(`${encodeURIComponent(key)}=${queryFieldValue}`);
                } else {
                    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(queryFieldValue)}`);
                }
            }
        });
        queryString = queryParts.join('&'); // '&'로 파라미터들을 연결하여 쿼리 스트링 생성
    }

    // **GET 이외의 요청에도 쿼리 파라미터 추가**: 쿼리 파라미터가 있으면 URL에 추가
    if (queryString) {
        url = `${url}?${queryString}`;
    }

    // **isFileDownload 설정**: subpath에 'download'라는 단어가 포함되어 있으면 true로 설정
    let isFileDownload = false;
    if (apiData.subpath && (apiData.subpath.includes('/download_files') || apiData.subpath.includes('/download_attach_files'))) {
        isFileDownload = true;
    }

    // API 요청을 수행하고 결과를 받아옴
    try {
        const response = await apiRequest(url, apiData.method, formDataCollected, {}, isFileDownload);

        // **파일 다운로드 응답 처리**
        if (response && response.message) {
            const jsonPreview = document.getElementById('jsonPreview');
            jsonPreview.textContent = `응답: ${response.message}`; // UI에 파일 다운로드 메시지 출력
        } else {
            // **JSON 응답 처리**
            const jsonPreview = document.getElementById('jsonPreview');
            jsonPreview.textContent = `API 응답:\n${JSON.stringify(response, null, 4)}`;
        }
    } catch (error) {
        console.error('API 요청 실패:', error);
        const jsonPreview = document.getElementById('jsonPreview');
        jsonPreview.textContent = `API 요청 실패:\n${error}`;
    }
}


export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

//탭 전환 처리 함수
export function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden')); // 모든 탭 내용을 숨기기
    document.getElementById(tabId).classList.remove('hidden'); // 선택된 탭만 표시
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active')); // 모든 탭의 활성 상태 제거
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active'); // 선택된 탭에 활성 상태 추가

    renderForm(tabId, currentApiName, currentApiData); // 전역 변수에 저장된 API 데이터를 사용하여 renderForm() 호출
} 

//QueryString 입력창 숨김 여부
export function toggleQueryString() {
    const queryStringContainer = document.getElementById('queryStringContainer');
    queryStringContainer.style.display = queryStringContainer.style.display === 'none' ? 'block' : 'none';
}
*/