// ID 규칙 정리:
// 1. 대분류만 첫 글자가 대문자로 시작.
// 2. 단계 구분은 하이픈('-')을 사용.

// API 카테고리와 서브카테고리 정의
export const categories = [
    {
        id: 'Apiauth',
        name: '토큰 관리',
        subcategories: [
            { id: 'Apiauth-access', name: '토큰 발급' },
            { id: 'Apiauth-refresh', name: '토큰 갱신' }
        ]
    },
    {
        id: 'Document',
        name: '문서 관리',
        subcategories: [
            { id: 'Document-creation', name: '문서 작성', 
                subgroups: [
                    {id: 'Document-create-member', name: '새 문서 작성(멤버)'},
                    {id: 'Document-create-external', name: '새 문서 작성(외부)'},
                    {id: 'Document-create-batchsingle', name: '문서 일괄 작성(단일)'},
                    {id: 'Document-create-batchmulti', name: '문서 일괄 작성(멀티)'}
                ]
            },
            { id: 'Document-search', name: '문서 조회',
                subgroups: [
                    {id: 'Document-search-info', name: '문서 정보 조회'},
                    {id: 'Document-search-list', name: '문서 목록 조회'},
                    {id: 'Document-search-use', name: '이용 현황 조회'}
                ]
            },
            { id: 'Document-request', name: '문서 요청',
                subgroups: [
                    { id: 'Document-request-rerequest', name: '문서 재요청' },
                    { id: 'Document-request-download', name: '문서 파일 다운로드' },
                    { id: 'Document-request-downloadattach', name: '문서 첨부 파일 다운로드' }                  
                ]
            },
            { id: 'Document-change', name: '문서 상태 변경',
                subgroups: [
                    { id: 'Document-change-delete', name: '문서 삭제' },
                    { id: 'Document-change-cancel', name: '문서 취소' },                   
                    { id: 'Document-change-send', name: '초안 문서 다음 단계' },
                    //{ id: 'Document-change-exapproval', name: '외부 결재 상태 다음 단계' },       //2024.11.04 404에러 발생으로 우선 카테고리 제외
                    //{ id: 'Document-change-unitapproval', name: '통합 결재 승인' },       //2024.11.04 기존 SaaS에서는 제공되지 않기 때문에 제외
                    //{ id: 'Document-change-unitreject', name: '통합 결재 반려' },         //2024.11.04 기존 SaaS에서는 제공되지 않기 때문에 제외
                    { id: 'Document-change-refresh', name: '완료 토큰 기한 연장' },
                    { id: 'Document-change-reject', name: '내부자 반려' },
                    { id: 'Document-change-exreject', name: '외부자 반려' }
                ]
            },
            
        ]
    },
    {
        id: 'Template',
        name: '템플릿 관리',
        subcategories: [
            { id: 'Template-list', name: '템플릿 목록 조회' },
            //{ id: 'Template-fields', name: '템플릿 필드 정보 조회' },     //fetch에서 get에 requestBody 추가 안되서 우선 제외
            { id: 'Template-imagedown', name: '템플릿 이미지 다운로드' },
            { id: 'Template-download', name: '템플릿 다운로드' }
        ]
    },
    
    {
        id: 'Member',
        name: '멤버 관리',
        subcategories: [
            { id: 'Member-list', name: '멤버 목록 조회' },
            { id: 'Member-add', name: '멤버 추가' },            
            { id: 'Member-batchadd', name: '멤버 일괄 추가' },
            { id: 'Member-update', name: '멤버 수정' },
            { id: 'Member-delete', name: '멤버 탈퇴' }
        ]
    },
    {
        id: 'Group',
        name: '그룹 관리',
        subcategories: [
            { id: 'Group-list', name: '그룹 목록 조회' },
            { id: 'Group-add', name: '그룹 추가' },
            { id: 'Group-edit', name: '그룹 수정' },
            { id: 'Group-delete', name: '그룹 삭제' }
        ]
    },
    {
        id: 'Stamp',
        name: '도장 관리',
        subcategories: [
            { id: 'Stamp-info', name: '도장 정보 조회' },
            { id: 'Stamp-list', name: '도장 목록 조회' },
            { id: 'Stamp-add', name: '도장 추가' },
            { id: 'Stamp-edit', name: '도장 수정' },
            { id: 'Stamp-delete', name: '도장 삭제' }
        ]
    },
    {
        id: 'User',
        name: '회원 정보 관리',
        subcategories: [
            { id: 'User-info', name: '회원 정보 조회' },
            { id: 'User-edit', name: '회원 정보 수정' }
        ]
    },
    {
        id: 'webhook-demo',
        name: 'Webhook Demo',
        subcategories: [
            { id: 'webhook-structure', name: '웹훅 구조 및 종류' },
            { id: 'webhook-test', name: '이벤트 웹훅 테스트' }
        ]
    },
    {
        id: 'embedding-demo',
        name: '임베딩 Demo',
        subcategories: [
            { id: 'embedding-template', name: '템플릿 문서 작성' },
            { id: 'embedding-file', name: '내 파일로 문서 작성' },
            { id: 'embedding-form', name: '템플릿 생성' },
            { id: 'embedding-callback', name: '응답 확인 및 콜백 설정' },
            { id: 'embedding-status', name: '이용현황' }
        ]
    }
  // 필요에 따라 더 많은 카테고리와 서브카테고리를 추가할 수 있습니다.
];
