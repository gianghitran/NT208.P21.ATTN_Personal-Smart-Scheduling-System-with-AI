const express = require('express');
const { addClient, removeClient } = require('../sse/sseService');
const route = express.Router();

route.get('/stream/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const clientId = req.query.clientId;

    if (!clientId) {
        res.status(400).send("Missing clientId");
        return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    addClient(clientId, res, groupId);

    req.on('close', () => {
        removeClient(clientId, groupId);
    });
});

module.exports = route;