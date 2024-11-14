// validation.js
/**
 * 입력값이 비어있는지 확인하는 함수입니다.
 * @param {string} value - 검증할 입력값입니다.
 * @returns {boolean} - 비어있다면 true, 그렇지 않다면 false를 반환합니다.
 */
export function isEmpty(value) {
  return value.trim() === '';
}

/**
* 입력값이 숫자인지 확인하는 함수입니다.
* @param {string} value - 검증할 입력값입니다.
* @returns {boolean} - 숫자라면 true, 그렇지 않다면 false를 반환합니다.
*/
export function isNumber(value) {
  return !isNaN(value) && !isEmpty(value);
}

/**
* 특정 필드가 유효한지 확인하는 함수입니다.
* @param {string} fieldId - 검증할 필드의 id입니다.
* @param {Function} validationFunction - 검증에 사용할 함수입니다.
* @returns {boolean} - 필드가 유효하면 true, 그렇지 않다면 false를 반환합니다.
*/
export function validateField(fieldId, validationFunction) {
  const field = document.getElementById(fieldId);
  const value = field.value;
  const isValid = validationFunction(value);

  if (!isValid) {
      field.classList.add('invalid');
  } else {
      field.classList.remove('invalid');
  }

  return isValid;
}

/**
* 입력 필드의 모든 값을 검증하는 함수입니다.
* @param {Array} fieldValidations - 검증할 필드와 함수의 배열입니다.
* @returns {boolean} - 모든 필드가 유효하면 true, 그렇지 않다면 false를 반환합니다.
*/
export function validateForm(schema) {
  let isValid = true;
  let missingFields = [];

  Object.entries(schema).forEach(([key, fieldInfo]) => {
      const element = document.getElementById(key);
      if (fieldInfo.required && (!element || element.value.trim() === '')) {
          isValid = false;
          missingFields.push(key);
          if (element) element.classList.add('invalid');
      } else if (element) {
          element.classList.remove('invalid');
      }
  });

  if (!isValid) {
      alert(`다음 필수 항목이 비어 있습니다: ${missingFields.join(', ')}`);
  }

  return isValid;
}

export function validateRequestBody(schema) {
  let isValid = true;
  const missingFields = [];

  // textarea에서 JSON 데이터를 한 번만 가져와 파싱
  const requestBodyElement = document.getElementById('requestBody');
  if (!requestBodyElement) {
    console.error("Request Body textarea가 없습니다.");
    return false;
  }

  // 스키마에 body가 없으면 검증하지 않음
  if (!schema || Object.keys(schema).length === 0) {
    const requestBodyElement = document.getElementById('requestBody');
    if (requestBodyElement && requestBodyElement.value.trim() !== '') {
      alert('Request Body가 없는 API입니다.');
      return false;
    }
    return true;
  }

  // 스키마의 필수 필드 검증 함수 (재귀적으로 처리)
  function validateFields(schemaFields, jsonFields, path = '') {
    Object.entries(schemaFields).forEach(([key, fieldInfo]) => {
      const fieldPath = path ? `${path}.${key}` : key;

      // Object 타입일 경우, 내부 properties에 대해 재귀 호출
      if (fieldInfo.type === 'object' && fieldInfo.properties) {
        const nestedJsonFields = jsonFields[key] || {};
        isValid = validateFields(fieldInfo.properties, nestedJsonFields, fieldPath) && isValid;

      // Array 타입일 경우, 배열 내부 요소들을 반복하며 검증
      } else if (fieldInfo.type === 'array' && Array.isArray(jsonFields[key])) {
        jsonFields[key].forEach((item, index) => {
          isValid = validateFields(fieldInfo.value[0], item, `${fieldPath}[${index}]`) && isValid;
        });

      // 기본 타입일 경우, 필수 필드 확인
      } else if (fieldInfo.required && (!jsonFields[key] || (typeof jsonFields[key] === 'string' && jsonFields[key].trim() === ''))) {
        isValid = false;
        missingFields.push(fieldPath); // 비어있는 필드 경로 저장
      } 
    });

    return isValid; // 각 단계마다 isValid를 반환하여 업데이트
  }

  try {
    const requestBodyJson = JSON.parse(requestBodyElement.value);

    // 최상위에서 시작하여 JSON 스키마와 데이터를 검증 (재귀 호출 시작점)
    isValid = validateFields(schema, requestBodyJson);

    if (!isValid) {
      alert(`다음 필수 항목이 비어 있습니다: ${missingFields.join(', ')}`);
    }

    return isValid;
  } catch (error) {
    console.error("Request Body가 JSON 형식이 아닙니다:", error);
    alert("Request Body가 올바른 JSON 형식이 아닙니다.");
    return false;
  }
}




