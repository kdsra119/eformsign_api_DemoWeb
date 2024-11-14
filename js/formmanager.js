// API 선택 후에 폼을 동적으로 생성하는 함수
// formmanager.js
import { executeButton, toggleQueryString } from './uimanager.js';

// 모드 전환 함수
export function toggleMode() {
    const toggleCheckbox = document.getElementById('modeToggleCheckbox');
    const toggleLabel = document.getElementById('toggleLabel');

    // 모드가 바뀔 때 세션 스토리지에 저장
    if (toggleCheckbox.checked) {
        toggleLabel.textContent = "데모 모드 (ON)";
        sessionStorage.setItem('isDemoMode', 'true');
    } else {
        toggleLabel.textContent = "데모 모드 (OFF)";
        sessionStorage.setItem('isDemoMode', 'false');
    }

    window.location.reload();  // 페이지 새로고침
}

// 페이지 로드 시 모드 복원
export function restoreMode() {
    // 세션 스토리지에서 모드 상태를 확인하고 없으면 기본값을 설정
    if (sessionStorage.getItem('isDemoMode') === null) {
        sessionStorage.setItem('isDemoMode', 'false');  // 기본값을 false로 설정
    }
    
    const savedMode = sessionStorage.getItem('isDemoMode');

    // 저장된 모드가 있으면 해당 모드로 설정
    if (savedMode === 'true') {
        document.getElementById('modeToggleCheckbox').checked = true;
        document.getElementById('toggleLabel').textContent = "데모 모드 (ON)";
    } else {
        document.getElementById('modeToggleCheckbox').checked = false;
        document.getElementById('toggleLabel').textContent = "데모 모드 (OFF)";
    }
}

// 기존에 isDemoMode 변수를 사용하던 곳에서 바로 세션스토리지를 확인
export function isDemoMode() {
    return sessionStorage.getItem('isDemoMode') === 'true';
}


export function renderForm(apiName, apiData) {
    // API 정보가 없으면 폼을 생성하지 않음
    if (!apiName || !apiData) {
        console.log('API 정보가 없습니다.');
        return;
    }

    // 각 탭을 렌더링
    renderUrlTab(apiData);      // URL 탭 렌더링
    renderBodyTab(apiData);     // Body 탭 렌더링
    renderOptionTab(apiData);   // Option 탭 렌더링

    // 실행 버튼 처리
    let executeButtonElement = document.getElementById('executeButton');

    if (!executeButtonElement) {
        // 버튼이 없을 때만 생성
        executeButtonElement = document.createElement('button');
        executeButtonElement.id = 'executeButton';
        executeButtonElement.textContent = '실행';
        document.getElementById('formContainer').appendChild(executeButtonElement);

        // 클릭 이벤트 추가
        executeButtonElement.addEventListener('click', () => {
            executeButton(); // 전역 변수 또는 필요한 파라미터 사용
        });
    }
}

