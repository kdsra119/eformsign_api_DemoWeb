//JSON 스키마 정의
export const apis = {  
  "Group-list":{         //그룹 목록 조회
    "url": 'https://kr-api.eformsign.com/v2.0/api/groups',
    "method": 'GET',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": "",
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": {
      "include_member": { "required": false, "type": "boolean", "value": false },
      "include_field": { "required": false, "type": "boolean", "value": false }
    }
  },
  "Group-add":{       //그룹 추가
    "url": 'https://kr-api.eformsign.com/v2.0/api/groups',
    "method": 'POST',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "group": {
          "type": "object",
          "required": true,
          "properties": {
            "name": { "type": "string", "required": true, "value": "test" },
            "description": { "type": "string", "required": false, "value": "" },
            "members": { "type": "array", "required": true, "value": ["test33@naver.com"] },
          }
        }
      }
    },
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": ""
  },
  "Group-edit":{      //그룹 수정
    "url": 'https://kr-api.eformsign.com/v2.0/api/groups',
    "method": 'PATCH',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "group": {
          "type": "object",
          "required": true,
          "properties": {
            "name": { "type": "string", "required": true, "value": "testtest" },
            "description": { "type": "string", "required": false, "value": "" },
            "members": { "type": "array", "required": true, "value": ["test33@naver.com"] },
          }
        }
      }
    },
    "dynamicUrlField": {
        "group_id": { "required": true, "value": 'c949c9e08ca348e592c8b3c195961d5d'},
    },        
    "subpath": "",
    "queryStringField": ""
  },
  "Group-delete":{       //그룹 삭제
    "url": 'https://kr-api.eformsign.com/v2.0/api/groups',
    "method": 'DELETE',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "group_ids": {
          "type": "array",
          "required": true,
          "value": ["c949c9e08ca348e592c8b3c195961d5d"]
        }
      }
    },
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": ""
  },
}