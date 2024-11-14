import { loadCategories, toggleSidebar, toggleDropdown, showForm } from './uimanager.js';
import { initializeUserInfo } from './userinfo.js';
import { toggleMode } from './formmanager.js';

// 페이지 로드 시 초기화 작업 수행
window.addEventListener('DOMContentLoaded', () => {
    // 사용자 정보가 있는지 확인하고, 없으면 사용자 정보를 입력하게 함
    initializeUserInfo(() => {
        // 사용자 정보가 있을 때만 카테고리 로드 및 UI 초기화
        loadCategories(); // 사이드바에 카테고리 로드
    });
});

// 모드 전환 버튼 기능 연결

window.toggleMode = toggleMode;
window.toggleSidebar = toggleSidebar; // 사이드바 토글 함수 연결
window.toggleDropdown = toggleDropdown; // 드롭다운 토글 함수 연결
window.showForm = showForm; // showForm 함수 연결
