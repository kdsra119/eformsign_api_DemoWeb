// JSON 스키마 정의
export const apis = {
    "Document-create-member":{      //새 문서 작성 (멤버)
        "url": "https://kr-api.eformsign.com/v2.0/api/documents",
        "method": "POST",
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
        },
        "body": {
            "properties": {
                "document": {
                "type": "object",
                "properties": {
                    "document_name": { "type": "string", "required": false, "value": "" },
                    "recipients": {
                        "type": "array",
                        "required": false,
                        "value": [
                        {
                            "step_type": { "type": "string", "required": true, "value": "05" },
                            "auth": {
                            "type": "object",
                            "properties": {
                                "password": { "type": "string", "required": false, "value": "1111" },
                                "password_hint": { "type": "string", "required": false, "value": "1을 4번 입력" },
                                "valid": {
                                "type": "object",
                                "properties": {
                                    "day": { "type": "integer", "required": false, "value": 7 },
                                    "hour": { "type": "integer", "required": false, "value": 0 }
                                }
                                }
                            }
                            },
                            "use_mail": { "type": "boolean", "required": false, "value": true },
                            "use_sms": { "type": "boolean", "required": false, "value": false },
                            "is_noti_ignore": { "type": "boolean", "required": false, "value": false },
                            "member": {
                            "type": "object",
                            "properties": {
                                "name": { "type": "string", "required": false, "value": "" },
                                "id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                                "sms": {
                                "type": "object",
                                "properties": {
                                    "country_code": { "type": "string", "required": false, "value": "" },
                                    "phone_number": { "type": "string", "required": false, "value": "" }
                                }
                                }
                            }
                            },
                            "group": {
                            "type": "object",
                            "properties": {
                                "id": { "type": "string", "required": false, "value": "" }
                            }
                            }
                        }
                        ]
                    },
                    "referers": {
                        "type": "object",
                        "properties": {
                        "groups": { "type": "array", "required": false, "value": [] },
                        "members": { "type": "array", "required": false, "value": [] }
                        }
                    },
                    "fields": {
                        "type": "array",
                        "required": false,
                        "value": [
                            {                            
                                "id": { "type": "string", "required": false, "value": "sales_ID" },
                                "value": { "type": "string", "required": false, "value": "새 문서 작성" }
                            },
                            {
                                "id": { "type": "string", "required": false, "value": "company_ID" },
                                "value": { "type": "string", "required": false, "value": "FORCS" }
                            }
                        ]
                    },
                    "select_group_name": { "type": "string", "required": false, "value": "" },
                    /*"notification": {         //2024.09.23 notification 옵션에 의한 400오류가 발생하여 우선 숨김
                        "type": "array",
                        "required": false,
                        "value": [
                        {
                            "name": { "type": "string", "required": false, "value": "" },
                            "email": { "type": "string", "required": false, "value": "" },
                            "sms": {
                            "type": "object",
                            "properties": {
                                "country_code": { "type": "string", "required": false, "value": "" },
                                "phone_number": { "type": "string", "required": false, "value": "" }
                            }
                            },
                            "auth": {
                                "type": "object",
                                "properties": {
                                    "password": { "type": "string", "required": false, "value": "" },
                                    "password_hint": { "type": "string", "required": false, "value": "" },
                                    "mobile_verification": { "type": "boolean", "required": false, "value": false },
                                    "valid": {
                                    "type": "object",
                                    "properties": {
                                        "day": { "type": "integer", "required": false, "value": 0 },
                                        "hour": { "type": "integer", "required": false, "value": 0 }
                                        }
                                    }
                                }
                            }
                        }]
                    },*/
                    "comment": { "type": "string", "required": false, "value": "" }
                    }
                }
            }
        },
        "subpath": "",
        "dynamicUrlField": "",
        "queryStringField": {
            "template_id": { "required": true, "type": "string", "value": "f75c962e9d52407498611611c39801f4" , "position": "url" }
        }
    },
    "Document-create-external": {           //새 문서 작성(외부자)
    "url": "https://kr-api.eformsign.com/v2.0/api/documents/external",
    "method": "POST",
    "headers": {
    "Content-Type": { "type": "string", "value": "application/json", "required": true },
    "Authorization": { "type": "string", "value": "Bearer <api key>", "required": true }
    },
    "body": {
        "properties": {
        "document": {
            "type": "object",
            "properties": {
            "document_name": { "type": "string", "required": false, "value": "" },
            "select_group_name": { "type": "string", "required": false, "value": "" },
            "fields": {
                "type": "array",
                "required": false,
                "value": [
                ]
            },
            "recipients": {
                "type": "array",
                "required": false,
                "value": [
                {
                    "step_type": { "type": "string", "required": false, "value": "05" },
                    "use_mail": { "type": "boolean", "required": false, "value": true },
                    "use_sms": { "type": "boolean", "required": false, "value": false },
                    "member": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "required": false, "value": "테스트" },
                        "id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                        "sms": {
                        "type": "object",
                        "properties": {
                            "country_code": { "type": "string", "required": false, "value": "" },
                            "phone_number": { "type": "string", "required": false, "value": "" }
                        }
                        }
                    }
                    },
                    "auth": {
                    "type": "object",
                    "properties": {
                        "password": { "type": "string", "required": false, "value": "1111" },
                        "password_hint": { "type": "string", "required": false, "value": "1이 4번" },
                        "valid": {
                        "type": "object",
                        "properties": {
                            "day": { "type": "integer", "required": false, "value": 7 },
                            "hour": { "type": "integer", "required": false, "value": 0 }
                        }
                        }
                    }
                    }
                }
                ]
            },
            "send_external_pdf": {
                "type": "object",
                "required": false,
                "properties": {
                "email": { "type": "string", "required": false, "value": "" },
                "sms": {
                    "type": "object",
                    "properties": {
                    "country_code": { "type": "string", "required": false, "value": "" },
                    "phone_number": { "type": "string", "required": false, "value": "" }
                    }
                },
                "auth": {
                    "type": "object",
                    "properties": {
                    "password": { "type": "string", "required": false, "value": "1234" },
                    "password_hint": { "type": "string", "required": false, "value": "숫자 1234" }
                    }
                }
                }
            },
            "comment": { "type": "string", "required": false, "value": "테스트 입니다." }
            }
        }
        }    
    },
    "subpath": "",
    "dynamicUrlField": "",
    "queryStringField": {
    "company_id": { "type": "string", "required": true, "value": "4447ef653b954b0b8385763a49a54797" },
    "template_id": { "type": "string", "required": true, "value": "c76975207ca04f7ba8de66b32dc48557" }
    }
    },
    "Document-create-batchsingle":{             //문서 일괄 작성(단일 템플릿)
        "url": "https://kr-api.eformsign.com/v2.0/api/forms/mass_documents",
        "method": "POST",
        "headers": {
            "Content-Type": { "type": "string", "value": "application/json", "required": true },
            "Authorization": { "type": "string", "value": "Bearer <access_token>", "required": true }
        },
        "body": {
            "properties": {
            "documents": {
                "type": "array",
                "required": true,
                "value": [
                {
                    "select_group_name": { "type": "string", "required": false, "value": "" },
                    "document_name": { "type": "string", "required": false, "value": "webhook_Test_1" },
                    "fields": {
                    "type": "array",
                    "required": false,
                    "value": [
                        { "id": { "type": "string", "required": false, "value": "sales_ID" }, "value": { "type": "string", "required": false, "value": "test" } },
                        { "id": { "type": "string", "required": false, "value": "company_ID" }, "value": { "type": "string", "required": false, "value": "포시에스" } },
                        { "id": { "type": "string", "required": false, "value": "pj_ID" }, "value": { "type": "string", "required": false, "value": "테스트" } },
                        { "id": { "type": "string", "required": false, "value": "efs5_ID" }, "value": { "type": "string", "required": false, "value": "이폼사인" } },
                        { "id": { "type": "string", "required": false, "value": "date_1" }, "value": { "type": "string", "required": false, "value": "2024-09-30" } },
                        { "id": { "type": "string", "required": false, "value": "place_ID" }, "value": { "type": "string", "required": false, "value": "FORCS" } },
                        { "id": { "type": "integer", "required": false, "value": "date_2" }, "value": { "type": "string", "required": false, "value": "10:30" } },
                        { "id": { "type": "string", "required": false, "value": "pj_Multi" }, "value": { "type": "string", "required": false, "value": "테스트 중입니다." } },
                        { "id": { "type": "string", "required": false, "value": "date_today" }, "value": { "type": "string", "required": false, "value": "2024-08-26" } }
                    ]
                    },
                    "recipients": {
                    "type": "array",
                    "required": false,
                    "value": [
                        {
                        "step_type": { "type": "string", "required": false, "value": "05" },
                        "use_mail": { "type": "boolean", "required": false, "value": true },
                        "use_sms": { "type": "boolean", "required": false, "value": false },
                        "member": {
                            "type": "object",
                            "properties": {
                            "name": { "type": "string", "required": false, "value": "테스트" },
                            "id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                            "sms": {
                                "type": "object",
                                "properties": {
                                "country_code": { "type": "string", "required": false, "value": "" },
                                "phone_number": { "type": "string", "required": false, "value": "" }
                                }
                            }
                            }
                        },
                        "auth": {
                            "type": "object",
                            "properties": {
                            "password": { "type": "string", "required": false, "value": "" },
                            "password_hint": { "type": "string", "required": false, "value": "" },
                            "valid": {
                                "type": "object",
                                "properties": {
                                "day": { "type": "integer", "required": false, "value": 7 },
                                "hour": { "type": "integer", "required": false, "value": 0 }
                                }
                            }
                            }
                        }
                        }
                    ]
                    }
                },
                {
                    "select_group_name": { "type": "string", "required": false, "value": "" },
                    "document_name": { "type": "string", "required": false, "value": "webhook_Test_2" },
                    "fields": {
                    "type": "array",
                    "required": false,
                    "value": [
                        { "id": { "type": "string", "required": false, "value": "sales_ID" }, "value": { "type": "string", "required": false, "value": "test2" } },
                        { "id": { "type": "string", "required": false, "value": "company_ID" }, "value": { "type": "string", "required": false, "value": "포시에스2" } },
                        { "id": { "type": "string", "required": false, "value": "pj_ID" }, "value": { "type": "string", "required": false, "value": "테스트2" } },
                        { "id": { "type": "string", "required": false, "value": "efs5_ID" }, "value": { "type": "string", "required": false, "value": "이폼사인2" } },
                        { "id": { "type": "string", "required": false, "value": "date_1" }, "value": { "type": "string", "required": false, "value": "2024-09-30" } },
                        { "id": { "type": "string", "required": false, "value": "place_ID" }, "value": { "type": "string", "required": false, "value": "FORCS2" } },
                        { "id": { "type": "integer", "required": false, "value": "date_2" }, "value": { "type": "string", "required": false, "value": "10:30" } },
                        { "id": { "type": "string", "required": false, "value": "pj_Multi" }, "value": { "type": "string", "required": false, "value": "테스트2 중입니다." } },
                        { "id": { "type": "string", "required": false, "value": "date_today" }, "value": { "type": "string", "required": false, "value": "2024-08-26" } }
                    ]
                    },
                    "recipients": {
                    "type": "array",
                    "required": false,
                    "value": [
                        {
                        "step_type": { "type": "string", "required": false, "value": "05" },
                        "use_mail": { "type": "boolean", "required": false, "value": true },
                        "use_sms": { "type": "boolean", "required": false, "value": false },
                        "member": {
                            "type": "object",
                            "properties": {
                            "name": { "type": "string", "required": false, "value": "테스트1" },
                            "id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                            "sms": {
                                "type": "object",
                                "properties": {
                                "country_code": { "type": "string", "required": false, "value": "" },
                                "phone_number": { "type": "string", "required": false, "value": "" }
                                }
                            }
                            }
                        },
                        "auth": {
                            "type": "object",
                            "properties": {
                            "password": { "type": "string", "required": false, "value": "" },
                            "password_hint": { "type": "string", "required": false, "value": "" },
                            "valid": {
                                "type": "object",
                                "properties": {
                                "day": { "type": "integer", "required": false, "value": 7 },
                                "hour": { "type": "integer", "required": false, "value": 0 }
                                }
                            }
                            }
                        }
                        }
                    ]
                    }
                }
                ]
            },
            "comment": { "type": "string", "required": false, "value": "문서 확인 후 서명 요청드립니다." }
            }
        },
        "subpath": "",
        "dynamicUrlField": "",
        "queryStringField": {
            "template_id": { "required": true, "type": "string", "value": "f75c962e9d52407498611611c39801f4" }
        }
    },
    "Document-create-batchmulti":{      //문서 일괄 작성 (멀티 템플릿)
        "url": "https://kr-api.eformsign.com/v2.0/api/forms/mass_multi_documents",
        "method": "POST",
        "headers": {
            "Content-Type": { "type": "string", "value": "application/json", "required": true },
            "Authorization": { "type": "string", "value": "Bearer <access_token>", "required": true }
        },
        "body": {
            "properties": {
            "documents": {
                "type": "array",
                "required": true,
                "value": [
                {
                    "template_id": { "type": "string", "required": true, "value": "f75c962e9d52407498611611c39801f4" },
                    "document_name": { "type": "string", "required": false, "value": "멀티 템플릿 1" },
                    "fields": {
                    "type": "array",
                    "required": false,
                    "value": [
                        { "id": { "type": "string", "required": false, "value": "sales_ID" }, "value": { "type": "string", "required": false, "value": "템플릿1" } },
                        { "id": { "type": "string", "required": false, "value": "company_ID" }, "value": { "type": "string", "required": false, "value": "테스트" } },
                        { "id": { "type": "string", "required": false, "value": "pj_ID" }, "value": { "type": "string", "required": false, "value": "멀티 템플릿 테스트" } },
                        { "id": { "type": "string", "required": false, "value": "efs5_ID" }, "value": { "type": "string", "required": false, "value": "김대수" } },
                        { "id": { "type": "string", "required": false, "value": "date_1" }, "value": { "type": "string", "required": false, "value": "2024-08-30" } },
                        { "id": { "type": "string", "required": false, "value": "place_ID" }, "value": { "type": "string", "required": false, "value": "FORCS" } },
                        { "id": { "type": "string", "required": false, "value": "date_2" }, "value": { "type": "string", "required": false, "value": "10:30" } },
                        { "id": { "type": "string", "required": false, "value": "pj_Multi" }, "value": { "type": "string", "required": false, "value": "테스트 중입니다." } },
                        { "id": { "type": "string", "required": false, "value": "date_today" }, "value": { "type": "string", "required": false, "value": "2024-08-26" } }
                    ]
                    },
                    "recipients": {
                    "type": "array",
                    "required": false,
                    "value": [
                        {
                        "step_type": { "type": "string", "required": false, "value": "05" },
                        "auth": {
                            "type": "object",
                            "properties": {
                            "password": { "type": "string", "required": false, "value": "1111" },
                            "password_hint": { "type": "string", "required": false, "value": "1이 4개" }
                            }
                        },
                        "use_mail": { "type": "boolean", "required": false, "value": true },
                        "use_sms": { "type": "boolean", "required": false, "value": false },
                        "member": {
                            "type": "object",
                            "properties": {
                            "name": { "type": "string", "required": false, "value": "김대수" },
                            "id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                            "sms": {
                                "type": "object",
                                "properties": {
                                "country_code": { "type": "string", "required": false, "value": "" },
                                "phone_number": { "type": "string", "required": false, "value": "" }
                                }
                            }
                            }
                        }
                        }
                    ]
                    }
                },
                {
                    "template_id": { "type": "string", "required": true, "value": "ca1ddf520ead42a58003b4cda48eeffb" },
                    "fields": {
                    "type": "array",
                    "required": false,
                    "value": [
                        { "id": { "type": "string", "required": false, "value": "name_ID" }, "value": { "type": "string", "required": false, "value": "템플릿2" } },
                        { "id": { "type": "string", "required": false, "value": "email_ID" }, "value": { "type": "string", "required": false, "value": "dskim@forcs.com" } },
                        { "id": { "type": "boolean", "required": false, "value": "check_ID" }, "value": { "type": "boolean", "required": false, "value": false } }
                    ]
                    },
                    "recipients": {
                    "type": "array",
                    "required": false,
                    "value": [
                        {
                        "step_type": { "type": "string", "required": false, "value": "01" },
                        "auth": {
                            "type": "object",
                            "properties": {
                            "password": { "type": "string", "required": false, "value": "11111" },
                            "password_hint": { "type": "string", "required": false, "value": "1이 5개" },
                            "valid": {
                                "type": "object",
                                "properties": {
                                "day": { "type": "integer", "required": false, "value": 0 },
                                "hour": { "type": "integer", "required": false, "value": 2 }
                                }
                            }
                            }
                        },
                        "use_mail": { "type": "boolean", "required": false, "value": false },
                        "use_sms": { "type": "boolean", "required": false, "value": true },
                        "member": {
                            "type": "object",
                            "properties": {
                            "name": { "type": "string", "required": false, "value": "대수킴" },
                            "id": { "type": "string", "required": false, "value": "" },
                            "sms": {
                                "type": "object",
                                "properties": {
                                "country_code": { "type": "string", "required": false, "value": "+82" },
                                "phone_number": { "type": "string", "required": false, "value": "1022273663" }
                                }
                            }
                            }
                        }
                        }
                    ]
                    }
                }
                ]
            },
            "comment": { "type": "string", "required": false, "value": "문서 일괄 작성(멀티 템플릿) 테스트입니다." }
            }
        },
        "subpath": "",
        "dynamicUrlField": "",
        "queryStringField": ""
    },
    'Document-search-info':{        //문서 정보 조회
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'GET',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
        },
        "body": {
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "type": "string", "value": 'db21baf9bce44c05b6da4d2e10476f9a', "position": "url" }
        },
        "subpath": '',
        "queryStringField": {
            "include_fields": { "required": false, "type": "boolean", "value": false },
            "include_histories": { "required": false, "type": "boolean", "value": false },
            "include_previous_status": { "required": false, "type": "boolean", "value": false },
            "include_next_status": { "required": false, "type": "boolean", "value": false },
            "include_external_token": { "required": false, "type": "boolean", "value": false },
        }
    },
    "Document-search-list": {       //문서 목록 조회
        "url": "https://kr-api.eformsign.com/v2.0/api/list_document",
        "method": "POST",
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
        },
        "body": {
            "properties": {
                "type": { "type": "string", "required": true, "value": "03" },
                "title_and_content": { "type": "string", "required": false, "value": "" },
                "title": { "type": "string", "required": false, "value": "" },
                "content": { "type": "string", "required": false, "value": "" },
                "limit": { "type": "number", "required": true, "value": 20 },
                "skip": { "type": "number", "required": true, "value": "0" },
                "start_create_date": { "type": "string", "required": false, "value": "" },
                "end_create_date": { "type": "string", "required": false, "value": "" }
            }
        },
        "subpath": "",
        "dynamicUrlField": "",
        "queryStringField": {
            "include_fields": { "required": false, "type": "boolean", "value": false },
            "include_histories": { "required": false, "type": "boolean", "value": false },
            "include_previous_status": { "required": false, "type": "boolean", "value": false },
            "include_next_status": { "required": false, "type": "boolean", "value": false },
            "include_external_token": { "required": false, "type": "boolean", "value": false },
        }
    },
    "Document-search-use":{     //이용현황 조회
        "url": "https://kr-api.eformsign.com/v2.0/api/companies",
        "method": "GET",
        "headers": {
        "Authorization": { "type": "string", "value": "Bearer <access_token>", "required": true }
        },
        "body": {
        },
        "dynamicUrlField": {
            "company_id": { "type": "string", "required": true, "value": "4447ef653b954b0b8385763a49a54797" , "position": "url" }
        },        
        "subpath": "/use_status",
        "queryStringField": {
        "term": { "type": "string", "required": false, "type": "string", "value": "monthly" },  // 기본 값이 monthly로 지정됨
        "date": { "type": "string", "required": false, "type": "string", "value": "202409" }  // 연간 조회: 4자리, 월간 조회: 6자리
        }
    },    
    "Document-request-rerequest":{      //문서 재요청
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'POST',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
        },
        "body": {
            "properties": {
            "input": {
                "type": "object",
                "required": true,
                "properties": {
                "next_steps": {
                    "type": "array",
                    "required": true,
                    "value": [
                    {
                        "step_type": { "type": "string", "required": true, "value": "06" },                        
                        "approvers": {
                        "type": "array",
                        "required": true,
                        "value": [
                            {
                            "seq": { "type": "int", "required": true, "value": 2 },
                            "user_id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                            "user_name": { "type": "string", "required": false, "value": "김대수" },
                            "code": { "type": "string", "required": false, "value": "+82" },
                            "number": { "type": "string", "required": false, "value": "1022273663" },
                            "auth_password": { "type": "string", "required": false, "value": "1111" },
                            "auth_hint": { "type": "string", "required": false, "value": "test" },
                            "auth_valid_time": { "type": "int", "required": true, "value": 3 },
                            "approval_line_name": { "type": "string", "required": false, "value": "결제선 이름" },
                            "use_mobile_auth": { "type": "boolean", "required": true, "value": true },
                            "use_mobile_auth_view": { "type": "boolean", "required": true, "value": true },
                            "unselected_sections": { "type": "array", "required": false, "value": [] }
                            }
                        ]                            
                        },
                        "recipients": {
                        "type": "array",
                        "required": false,
                        "value": [
                            {
                            "step_seq": { "type": "int", "required": false, "value": 1 },
                            "use_mail": { "type": "boolean", "required": false, "value": true },
                            "use_sms": { "type": "boolean", "required": false, "value": true },
                            "member": {
                                "type": "object",
                                "required": false,
                                "properties": {
                                "name": { "type": "string", "required": false, "value": "대수킴" },
                                "id": { "type": "string", "required": false, "value": "dskim@forcs.com" },
                                "sms": {
                                    "type": "object",
                                    "required": false,
                                    "properties": {
                                    "country_code": { "type": "string", "required": false, "value": "+82" },
                                    "phone_number": { "type": "string", "required": false, "value": "1022273663" }
                                    }
                                }
                                }
                            },
                            "business_num": { "type": "string", "required": false, "value": "" },
                            "group": {
                                "type": "object",
                                "required": false,
                                "properties": {
                                "id": { "type": "string", "required": false, "value": "" }
                                }
                            },
                            "auth": {
                                "type": "object",
                                "required": false,
                                "properties": {
                                "password": { "type": "string", "required": false, "value": "1111" },
                                "password_hint": { "type": "string", "required": false, "value": "1이 4개" },
                                "valid": {
                                    "type": "object",
                                    "required": false,
                                    "properties": {
                                    "day": { "type": "int", "required": false, "value": 0 },
                                    "hour": { "type": "int", "required": false, "value": 3 }
                                    }
                                }
                                }
                            }
                            }
                        ]
                        },
                        "comment": { "type": "string", "required": false, "value": "문서 재요청 입니다." }
                    }
                    ]
                }
                }
            }
            }
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "type": "string", "value": 'f724a9b792be488e98a78863c4d510e9', "position": "url" },
        },        
        "subpath": '/re_request_outsider',
        "queryStringField": ""
    },
    'Document-request-download':{       //문서 다운로드
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'GET',
        "headers":{
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
        },
        "body": {
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "value": 'a5709e3505cb4a80ae33555e24280bfd', "position": "url" },
        },        
        "subpath": '/download_files',
        "queryStringField": {
            "file_type": { "required": true, "type": "string", "value": 'document,audit_trail' },
            "file_name": { "required": false, "type": "string", "value": 'eformsignDemo' }
        }
    },    
    "Document-request-downloadattach":{     //문서 첨부 파일 다운로드
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'GET',
        "headers":{
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"},
        },
        "body": {
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "value": 'a360b005389c45cf8b374b2bdcd14e7e', "position": "url" },
        },        
        "subpath": '/download_attach_files',
        "queryStringField": {
            "doc_without_attachments": { "required": false, "type": "boolean", "value": false }            
        }
    },    
    "Document-change-delete":{      //문서 삭제
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'DELETE',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"}
        },
        "body": {       //현재는 한 개의 문서만 삭제하도록 구현, 일괄 삭제 필요 시, document_ids를 array 형식으로 진행
            "properties": {
                "document_ids" : {
                    "type": "array", 
                    "required": true,
                    "value": [
                        "37150542f0c243cbb4f8df1bc21294cf"
                    ]
                }
            }
        },
        "dynamicUrlField": {
        },        
        "subpath": "",
        "queryStringField": ""
    },
    "Document-change-cancel":{      //문서 취소
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents/cancel',
        "method": 'POST',
        "headers":{
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"}
        },
        "body": {       //현재는 한 개의 문서만 삭제하도록 구현, 일괄 취소 필요 시, document_ids를 array 형식으로 진행
            "properties": {
                "input": { 
                    "type": "object", 
                    "required": true, 
                    "properties":  {
                        "document_ids": {
                            "type": "array", 
                            "required": true, 
                            "value": [
                                "138691b8d02f457ba85ad7e680b33645"
                            ]
                        },
                        "comment":{
                            "type": "string",
                            "required": false,
                            "value": "문서 취소 입니다."
                        }
                    }
                }
            }
        },
        "dynamicUrlField": {
        },        
        "subpath": "",
        "queryStringField": ""
    },
    "Document-change-send":{        //초안 문서를 다음 단계로 전송(임시 저장한 문서를 전송)
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'POST',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"}
        },
        "body": {
            "properties": {
                "comment": { "type": "string", "required": false, "value": "초안 문서 다음 단계로 전송입니다." },
                "remove_company_stamp_mark": { "type": "boolean", "required": false, "value": true }
            }
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "value": 'de7b8f3a7b9f4327a97cb23d2130bd78', "position": "url" },
        },        
        "subpath": "/send",
        "queryStringField": ""
    },
    "Document-change-exapproval":{      //외부 결재 상태 문서를 다음 단계로 전송
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'PATCH',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"}
        },
        "body": {
            "properties": {
                "executorId": { "type": "string", "required": false, "value": "" },
                "executorName": { "type": "string", "required": false, "value": "" },
                "executionTime": { "type": "string", "required": false, "value": "" },
                "comment": { "type": "string", "required": false, "value": "" }
            }
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "type":"string", "value": 'de7b8f3a7b9f4327a97cb23d2130bd78', "position": "url" },
            "type": { "required": true, "type":"string","value": 'cancel', "position": "subpath"}
        },        
        "subpath": "/external_approval/types",
        "queryStringField": {
            "lang": { "required": false, "type": "string", "value": "ko" }            
        }
    },
    "Document-change-unitapproval":{},
    "Document-change-unitreject":{},
    "Document-change-refresh":{
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'POST',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"}
        },
        "body": {
            "properties": {
                "step_seq": { 
                    "type": "array", 
                    "required": false, 
                    "value": [
                        ""
                    ] 
                }                
            }
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "value": '95ecad7044674b21bb8a2422387035d2', "position": "url" },
        },        
        "subpath": "/refresh_complete_token",
        "queryStringField": ""
    },
    "Document-change-reject":{
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'POST',
        "headers":{
            "Content-Type" : { "required": true, "type": "string", "value": "application/json"},
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <access_token>"}
        },
        "body": {
            "properties": {
                "previous_steps": { 
                    "type": "array", 
                    "required": false, 
                    "value": [
                        -1
                    ]
                },
                "comment": {
                    "type": "string",
                    "required": false,
                    "value": "내부자 반려"
                }
            }
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "value": '88f324109f674f3da25bff64f6b1ddcb', "position": "url" },
        },        
        "subpath": "/decline",
        "queryStringField": ""
    },
    "Document-change-exreject":{
        "url": 'https://kr-api.eformsign.com/v2.0/api/documents',
        "method": 'POST',
        "headers":{
            "Authorization" : { "required": true, "type": "string", "value": "Bearer <api key>"}
        },
        "body": {
            "properties": {
                "comment": {
                    "type": "string",
                    "required": false,
                    "value": "외부자 반려"
                }
            }
        },
        "dynamicUrlField": {
            "document_id": { "required": true, "value": '0ee48a1ae36b4d24a8a10898f0a45916', "position": "url" },
        },        
        "subpath": "/external_decline",
        "queryStringField": {                
            "company_id": { "type": "string", "required": true, "value": "4447ef653b954b0b8385763a49a54797" },
            "outside_token": { "type": "string", "required": true, "value": "598e265797084e7182f45be9f5ec4c9e" }
        }
    },
};