function renderUrlTab(apiData) {
    // URL 탭 처리 로직

    const finalUrlElement = document.getElementById('finalUrl');

    // finalUrl이 비어 있을 때만 URL 데이터를 가져와서 설정
    if (finalUrlElement && !finalUrlElement.value) {
        if (apiData.url) {
            finalUrlElement.value = apiData.url;
        }
    }

    // dynamicUrlField가 있을 경우 pathVariableContainer에 입력 필드 추가
    const pathVariableContainer = document.getElementById('pathVariableContainer');
    pathVariableContainer.innerHTML = ''; // 기존 내용 초기화

    const dynamicUrlParts = { url: [], subpath: [] }; // URL과 subpath 부분을 나누어 저장

    if (apiData.dynamicUrlField) {
        Object.entries(apiData.dynamicUrlField).forEach(([key, fieldInfo]) => {
            const position = fieldInfo.position || 'url'; // 기본 위치를 'url'로 설정
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // label 생성
            const label = document.createElement('label');
            label.textContent = key; // dynamicUrlField의 ID를 label로 사용

            // input 생성
            const input = document.createElement('input');
            input.type = 'text';
            input.id = key; // dynamicUrlField의 ID를 input의 id로 설정

            // isDemoMode()에 따른 값 처리
            if (isDemoMode()) {
                input.value = fieldInfo.value; // demo 모드에서는 value 채움
            } else {
                input.value = ''; // demo 모드가 아닐 때는 빈 값
            }

            // form-group에 label과 input 추가
            formGroup.appendChild(label);
            formGroup.appendChild(input);

            // pathVariableContainer에 form-group 추가
            pathVariableContainer.appendChild(formGroup);

            // 위치에 따라 URL에 추가할 부분을 저장
            dynamicUrlParts[position].push(key);
        });
    }

    // 최종 URL 설정
    if (finalUrlElement && apiData.url) {
        let dynamicUrl = apiData.url;

        // URL 부분 추가
        if (dynamicUrlParts.url.length > 0) {
            dynamicUrl += `/{${dynamicUrlParts.url.join('/')}}`;
        }

        // subpath 부분 추가
        if (apiData.subpath) {
            dynamicUrl += apiData.subpath;
        }

        // 추가 subpath 위치에 필요한 부분 추가
        if (dynamicUrlParts.subpath.length > 0) {
            dynamicUrl += `/{${dynamicUrlParts.subpath.join('/')}}`;
        }

        finalUrlElement.value = dynamicUrl;
    }

    // queryStringField 처리
    const queryStringContainer = document.getElementById('queryStringContainer');
    const queryStringContainerParent = document.querySelector('.query-string-container');
    const queryStringCheckbox = document.getElementById('queryStringCheckbox'); // 체크박스 엘리먼트
    let hasRequiredQuery = false; // 필수 쿼리 항목이 있는지 여부
    
    if (apiData.queryStringField) {
        queryStringContainerParent.style.display = 'block'; // 활성화
        queryStringContainer.innerHTML = ''; // 기존 내용 초기화

        // 각 쿼리 스트링 항목에 대한 필드 추가
        Object.entries(apiData.queryStringField).forEach(([key, fieldInfo]) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // 개별 쿼리 스트링 항목에 대한 체크박스 생성
            const fieldCheckbox = document.createElement('input');
            fieldCheckbox.type = 'checkbox';
            fieldCheckbox.id = `checkbox_${key}`;
            fieldCheckbox.checked = fieldInfo.required; // 필수일 경우 체크
            fieldCheckbox.disabled = fieldInfo.required; // 필수 필드는 수정 불가로 설정

            // 필수 항목이 하나라도 있으면 전체 쿼리 스트링 체크박스 표시
            if (fieldInfo.required) {
                hasRequiredQuery = true;
            }

            // label 생성
            const label = document.createElement('label');
            label.textContent = key;

            // 입력 필드 생성 (boolean 타입은 select로 설정)
            const input = document.createElement(fieldInfo.type === 'boolean' ? 'select' : 'input');
            input.id = key;

            // boolean 타입 처리
            if (fieldInfo.type === 'boolean') {
                const optionTrue = document.createElement('option');
                optionTrue.value = 'true';
                optionTrue.textContent = 'True';

                const optionFalse = document.createElement('option');
                optionFalse.value = 'false';
                optionFalse.textContent = 'False';

                // fieldInfo.required가 true일 경우, 기본적으로 'True'를 선택
                if (fieldInfo.required) {
                    optionTrue.selected = true; // required가 true면 'True' 옵션 선택
                } else {
                    optionFalse.selected = true; // required가 false면 'False' 옵션 선택
                }

                input.appendChild(optionTrue);
                input.appendChild(optionFalse);
            } else {
                input.type = 'text';
                // isDemoMode가 true일 때 fieldInfo.value 값을 설정하고, 값이 없을 경우 빈 문자열로 기본값 설정
                input.value = isDemoMode() ? fieldInfo.value || '' : '';
            }

            // fieldCheckbox의 체크 여부에 따라 input 필드의 표시 상태를 설정
            input.style.display = fieldCheckbox.checked ? 'block' : 'none';
            // fieldCheckbox의 변경 이벤트를 통해 input 필드의 표시 상태를 동적으로 변경
            fieldCheckbox.addEventListener('change', () => {
                input.style.display = fieldCheckbox.checked ? 'block' : 'none';
            });

            // 체크박스, 라벨, 입력 필드를 formGroup에 추가
            formGroup.appendChild(fieldCheckbox);
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            queryStringContainer.appendChild(formGroup);
         
            /*      2024.11.04_JSON 스키마 내 querystring required값 적용
            // 필수 필드 처리
            if (fieldInfo.required && !queryStringCheckbox.checked) {
                // 필수 필드일 경우 입력창 표시
                queryStringCheckbox.checked = true; // 체크박스 자동 체크
                toggleQueryString();
            } */

            // 필수 쿼리 스트링 항목이 있을 경우 queryStringCheckbox를 체크
            queryStringCheckbox.checked = hasRequiredQuery;
            if (hasRequiredQuery) {
                queryStringContainerParent.style.display = 'block';
            }

            // 강제로 toggleQueryString() 호출하여 queryString 항목이 표시되도록 함
            toggleQueryString();
        }); 
    } else {
        queryStringContainerParent.style.display = 'none'; // 비활성화
    }
}

