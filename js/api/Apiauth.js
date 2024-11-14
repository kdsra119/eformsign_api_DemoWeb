// JSON 스키마 정의
export const apis = {
  "Apiauth-access": {   //토큰 생성
    "url": "https://api.eformsign.com/v2.0/api_auth/access_token",
    "method": "POST",
    "headers": {
      "Content-Type": { "type": "string", "value": "application/json", "required": true },
      "eformsign_signature": { "type": "string", "value": "Bearer ", "required": true },
      "Authorization": { "type": "string", "value": "Bearer <api key>", "required": true }
    },
    "body": {
      "properties": {
        "execution_time": { "type": "long", "required": true, "value": Date.now().toString() },
        "member_id": { "type": "string", "required": false, "value": "dskim@forcs.com" }
      }
    },
    "subpath": "",
    "dynamicUrlField": "",
    "queryStringField": ""
  },
  "Apiauth-refresh": {      //토큰 갱신
    "url": "https://kr-api.eformsign.com/v2.0/api_auth/refresh_token",
    "method": "POST",
    "headers": {
      "Content-Type": { "type": "string", "value": "application/json", "required": true },
      "Authorization": { "type": "string", "value": "Bearer <access_token>", "required": true }
    },
    "body": {
    },
    "subpath": "",
    "dynamicUrlField": "",
    "queryStringField": {
      "refresh_token": { "type": "string", "required": true, "value": "" }
    }
  }
}