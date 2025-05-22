let clients = [];

function addClient(clientId, res, groupId) {
  const existsIndex = clients.findIndex(client => client.id === clientId && client.groupId === groupId);
  if (existsIndex !== -1) {
    clients[existsIndex].res = res; // cập nhật lại response nếu client đã tồn tại (reload tab)
  } else {
    clients.push({ id: clientId, res, groupId });
  }
}


function removeClient(clientId, groupId) {
    clients = clients.filter(client => !(client.id === clientId && client.groupId === groupId));
}

function sendEvent(data, groupId = null, excludeClientId = null) {
  clients.forEach((client, index) => {
    if (client.groupId === groupId && client.id !== excludeClientId) {
      try {
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error('Error sending SSE, removing client:', client.id);
        clients.splice(index, 1);
      }
    }
  });
}


module.exports = {
    addClient,
    removeClient,
    sendEvent,
};