function renderBodyTab(apiData) {
    const requestBodyTextarea = document.getElementById('requestBody');
    
    if (requestBodyTextarea) {
        // requestBody 초기화
        requestBodyTextarea.innerHTML = ''; 
        requestBodyTextarea.readOnly = false;
        
        if (apiData.body && apiData.body.properties) {
            // body 스키마에서 값 추출하여 JSON으로 변환
            const bodyValues = extractBodyValues(apiData.body.properties, isDemoMode());
            const bodyJson = JSON.stringify(bodyValues, null, 4); // 포맷팅된 JSON
            
            requestBodyTextarea.value = bodyJson; // textarea에 JSON 데이터 설정

            // textarea의 줄 수에 맞게 높이 조절
            const lineCount = bodyJson.split('\n').length;
            requestBodyTextarea.rows = lineCount < 10 ? 10 : lineCount;
        } else if (!apiData.body || Object.keys(apiData.body).length === 0) {
            requestBodyTextarea.value = 'RequestBody 입력이 필요 없는 API 입니다';
            requestBodyTextarea.rows = 1; // 줄 수 1로 설정
            requestBodyTextarea.readOnly = true;
        }
    }
}


function renderOptionTab(apiData) {
    // method 라벨 처리
    const methodLabel = document.getElementById('methodLabel');
    if (apiData.method) {
        methodLabel.textContent = apiData.method.toUpperCase(); // JSON 스키마에서 method 값을 가져와 설정
    } else {
        methodLabel.textContent = 'GET'; // 기본값 설정
    }

    // Headers 처리
    const headerContainer = document.getElementById('headerContainer');
    headerContainer.innerHTML = ''; // 기존 내용 초기화

    // 스키마에 headers가 있을 경우 해당 값을 div에 label로 표시
    if (apiData.headers) {
        Object.entries(apiData.headers).forEach(([key, headerInfo]) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // div 생성 (Header의 Value)
            const valueDiv = document.createElement('div');
            valueDiv.textContent = key + " = " + headerInfo.value || '';

            // form-group에 valueDiv 추가
            formGroup.appendChild(valueDiv);

            // headerContainer에 form-group 추가
            headerContainer.appendChild(formGroup);
        });
    } else {
        const noHeaderMessage = document.createElement('div');
        noHeaderMessage.textContent = '헤더가 없습니다.';
        headerContainer.appendChild(noHeaderMessage); // 헤더가 없을 경우 메시지 표시
    }
}

