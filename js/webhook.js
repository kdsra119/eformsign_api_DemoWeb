// js/webhook.js

// 서버에서 웹훅 데이터를 가져오는 함수
async function fetchWebhookData() {
  try {
      const response = await fetch('/api/webhook'); // Vercel 서버의 GET 엔드포인트에 요청
      const data = await response.json();
      updateWebhookList(data);
  } catch (error) {
      console.error('Error fetching webhook data:', error);
  }
}

// 웹훅 리스트를 업데이트하는 함수
function updateWebhookList(data) {
  const listContainer = document.getElementById('webhookList');
  listContainer.innerHTML = ''; // 기존 리스트 초기화

  data.forEach(webhookData => {
      const listItem = document.createElement('div');
      
      // 타이틀 포맷: 현재 시간 (dd/yy hh:mm)_"document_id"_"document_status"
      const now = new Date();
      const timeString = `${now.getDate()}/${now.getMonth() + 1} ${now.getHours()}:${now.getMinutes()}`;
      const title = `${timeString}_${webhookData.document?.id || ''}_${webhookData.document?.status || ''}`;
      
      listItem.textContent = title;
      listItem.style.cursor = 'pointer';
      listItem.style.padding = '5px';
      listItem.style.margin = '5px 0';
      listItem.style.borderBottom = '1px solid #ccc';

      // 리스트 항목 클릭 시, 상세 데이터 표시
      listItem.onclick = () => {
          showWebhookDetails(webhookData);
          updateWebhookInfo(webhookData); // 하단 정보 업데이트
      };

      listContainer.appendChild(listItem);
  });
}

// 선택된 웹훅의 상세 JSON 데이터를 표시하는 함수
function showWebhookDetails(webhookData) {
  const detailsContainer = document.getElementById('webhookDetails');
  detailsContainer.innerHTML = `<pre>${JSON.stringify(webhookData, null, 2)}</pre>`;
}

// 선택된 웹훅의 주요 정보를 하단에 표시하는 함수
function updateWebhookInfo(webhookData) {
  document.getElementById('document_id').value = webhookData.document?.id || '';
  document.getElementById('template_id').value = webhookData.document?.template_id || '';
  document.getElementById('document_status').value = webhookData.document?.status || '';
  document.getElementById('document_name').value = webhookData.document?.title || '';
}

// 5초마다 웹훅 데이터를 가져옴 (폴링)
setInterval(fetchWebhookData, 5000);

// 페이지 로드 시, 즉시 웹훅 데이터를 한 번 가져옴
fetchWebhookData();
