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

  data.forEach((webhookData, index) => {
      const listItem = document.createElement('div');
      listItem.textContent = `Webhook ${index + 1}`;
      listItem.style.cursor = 'pointer';
      
      // 리스트 항목 클릭 시, 상세 데이터 표시
      listItem.onclick = () => showWebhookDetails(webhookData);

      listContainer.appendChild(listItem);
  });
}

// 선택된 웹훅의 상세 JSON 데이터를 표시하는 함수
function showWebhookDetails(webhookData) {
  const detailsContainer = document.getElementById('webhookDetails');
  detailsContainer.innerHTML = `<pre>${JSON.stringify(webhookData, null, 2)}</pre>`;
}

// 5초마다 웹훅 데이터를 가져옴 (폴링)
setInterval(fetchWebhookData, 5000);

// 페이지 로드 시, 즉시 웹훅 데이터를 한 번 가져옴
fetchWebhookData();
