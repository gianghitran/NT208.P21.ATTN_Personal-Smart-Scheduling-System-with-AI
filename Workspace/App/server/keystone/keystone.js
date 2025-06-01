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
        email: { type: Text, isUnique: true, isRequired: true },
        password: { type: Password, isRequired: true },
        full_name: { type: Text, isRequired: true },
        admin: {
            type: Checkbox,
            defaultValue: false,
        },
        createdAt: {
            type: DateTime,
            defaultValue: () => new Date().toISOString(),
            access: { update: () => false },
        },
        updatedAt: {
            type: DateTime,
            defaultValue: () => new Date().toISOString(),
        },
    },
    hooks: {
        resolveInput: async ({ resolvedData, existingItem }) => {
            if (existingItem) {
                resolvedData.updatedAt = new Date().toISOString();
            }
            return resolvedData;
        },
    },
    labelResolver: item => item.email || `User ${item.id}`,
    adminConfig: {
        defaultColumns: 'email, full_name, admin, createdAt, updatedAt',
    }
});

// Thêm kiểm tra admin=true khi đăng nhập vào Admin UI
const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: 'User',
    config: {
        identityField: 'email',
        secretField: 'password',
        // Chỉ cho phép user có admin=true đăng nhập vào Admin UI
        itemQueryName: 'user_where',
        selectArgs: { where: { admin: true } }
    },
});

// === Event List ===
keystone.createList('Event', {
    fields: {
        userId: { type: Relationship, ref: 'User' },
        title: { type: Text },
        description: { type: Text },
        start: { type: DateTimeUtc },
        end: { type: DateTimeUtc },
        category: { type: Text },
        completed: { type: Checkbox },
    },
    labelResolver: item => `${item.title} (${item.category})`,
    adminConfig: {
        defaultColumns: 'title, userId, start, end, category, completed, description',
    },
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
    labelResolver: item => `Share ${item.eventId} to ${item.inviteeId?.email || 'Unknown'}`,
    adminConfig: {
        defaultColumns: 'eventId, inviteeId, invitorId, ownerId, start, end, role, status, isRead, invitedAt, createdAt, updatedAt',
    },
});

// === Refresh Token List ===
keystone.createList('RefreshToken', {
    fields: {
        userId: { type: Relationship, ref: 'User' },
        refreshToken: { type: Text },
        createdAt: { type: DateTimeUtc },
    },
    labelResolver: item => `Token for ${item.userId?.email || 'Unknown'}`,
    adminConfig: {
        defaultColumns: 'userId, refreshToken, createdAt',
    },
});

// === Chat History List ===
keystone.createList('ChatHistory', {
    fields: {
        userId: { type: Relationship, ref: 'User' },
        messages: { type: Text },
        createdAt: { type: DateTimeUtc },
        updatedAt: { type: DateTimeUtc },
    },
    labelResolver: item => `Chat of ${item.userId?.email || 'Unknown'}`,
    adminConfig: {
        defaultColumns: 'userId, messages, createdAt, updatedAt',
    },
});

module.exports = {
    keystone,
    apps: [
        new GraphQLApp(),
        new AdminUIApp({
            name: "ThreeBears Admin",
            enableDefaultRoute: true,
            adminPath: "/admin",
            authStrategy,
            signoutPath: "/admin/signout",
            isAccessAllowed: ({ authentication: { item: user } }) => {
                return !!user && user.admin === true;
            },
        }),
    ],
};