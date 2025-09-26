"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = void 0;
exports.initializeFirebase = initializeFirebase;
exports.getCollectionName = getCollectionName;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
let cachedServices = null;
/**
 * Initializes the shared Firebase services. The config should be read from a
 * platform-specific `.env` file (see extension/.env.example and mobile/.env.example).
 * This method is idempotent and will reuse the existing Firebase app instance
 * when called multiple times across workspaces.
 */
function initializeFirebase(config) {
    if (!cachedServices) {
        if (!config.apiKey) {
            throw new Error('Missing Firebase configuration. Ensure .env values are set.');
        }
        const app = (0, app_1.getApps)().length > 0 ? (0, app_1.getApps)()[0] : (0, app_1.initializeApp)(config);
        cachedServices = {
            app,
            auth: (0, auth_1.getAuth)(app),
            db: (0, firestore_1.getFirestore)(app)
        };
    }
    return cachedServices;
}
exports.COLLECTIONS = {
    TASKS: 'tasks',
    NOTES: 'notes',
    USERS: 'users'
};
function getCollectionName(collection) {
    return collection;
}

module.exports = {
    initializeFirebase,
    getCollectionName,
    COLLECTIONS
};
