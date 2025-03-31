const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow requests from any origin

app.get('/api/htb', async (req, res) => {
  const HTB_USER_ID = process.env.HTB_USER_ID;
  const HTB_API_TOKEN = process.env.HTB_API_TOKEN;

  if (!HTB_USER_ID || !HTB_API_TOKEN) {
    return res.status(400).json({ error: 'HTB_USER_ID or HTB_API_TOKEN is missing.' });
  }

  try {
    const response = await axios.get(
      `https://www.hackthebox.com/api/v4/profile/activity/${HTB_USER_ID}`,
      {
        headers: {
          Authorization: `Bearer ${HTB_API_TOKEN}`,
          Accept: 'application/json',
        },
      }
    );

    const machines = response.data.profile.activity
      .filter((activity) => activity.object_type === 'machine' && activity.type === 'root')
      .map((machine) => ({
        id: machine.id,
        name: machine.name,
        date: machine.date,
        machine_avatar: `https://labs.hackthebox.com${machine.machine_avatar}`,
      }));

    res.status(200).json({ machines });
  } catch (error) {
    console.error('Error fetching data from Hack The Box API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Hack The Box API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