// value 필드를 추출하여 새로운 객체를 만드는 함수
function extractBodyValues(bodySchema, isDemoMode) {
    // 최상위 레벨이 array인 경우, 배열로 초기화
    if (bodySchema.type === 'array' && Array.isArray(bodySchema.properties)) {
        return bodySchema.properties.map(item => extractBodyValues(item, isDemoMode));
    }

    const result = {};

    // 'properties'라는 키가 존재할 경우 처리 (상위 키가 있는 경우)
    if (bodySchema.properties) {
        bodySchema = bodySchema.properties; // 상위 키 내부의 properties로 이동
    }

    Object.entries(bodySchema).forEach(([key, fieldInfo]) => {
        if (fieldInfo.type === 'object' && fieldInfo.properties) {
            // 중첩된 객체 처리
            result[key] = extractBodyValues(fieldInfo, isDemoMode);
        } else if (fieldInfo.type === 'array' && Array.isArray(fieldInfo.value)) {
            // 배열 처리
            result[key] = fieldInfo.value.map(item => {
                if (typeof item === 'object') {
                    return extractBodyValues(item, isDemoMode);
                }
                return isDemoMode ? item : getDefaultValue(fieldInfo.type);
            });
        } else {
            // 기본 필드 처리
            result[key] = isDemoMode ? fieldInfo.value : getDefaultValue(fieldInfo.type);
        }
    });

    return result;
}

// 타입에 따른 기본 값을 반환하는 함수
function getDefaultValue(type) {
    switch (type) {
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
}

//dynamicUrlField 동적 생성 및 QueryString 입력 필드 생성
export function addPathVariablesAndQueryStrings(pathVariables, queryStrings) {
    const pathVariableContainer = document.getElementById('pathVariableContainer');
    pathVariables.forEach(variable => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `${variable} 입력`;
        input.id = variable;
        pathVariableContainer.appendChild(input);
    });

    if (queryStrings.length > 0) {
        const queryStringContainer = document.getElementById('queryStringContainer');
        queryStrings.forEach(qs => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'form-group';
            const label = document.createElement('label');
            label.textContent = qs.name;
            const input = document.createElement(qs.type === 'boolean' ? 'select' : 'input');
            if (qs.type === 'boolean') {
                const optionTrue = document.createElement('option');
                optionTrue.value = 'true';
                optionTrue.textContent = 'True';
                const optionFalse = document.createElement('option');
                optionFalse.value = 'false';
                optionFalse.textContent = 'False';
                input.appendChild(optionTrue);
                input.appendChild(optionFalse);
            } else {
                input.type = qs.type === 'array' ? 'text' : qs.type;
                input.placeholder = `${qs.name} 값 입력`;
            }
            inputDiv.appendChild(label);
            inputDiv.appendChild(input);
            queryStringContainer.appendChild(inputDiv);
        });
    }
}

