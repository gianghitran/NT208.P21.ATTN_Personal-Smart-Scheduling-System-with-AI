const path = require('path');
const dotenv = require('dotenv');

const { Keystone } = require('@keystonejs/keystone');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { Text, Checkbox, Relationship, DateTime, DateTimeUtc, Select, Integer, Json, Password } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const keystone = new Keystone({
    name: 'Keystone v5 MongoDB Example',
    adapter: new MongooseAdapter({ mongoUri: process.env.MONGOSV }),
    cookieSecret: process.env.COOKIE_SECRET,
});

keystone.createList('User', {
    fields: {
        name: { type: Text },
        email: { type: Text, isUnique: true },
        password: { type: Password }, // cần thiết lập rõ type
        fullname: { type: Text },
        admin: {
            type: Checkbox,
            defaultValue: false,
        },
        createdAt: {
            type: DateTime,
            defaultValue: () => new Date().toISOString(),
            access: { update: () => false }, // chỉ xem, không sửa
        },
        updatedAt: {
            type: DateTime,
            defaultValue: () => new Date().toISOString(),
        },
    },
    hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
            if (existingItem) {
                resolvedData.updatedAt = new Date().toISOString(); // cập nhật updatedAt khi sửa
            }
            return resolvedData;
        },
    },
    labelResolver: item => item.email || `User ${item.id}`, // tránh lỗi khi email null
});

const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: 'User',
    config: {
        identityField: 'email',
        secretField: 'password',
    },
});

// === Event List ===
keystone.createList('Event', {
    fields: {
        userId: { type: Relationship, ref: 'User' }, // Sẽ hiển thị email người dùng
        title: { type: Text },
        description: { type: Text },
        start: { type: DateTimeUtc },
        end: { type: DateTimeUtc },
        category: { type: Text },
        completed: { type: Checkbox },
    },
    labelResolver: item => `${item.title} (${item.category})`
});

// === Event Sharing List ===
keystone.createList('EventSharing', {
    fields: {
        eventId: { type: Text },
        inviteeId: { type: Relationship, ref: 'User' },
        invitorId: { type: Relationship, ref: 'User' },
        ownerId: { type: Relationship, ref: 'User' },
        start: { type: DateTimeUtc },
        end: { type: DateTimeUtc },
        role: { type: Select, options: 'viewer, editor' },
        status: { type: Select, options: 'pending, accepted, declined' },
        isRead: { type: Checkbox },
        hidden: { type: Checkbox },
        invitedAt: { type: DateTimeUtc },
        createdAt: { type: DateTimeUtc },
        updatedAt: { type: DateTimeUtc }
    },
    labelResolver: item => `Share ${item.eventId} to ${item.inviteeId?.email || 'Unknown'}`
});

// === Refresh Token List ===
keystone.createList('RefreshToken', {
    fields: {
        userId: { type: Relationship, ref: 'User' },
        refreshToken: { type: Text },
        createdAt: { type: DateTimeUtc },
    },
    labelResolver: item => `Token for ${item.userId?.email || 'Unknown'}`
});

// === Chat History List ===
keystone.createList('ChatHistory', {
    fields: {
        userId: { type: Relationship, ref: 'User' },
        messages: { type: Text }, // Sửa từ Json thành Text
        createdAt: { type: DateTimeUtc },
        updatedAt: { type: DateTimeUtc },
    },
    labelResolver: item => `Chat of ${item.userId?.email || 'Unknown'}`
});



module.exports = {
    keystone,
    apps: [
        new GraphQLApp(),
        new AdminUIApp({
            name: "ThreeBears Admin",
            enableDefaultRoute: true,
            adminPath: "/admin", // hoặc để mặc định
            authStrategy, // nếu có xác thực
            signoutPath: "/admin/signout", // đường dẫn logout
        }),
    ],
};
