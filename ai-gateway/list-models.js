import https from 'https';

const apiKey = 'AIzaSyDMA_PIfqUYcVq-50sEd2xmA64raIypyBU';

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log('Available models for generateContent:');
    data.models?.filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .forEach(m => console.log(`- ${m.name}`));
  });
});
