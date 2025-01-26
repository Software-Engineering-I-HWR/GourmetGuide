import crypto from 'crypto';
import configData from '../../../config/config.json';

const {encryption_key} = require('../../../config/encryption-secret.json')

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface UserOld {
    email: string;
    password: string;
}

interface User {
    user: string;
    password: string;
}

const hostData: Config = configData;
const algorithm = 'aes-256-cbc';
const ivLength = 16;

const encryptPassword = (password: string): string => {
    if (!encryption_key || encryption_key.length !== 32) {
        throw new Error('Encryption key must be 32 characters long');
    }

    const iv = crypto.createHash('sha256').update(password).digest().slice(0, ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryption_key), iv);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

export const addUser = async (email: string, password: string) => {
    try {
        const encryptedPassword = encryptPassword(password);
        const postData: UserOld = { email, password: encryptedPassword };
        const response: Response = await fetch('http://' + hostData.host + ':3006/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const result: string = await response.text();
            console.log('API Antwort:', result);
            return 200;
        } else {
            console.error('Fehler bei der API-Anfrage:', response.status);
            return response.status;
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        return 401;
    }
};

export const changePassword = async (user: string, password: string) => {
    try {
        const encryptedPassword = encryptPassword(password);
        const postData: User = { user, password: encryptedPassword };
        const response: Response = await fetch('http://' + hostData.host + ':3006/updatePasswordByUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const result: string = await response.text();
            console.log('API Antwort:', result);
            return 200;
        } else {
            console.error('Fehler bei der API-Anfrage:', response.status);
            return response.status;
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        return 401;
    }
};

export const findUserByEmail = async (email: string): Promise<UserOld | undefined> => {
    try {
        const response: Response = await fetch(`http://` + hostData.host + `:3006/getUserByEmail?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });

        if (response.ok) {
            const result = await response.json();
            console.log('API Antwort:', result);

            return {
                email: result.Username,
                password: result.Password
            };
        } else {
            console.error('Fehler bei der API-Anfrage:', response.status);
            return undefined;
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        return undefined;
    }
};