/* 2024.09.23
import { executeButton } from './uimanager.js';

// 모드 전환 함수
export function toggleMode() {
    const toggleCheckbox = document.getElementById('modeToggleCheckbox');
    const toggleLabel = document.getElementById('toggleLabel');

    // 모드가 바뀔 때 세션 스토리지에 저장
    if (toggleCheckbox.checked) {
        toggleLabel.textContent = "데모 모드 (ON)";
        sessionStorage.setItem('isDemoMode', 'true');
    } else {
        toggleLabel.textContent = "데모 모드 (OFF)";
        sessionStorage.setItem('isDemoMode', 'false');
    }

    window.location.reload();  // 페이지 새로고침
}

// 페이지 로드 시 모드 복원
export function restoreMode() {
    // 세션 스토리지에서 모드 상태를 확인하고 없으면 기본값을 설정
    if (sessionStorage.getItem('isDemoMode') === null) {
        sessionStorage.setItem('isDemoMode', 'false');  // 기본값을 false로 설정
    }
    
    const savedMode = sessionStorage.getItem('isDemoMode');

    // 저장된 모드가 있으면 해당 모드로 설정
    if (savedMode === 'true') {
        document.getElementById('modeToggleCheckbox').checked = true;
        document.getElementById('toggleLabel').textContent = "데모 모드 (ON)";
    } else {
        document.getElementById('modeToggleCheckbox').checked = false;
        document.getElementById('toggleLabel').textContent = "데모 모드 (OFF)";
    }
}

// 기존에 isDemoMode 변수를 사용하던 곳에서 바로 세션스토리지를 확인
export function isDemoMode() {
    return sessionStorage.getItem('isDemoMode') === 'true';
}

// API 선택 후에 폼을 동적으로 생성하는 함수
export function renderForm(tabId, apiName, apiData) {
    // API 정보가 없으면 폼을 생성하지 않고, 단순히 탭만 활성화
    if (!apiName || !apiData) {
        console.log(`API 정보가 없습니다. 탭: ${tabId}만 활성화됨.`);
        return;
    }

    switch(tabId) {
        case 'urlTab':
            renderUrlTab(apiData);
            break;
        case 'bodyTab':
            renderBodyTab(apiData);
            break;
        case 'optionTab':
            renderOptionTab(apiData);
            break;
        default:
            console.log("잘못된 탭 ID입니다.");
    }

    // 실행 버튼 처리
    let executeButtonElement = document.getElementById('executeButton');

    if (!executeButtonElement) {
        // 버튼이 없을 때만 새로 생성하고 이벤트 추가
        executeButtonElement = document.createElement('button');
        executeButtonElement.id = 'executeButton';
        executeButtonElement.textContent = '실행';
        document.getElementById('formContainer').appendChild(executeButtonElement);

        // 클릭 이벤트 추가
        executeButtonElement.addEventListener('click', () => {
            executeButton(); // 전역 변수 또는 필요한 파라미터를 사용
        });
    }
}

function renderUrlTab(apiData) {
    // URL 탭 처리 로직

    const finalUrlElement = document.getElementById('finalUrl');

    // finalUrl이 비어 있을 때만 URL 데이터를 가져와서 설정
    if (finalUrlElement && !finalUrlElement.value) {
        if (apiData.url) {
            finalUrlElement.value = apiData.url;
        }
    }

    // dynamicUrlField가 있을 경우 pathVariableContainer에 입력 필드 추가
    const pathVariableContainer = document.getElementById('pathVariableContainer');
    pathVariableContainer.innerHTML = ''; // 기존 내용 초기화

    if (apiData.dynamicUrlField) {
        Object.entries(apiData.dynamicUrlField).forEach(([key, fieldInfo]) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // label 생성
            const label = document.createElement('label');
            label.textContent = key; // dynamicUrlField의 ID를 label로 사용

            // input 생성
            const input = document.createElement('input');
            input.type = 'text';
            input.id = key; // dynamicUrlField의 ID를 input의 id로 설정

            // isDemoMode()에 따른 값 처리
            if (isDemoMode()) {
                input.value = fieldInfo.value; // demo 모드에서는 value 채움
            } else {
                input.value = ''; // demo 모드가 아닐 때는 빈 값
            }

            // form-group에 label과 input 추가
            formGroup.appendChild(label);
            formGroup.appendChild(input);

            // pathVariableContainer에 form-group 추가
            pathVariableContainer.appendChild(formGroup);
        });
    }

    // queryStringField 처리
    const queryStringContainer = document.getElementById('queryStringContainer');
    const queryStringContainerParent = document.querySelector('.query-string-container');
    
    if (apiData.queryStringField) {
        queryStringContainerParent.style.display = 'block'; // 활성화
        queryStringContainer.innerHTML = ''; // 기존 내용 초기화

        Object.entries(apiData.queryStringField).forEach(([key, fieldInfo]) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // label 생성
            const label = document.createElement('label');
            label.textContent = key;

            // input 생성
            const input = document.createElement(fieldInfo.type === 'boolean' ? 'select' : 'input');
            input.id = key;

            if (fieldInfo.type === 'boolean') {
                const optionTrue = document.createElement('option');
                optionTrue.value = 'true';
                optionTrue.textContent = 'True';

                const optionFalse = document.createElement('option');
                optionFalse.value = 'false';
                optionFalse.textContent = 'False';

                // fieldInfo.required가 true일 경우, 기본적으로 'True'를 선택
                if (fieldInfo.required) {
                    optionTrue.selected = true; // required가 true면 'True' 옵션 선택
                } else {
                    optionFalse.selected = true; // required가 false면 'False' 옵션 선택
                }

                input.appendChild(optionTrue);
                input.appendChild(optionFalse);                    
            } else {
                input.type = 'text';
                input.value = fieldInfo.value || ''; // 값이 없으면 빈값
            }

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            queryStringContainer.appendChild(formGroup);
        });
    } else {
        queryStringContainerParent.style.display = 'none'; // 비활성화
    }
}

export function renderOptionTab(apiData) {
    // method 라벨 처리
    const methodLabel = document.getElementById('methodLabel');
    if (apiData.method) {
        methodLabel.textContent = apiData.method.toUpperCase(); // JSON 스키마에서 method 값을 가져와 설정
    } else {
        methodLabel.textContent = 'GET'; // 기본값 설정
    }

    // Headers 처리
    const headerContainer = document.getElementById('headerContainer');
    headerContainer.innerHTML = ''; // 기존 내용 초기화

    // 스키마에 headers가 있을 경우 해당 값을 div에 label로 표시
    if (apiData.headers) {
        Object.entries(apiData.headers).forEach(([key, headerInfo]) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // div 생성 (Header의 Value)
            const valueDiv = document.createElement('div');
            valueDiv.textContent = key + " = " + headerInfo.value || '';

            // form-group에 valueDiv 추가
            formGroup.appendChild(valueDiv);

            // headerContainer에 form-group 추가
            headerContainer.appendChild(formGroup);
        });
    } else {
        const noHeaderMessage = document.createElement('div');
        noHeaderMessage.textContent = '헤더가 없습니다.';
        headerContainer.appendChild(noHeaderMessage); // 헤더가 없을 경우 메시지 표시
    }
}

export function renderBodyTab(apiData) {
    const requestBodyTextarea = document.getElementById('requestBody');
    requestBodyTextarea.innerHTML = ''; // 기존 내용 초기화

    if (requestBodyTextarea && !requestBodyTextarea.value) {
        if (apiData.body) {
            // value 필드만 추출하여 새로운 객체를 만듬
            const bodyValues = extractBodyValues(apiData.body, isDemoMode());
            const bodyJson = JSON.stringify(bodyValues, null, 4); // 포맷팅된 JSON
            
            requestBodyTextarea.value = bodyJson;

            // 줄 수에 맞게 textarea 높이 설정
            const lineCount = bodyJson.split('\n').length;
            requestBodyTextarea.rows = lineCount < 10 ? 10 : lineCount;
        } else {
            requestBodyTextarea.value = 'Body 데이터가 없습니다.';
            requestBodyTextarea.rows = 5;
        }
    }
}

// value 필드를 추출하여 새로운 객체를 만드는 함수
function extractBodyValues(bodySchema, isDemoMode) {
    const result = {};

    Object.entries(bodySchema).forEach(([key, fieldInfo]) => {
        if (fieldInfo.type === 'object' && fieldInfo.properties) {
            // 재귀 호출로 중첩된 객체 처리
            result[key] = extractBodyValues(fieldInfo.properties, isDemoMode);
        } else if (fieldInfo.type === 'array' && Array.isArray(fieldInfo.value)) {
            // 배열의 경우 각 요소를 처리
            result[key] = fieldInfo.value.map(item => {
                if (typeof item === 'object') {
                    return extractBodyValues(item, isDemoMode);
                }
                return isDemoMode ? item : getDefaultValue(fieldInfo.type);
            });
        } else {
            // 기본 필드 처리: isDemoMode가 true면 원래 값을, false면 빈 값 또는 기본 값
            result[key] = isDemoMode ? fieldInfo.value : getDefaultValue(fieldInfo.type);
        }
    });

    return result;
}

// 타입에 따른 기본 값을 반환하는 함수
function getDefaultValue(type) {
    switch (type) {
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
}

//dynamicUrlField 동적 생성 및 QueryString 입력 필드 생성
export function addPathVariablesAndQueryStrings(pathVariables, queryStrings) {
    const pathVariableContainer = document.getElementById('pathVariableContainer');
    pathVariables.forEach(variable => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `${variable} 입력`;
        input.id = variable;
        pathVariableContainer.appendChild(input);
    });

    if (queryStrings.length > 0) {
        const queryStringContainer = document.getElementById('queryStringContainer');
        queryStrings.forEach(qs => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'form-group';
            const label = document.createElement('label');
            label.textContent = qs.name;
            const input = document.createElement(qs.type === 'boolean' ? 'select' : 'input');
            if (qs.type === 'boolean') {
                const optionTrue = document.createElement('option');
                optionTrue.value = 'true';
                optionTrue.textContent = 'True';
                const optionFalse = document.createElement('option');
                optionFalse.value = 'false';
                optionFalse.textContent = 'False';
                input.appendChild(optionTrue);
                input.appendChild(optionFalse);
            } else {
                input.type = qs.type === 'array' ? 'text' : qs.type;
                input.placeholder = `${qs.name} 값 입력`;
            }
            inputDiv.appendChild(label);
            inputDiv.appendChild(input);
            queryStringContainer.appendChild(inputDiv);
        });
    }
}

*/

