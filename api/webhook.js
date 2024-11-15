// root/api/webhook.js
let webhookDataList = []; // 서버 내에서 임시로 웹훅 데이터를 저장할 배열

export default async (req, res) => {
    if (req.method === 'POST') {
        // 웹훅 데이터를 수신하여 배열에 추가
        const webhookData = req.body;
        webhookDataList.push(webhookData);
       
        // 웹훅 수신 응답
        res.status(200).json({ message: 'Webhook received', data: webhookData });
    } else if (req.method === 'GET') {
        // GET 요청 시, 현재 저장된 모든 웹훅 데이터를 반환
        res.status(200).json(webhookDataList);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
