//JSON 스키마 정의
export const apis = {  
  "Template-list":{         //작성 가능한 템플릿 목록 조회
    "url": 'https://kr-api.eformsign.com/v2.0/api/forms',
    "method": 'GET',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": "",
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": ""
  },
  "Template-fields":{       //템플릿 필드 정보 조회
    "url": 'https://kr-api.eformsign.com/v2.0/api/forms/info',
    "method": 'GET',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "type": {
          "type": "string",
          "required": true,
          "value": "embedded"
        },
        "template_id": {
          "type": "string",
          "required": true,
          "value": "f75c962e9d52407498611611c39801f4"
        }
      }
    },
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": ""
  },
  "Template-imagedown":{      //템플릿 이미지 다운로드
    "url": 'https://kr-api.eformsign.com/v2.0/api/template_image',
    "method": 'GET',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
    },
    "dynamicUrlField": {
        "template_image_id": { "required": true, "value": '95dd4550faf24369b61c92c4d786a5cd', "position": "url" },
    },        
    "subpath": "",
    "queryStringField": {
        "output_type": { "required": false, "type": "string", "value": "0" }            
    }
  },
  "Template-download":{       //템플릿 다운로드
    "url": 'https://kr-api.eformsign.com/v2.0/api/templates',
    "method": 'GET',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": "",
    "dynamicUrlField": {
        "form_id": { "required": true, "value": '47e1efd327d549c687e64ad21b50a274', "position": "url" },
    },        
    "subpath": "/download_files",
    "queryStringField": ""
  },
}