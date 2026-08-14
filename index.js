const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = '8955383487:AAENSMWHgXSp0jjFX6ZI8HzyoVC_GIRI0VA';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

app.post('/telegram', async (req, res) => {
  const update = req.body;
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const userText = update.message.text;

    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: userText }]
      }, {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const reply = response.data.choices[0].message.content;
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: reply
      });
    } catch (error) {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: 'Ошибка DeepSeek'
      });
    }
  }
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Telegram бот запущен'));
