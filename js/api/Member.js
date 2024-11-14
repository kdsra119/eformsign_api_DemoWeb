//JSON 스키마 정의
export const apis = {  
  "Member-list":{         //멤버 목록 조회
    "url": 'https://kr-api.eformsign.com/v2.0/api/members',
    "method": 'GET',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": "",
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": {
      "member_all": { "required": false, "type": "boolean", "value": false },
      "include_field": { "required": false, "type": "boolean", "value": false },
      "include_delete": { "required": false, "type": "boolean", "value": false },
      "eb_name_search": { "required": false, "type": "string", "value": "" }
    }
  },
  "Member-add":{         //멤버 추가
    "url": 'https://kr-api.eformsign.com/v2.0/api/members',
    "method": 'POST',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "account": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "required": true, "value": "test123@forcs.com" },
            "password": { "type": "string", "required": false, "value": "xptmxm321#" },
            "name": { "type": "string", "required": false, "value": "test" },
            "contact":{
              "type": "object",
              "properties": {
                "tel": { "type": "string", "required": false, "value": "" },
                "number": { "type": "string", "required": false, "value": "" },
                "country_number": { "type": "string", "required": false, "value": "" },
              }
            },
            "department": { "type": "string", "required": false, "value": "" },
            "position": { "type": "string", "required": false, "value": "" },
            "agreement": {
              "type": "object",
              "properties": {
                "marketing": { "type": "boolean", "required": false, "value": false },
              }
            },
            "role": {
              "type": "array",
              "required": false,
              "value": ["member"]
            },
            "external_sso_info": {
              "type": "object",
              "properties":{
                "uuid": { "type": "string", "required": false, "value": "" },
                "account_id": { "type": "string", "required": false, "value": "" },
              }
            }
          }
        }
      }
    },
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": ""
  },
  "Member-batchadd":{         //멤버 일괄 추가
    "url": 'https://kr-api.eformsign.com/v2.0/api/list_members',
    "method": 'POST',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "type": "array",
      "properties":[
      {
          "type": "object",
          "properties": {
              "id": { "type": "string", "required": true, "value": "test33@naver.com" },
              "password": { "type": "string", "required": false, "value": "xptmxm33!" },
              "name": { "type": "string", "required": false, "value": "test33" },
              "contact": {
                  "type": "object",
                  "properties": {
                      "tel": { "type": "string", "required": false, "value": "" },
                      "number": { "type": "string", "required": false, "value": "" },
                      "country_number": { "type": "string", "required": false, "value": "+82" }
                  }
              },
              "department": { "type": "string", "required": false, "value": "" },
              "position": { "type": "string", "required": false, "value": "" },
              "agreement": {
                  "type": "object",
                  "properties": {
                      "marketing": { "type": "boolean", "required": false, "value": false }
                  }
              },
              "role": {
                  "type": "array",
                  "value": ["member"],
                  "items": {
                      "type": "string",
                      "enum": ["member", "company_manager", "template_manager"]
                  },
                  "required": false
              },
              "external_sso_info": {
                  "type": "object",
                  "properties": {
                      "uuid": { "type": "string", "required": false, "value": "" },
                      "account_id": { "type": "string", "required": false, "value": "" }
                  }
              }
          }
      },
      {
          "type": "object",
          "properties": {
              "id": { "type": "string", "required": true, "value": "test44@naver.com" },
              "password": { "type": "string", "required": false, "value": "xptmxm44!" },
              "name": { "type": "string", "required": false, "value": "test44" },
              "contact": {
                  "type": "object",
                  "properties": {
                      "tel": { "type": "string", "required": false, "value": "" },
                      "number": { "type": "string", "required": false, "value": "" },
                      "country_number": { "type": "string", "required": false, "value": "+82" }
                  }
              },
              "department": { "type": "string", "required": false, "value": "" },
              "position": { "type": "string", "required": false, "value": "" },
              "agreement": {
                  "type": "object",
                  "properties": {
                      "marketing": { "type": "boolean", "required": false, "value": false }
                  }
              },
              "role": {
                  "type": "array",
                  "value": ["member"],
                  "items": {
                      "type": "string",
                      "enum": ["member", "company_manager", "template_manager"]
                  },
                  "required": false
              },
              "external_sso_info": {
                  "type": "object",
                  "properties": {
                      "uuid": { "type": "string", "required": false, "value": "" },
                      "account_id": { "type": "string", "required": false, "value": "" }
                  }
              }
          }
      },
      {
          "type": "object",
          "properties": {
              "id": { "type": "string", "required": true, "value": "test55@naver.com" },
              "password": { "type": "string", "required": false, "value": "xptmxm55!" },
              "name": { "type": "string", "required": false, "value": "test55" },
              "contact": {
                  "type": "object",
                  "properties": {
                      "tel": { "type": "string", "required": false, "value": "" },
                      "number": { "type": "string", "required": false, "value": "" },
                      "country_number": { "type": "string", "required": false, "value": "+82" }
                  }
              },
              "department": { "type": "string", "required": false, "value": "" },
              "position": { "type": "string", "required": false, "value": "" },
              "agreement": {
                  "type": "object",
                  "properties": {
                      "marketing": { "type": "boolean", "required": false, "value": false }
                  }
              },
              "role": {
                  "type": "array",
                  "value": ["member"],
                  "items": {
                      "type": "string",
                      "enum": ["member", "company_manager", "template_manager"]
                  },
                  "required": false
              },
              "external_sso_info": {
                  "type": "object",
                  "properties": {
                      "uuid": { "type": "string", "required": false, "value": "" },
                      "account_id": { "type": "string", "required": false, "value": "" }
                  }
              }
          }
      }
  ]},
    "dynamicUrlField": "",        
    "subpath": "",
    "queryStringField": {
      "mailOption": { "required": false, "type": "boolean", "value": true }
    }
  },
  "Member-update":{         //멤버 수정
    "url": 'https://kr-api.eformsign.com/v2.0/api/members',
    "method": 'PATCH',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": {
      "properties": {
        "account": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "required": true, "value": "test44@naver.com" },
            "name": { "type": "string", "required": false, "value": "testtest" },
            "contact":{
              "type": "object",
              "properties": {
                "tel": { "type": "string", "required": false, "value": "" },
                "number": { "type": "string", "required": false, "value": "" },
              }
            },
            "department": { "type": "string", "required": false, "value": "" },
            "position": { "type": "string", "required": false, "value": "" },
            "role": {
              "type": "array",
              "required": false,
              "value": ["member"]
            }
          }
        }
      }
    },
    "dynamicUrlField": {
      "member_id": { "required": true, "value": "test44@naver.com"},
    },
    "subpath": "",
    "queryStringField": ""
  },
  "Member-delete":{         //멤버 탈퇴
    "url": 'https://kr-api.eformsign.com/v2.0/api/members',
    "method": 'DELETE',
    "headers":{
        "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
        "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
    },
    "body": "",
    "dynamicUrlField": {
      "account_id": { "required": true, "value": "test55@naver.com"},
    },
    "subpath": "",
    "queryStringField": ""
  },
}