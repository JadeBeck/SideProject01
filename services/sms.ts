import "dotenv/config";
import * as axios from "axios";
import CryptoJS from "crypto-js";
const Cache = require('memory-cache');
import SmsRepository from "../repositories/sms.js";
import {Error} from "../interfaces/Error";

const SENS_SERVICE_ID: string = process.env.SENS_SERVICE_ID as string;
const SENS_SERVICE_ACCESS_KEY: string = process.env.SENS_SERVICE_ACCESS_KEY as string;
const SENS_SERVICE_SECRET_KEY: string = process.env.SENS_SERVICE_SECRET_KEY as string;
const SENS_MY_NUM: string = process.env.SENS_MY_NUM as string;

class SmsService {
    smsRepository = new SmsRepository();

    //문자 전송
    send = async (phoneNumber) => {
        const date = Date.now().toString();
        const uri = SENS_SERVICE_ID
        const secretKey = SENS_SERVICE_SECRET_KEY
        const accessKey = SENS_SERVICE_ACCESS_KEY
        const method = 'POST';
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
        const url2 = `/sms/v2/services/${uri}/messages`;

        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);

        const hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);
        const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

        Cache.del(phoneNumber);
        Cache.put(phoneNumber, verifyCode.toString());

        const findPhone = await this.smsRepository.findPhone(phoneNumber)
        if (findPhone) {
            const err: Error = new Error(`SmsService Error`);
            err.status = 999;
            err.message = "아이디는 핸드폰 번호당 1개만 사용가능합니다.";
            throw err;
        }

        await this.smsRepository.UpdateCode(phoneNumber, verifyCode);

        axios({
            method: method,
            json: true,
            url: url,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': accessKey,
                'x-ncp-apigw-timestamp': date,
                'x-ncp-apigw-signature-v2': signature,
            },
            data: {
                type: 'SMS',
                contentType: 'COMM',
                countryCode: '82',
                from: SENS_MY_NUM,
                content: `[Board With] 인증번호 [${verifyCode}]를 입력해주세요.`,
                messages: [
                    {
                        to: `${phoneNumber}`,
                    },
                ],
            }
        }).then(function (res) {
            console.log('response', res.data, res['data']);
            return verifyCode;
        })
            .catch((err) => {
                if (err.res == undefined) {
                    return verifyCode;
                }
            })
        return verifyCode;
    };

    //회원가입 시 인증번호 확인
    verify = async (phoneNumber, verifyCode) => {
        const CacheData = Cache.get(phoneNumber);
        if (CacheData !== verifyCode) {
            const err = new Error(`SmsService Error`);
            err.status = 401;
            err.message = "인증번호가 틀렸습니다.";
            throw err;
        } else {
            Cache.del(phoneNumber);
            return 'success';
        }
    };

    //아이디 찾을 때 인증번호 전송하기
    sendID = async (phoneNumber) => {
        const date = Date.now().toString();
        const uri = SENS_SERVICE_ID
        const secretKey = SENS_SERVICE_SECRET_KEY
        const accessKey = SENS_SERVICE_ACCESS_KEY
        const method = 'POST';
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
        const url2 = `/sms/v2/services/${uri}/messages`;

        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);

        const hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);

        const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

        const findPhone = await this.smsRepository.findPhone(phoneNumber)
        if (!findPhone) {
            const err = new Error(`SmsService Error`);
            err.status = 401;
            err.message = "일치하는 핸드폰 번호가 없습니다.";
            throw err;
        }

        await this.smsRepository.UpdateCode(phoneNumber, verifyCode);

        axios({
            method: method,
            json: true,
            url: url,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': accessKey,
                'x-ncp-apigw-timestamp': date,
                'x-ncp-apigw-signature-v2': signature,
            },
            data: {
                type: 'SMS',
                contentType: 'COMM',
                countryCode: '82',
                from: SENS_MY_NUM,
                content: `[Board With] 인증번호 [${verifyCode}]를 입력해주세요.`,
                messages: [
                    {
                        to: `${phoneNumber}`,
                    },
                ],
            }
        }).then(function (res) {
            console.log('response', res.data, res['data']);
            return verifyCode;
        })
            .catch((err) => {
                if (err.res == undefined) {
                    return verifyCode;
                }
            })
        return verifyCode;
    }

    //아이디 찾을 때 받은 인증번호 확인
    verifyID = async (phoneNumber, verifyCode) => {
        const findValue = await this.smsRepository.findValue(phoneNumber, verifyCode);
        if (!findValue) {
            const err = new Error(`SmsService Error`);
            err.status = 401;
            err.message = "인증번호가 틀렸습니다.";
            throw err;
        } else if (findValue.verifyCode !== verifyCode) {
            const err = new Error(`SmsService Error`);
            err.status = 401;
            err.message = "인증번호가 틀렸습니다.";
            throw err;
        } else {
            return findValue.userId;
        }
    };

    //비밀번호 찾을 때 인증번호 전송하기
    sendPW = async (phoneNumber, userId) => {
        const date = Date.now().toString();
        const uri = SENS_SERVICE_ID
        const secretKey = SENS_SERVICE_SECRET_KEY
        const accessKey = SENS_SERVICE_ACCESS_KEY
        const method = 'POST';
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
        const url2 = `/sms/v2/services/${uri}/messages`;

        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);

        const hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);

        const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

        const findPass = await this.smsRepository.findPass(phoneNumber, userId)
        if (!findPass) {
            const err = new Error(`SmsService Error`);
            err.status = 401;
            err.message = "핸드폰 번호 혹은 아이디가 일치하지 않습니다.";
            throw err;
        }

        await this.smsRepository.UpdateCode(phoneNumber, verifyCode);

        axios({
            method: method,
            json: true,
            url: url,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': accessKey,
                'x-ncp-apigw-timestamp': date,
                'x-ncp-apigw-signature-v2': signature,
            },
            data: {
                type: 'SMS',
                contentType: 'COMM',
                countryCode: '82',
                from: SENS_MY_NUM,
                content: `[Board With] 인증번호 [${verifyCode}]를 입력해주세요.`,
                messages: [
                    {
                        to: `${phoneNumber}`,
                    },
                ],
            }
        }).then(function (res) {
            console.log('response', res.data, res['data']);
            return verifyCode;
        })
            .catch((err) => {
                if (err.res == undefined) {
                    return verifyCode;
                }
            })
        return verifyCode;
    };
}

export default SmsService;