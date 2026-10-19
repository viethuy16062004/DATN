import https from 'https';

const apiKey = 'AIzaSyDMA_PIfqUYcVq-50sEd2xmA64raIypyBU';
const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

async function testModel(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: 'Nêu ngắn gọn phương pháp làm bài tập thuật toán đồ thị' }] }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        console.log(`[${model}] Status:`, res.statusCode);
        try {
          const parsed = JSON.parse(body);
          if (parsed.candidates && parsed.candidates[0]?.content?.parts?.[0]?.text) {
            console.log(`[${model}] Phản hồi AI thật:\n`, parsed.candidates[0].content.parts[0].text.substring(0, 150) + '...\n');
            resolve(true);
          } else {
            console.log(`[${model}] Response JSON:`, body);
            resolve(false);
          }
        } catch (e) {
          console.log(`[${model}] Lỗi parse JSON:`, body);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`[${model}] Request error:`, e.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  for (const m of models) {
    console.log(`--- Testing ${m} ---`);
    await testModel(m);
  }
}

main();
