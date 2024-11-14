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
  "User-edit":{      //회원 정보 수정
    "url": 'https://kr-api.eformsign.com/v2.0/api/accounts',
    "method": 'PATCH',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "account": {
          "type": "object",
          "required": true,
          "properties": {
            "id": { "type": "string", "required": true, "value": "dskim@forcs.com" },
            "name": { "type": "string", "required": true, "value": "김대수" },
            "contact": {
               "type": "object", 
               "required": false, 
               "properties": {
                "country_number": { "type": "string", "required": false, "value": "" },
                "number": { "type": "string", "required": false, "value": "" },
              } 
            },
            "password": { "type": "string", "required": false, "value": "" },
            "new_password": { "type": "string", "required": false, "value": "" },
          }
        }
      }
    },
    "dynamicUrlField": {
        "account_id": { "required": true, "value": 'dskim@forcs.com'},
    },        
    "subpath": "",
    "queryStringField": ""
  }
}