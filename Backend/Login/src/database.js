"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.addUser = void 0;
const addUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postData = { email, password };
        const response = yield fetch('http://canoob.de:3007/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        if (response.ok) {
            const result = yield response.text();
            console.log('API Antwort:', result);
        }
        else {
            console.error('Fehler bei der API-Anfrage:', response.status);
        }
    }
    catch (error) {
        console.error('Netzwerkfehler:', error);
    }
});
exports.addUser = addUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`http://canoob.de:3007/getUserByEmail?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });
        if (response.ok) {
            const result = yield response.json();
            console.log('API Antwort:', result);
            const user = {
                email: result.Username,
                password: result.Password
            };
            return user;
        }
        else {
            console.error('Fehler bei der API-Anfrage:', response.status);
            return undefined;
        }
    }
    catch (error) {
        console.error('Netzwerkfehler:', error);
        return undefined;
    }
});
exports.findUserByEmail = findUserByEmail;
