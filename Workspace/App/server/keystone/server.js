require('dotenv').config();
const { keystone, apps } = require('./keystone');

const originalLog = console.log;
console.log = function () { }; // Tạm thời tắt log

keystone
    .prepare({
        apps,
        dev: true,
        port: 3001,
        onConnect: () => {
            console.log('KeystoneJS is connected to MongoDB');
        },
    })
    .then(async ({ middlewares }) => {
        console.log = originalLog; // Khôi phục log
        await keystone.connect();
        const express = require('express');
        const app = express();

        // Mount Keystone middlewares
        app.use(middlewares);

        app.listen(3001, () => {
            console.log('✅ KeystoneJS Admin UI: http://localhost:3001/admin');
        });
    });