/* 기존의 renderForm()

// API 선택 후에 폼을 동적으로 생성하는 함수
export function renderForm(apiName, apiData) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // 이전 폼 초기화
    const method = apiData.method ? apiData.method.toUpperCase() : '';

    if (!apiData) {
        return; // API 데이터가 없을 때 아무것도 생성하지 않음
    }

    // 동적 URL 처리 필드 생성
    if (apiData.dynamicUrlField) {
        Object.entries(apiData.dynamicUrlField).forEach(([key, fieldInfo]) => {
            if (fieldInfo.required) {
                formContainer.innerHTML += createInputElement(key, fieldInfo); // required가 true일 때만 필드 추가
            }
        });
    }

    // JSON 스키마에 따라 폼을 동적으로 생성 (데모 모드)
    // GET 메소드일 경우
    if (method === 'GET') {
        formContainer.innerHTML += `<p>GET 요청은 request body가 필요 없습니다.</p>`;
    }
    else if (isDemoMode()) {
        Object.entries(apiData.body).forEach(([key, fieldInfo]) => {
            formContainer.innerHTML += createInputElement(key, fieldInfo);
        });
    } else {
        // 사용자 모드 처리
        const controlPanel = document.createElement("div");
        controlPanel.innerHTML = `
            <label>필드 개수: <input type="number" id="fieldCount" min="1" /></label>
            <button id="addFieldsButton">추가</button>
            <button id="removeFieldsButton">삭제</button>
        `;
        formContainer.appendChild(controlPanel);

        // 이벤트 리스너 추가
        document.getElementById('addFieldsButton').addEventListener('click', addFields);
        document.getElementById('removeFieldsButton').addEventListener('click', removeFields);
    }

    // 실행 버튼 추가
    const executeButtonElement = document.createElement('button');
    executeButtonElement.id = 'executeButton';
    executeButtonElement.textContent = '실행';
    formContainer.appendChild(executeButtonElement);

    // 실행 버튼에 이벤트 리스너 추가
    executeButtonElement.addEventListener('click', () => {
        executeButton(apiName, apiData);
    });
}
*/