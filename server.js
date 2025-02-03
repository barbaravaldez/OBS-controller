const http = require('http');
const WebSocket = require('ws');
const obs = require('./obsClient');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', async message => {
    const data = JSON.parse(message);
    console.log('Received from client:', data);

    // Handle client commands, e.g., switch scenes
    if (data.command === 'switchScene') {
      await obs.call('SetCurrentProgramScene', { sceneName: data.sceneName });
    }
  });

  // Forward OBS events to the client
  obs.on('CurrentProgramSceneChanged', eventData => {
    ws.send(JSON.stringify({ event: 'sceneChanged', sceneName: eventData.sceneName }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server is listening on http://localhost:8080');
});
