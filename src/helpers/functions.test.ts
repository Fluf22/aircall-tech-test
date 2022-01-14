import { humanReadableDuration, isSameDay, isTokenExpired, parseJSON } from '.';
import { TokenRefreshInterval } from '../interfaces';
import { checkStatus } from './functions';

describe('Check request response status', () => {
    it('Should send back the response', () => {
        const response = new Response(undefined, { status: 200, statusText: '200' });
        const check = checkStatus(response);
        expect(check).toMatchObject(response);
    });
    it('Should throw on error', () => {
        const response = new Response(undefined, { status: 500, statusText: '500' });
        const throwingCheck = () => {
            checkStatus(response);
        };
        expect(throwingCheck).toThrowError("HTTP Error 500");
    });
});

describe('Response parsing as JSON', () => {
    it('Should parse the response body as JSON', async () => {
        const body = { test: "random" };
        const bodyStr = JSON.stringify(body);
        const response = new Response(bodyStr);
        const result = await parseJSON(response);
        expect(result).toMatchObject(body);
    });
});

// An access token is considered expired 5 minutes before its expiry date (to trigger a token refresh with the server)
// A refresh token is considered expired on its expiry date (to let the maximum amount of time to the user before redirecting him to the login page)
describe('Check token expiration', () => {
    const now = new Date();
    const mockToken = (exp: number) => {
        const payload = { exp: exp / 1000 };
        const payloadStr = JSON.stringify(payload);
        const encodedPayload = btoa(payloadStr);
        return `fakeHeader.${encodedPayload}.fakeSignature`;
    };

    it('Should be an expired access token', () => {
        const exp = now.getTime();
        const isExpired = isTokenExpired(mockToken(exp), TokenRefreshInterval.ACCESS);
        expect(isExpired).toBe(true);
    });

    it('Should be a valid access token', () => {
        const exp = new Date(now);
        exp.setMinutes(exp.getMinutes() + 10);
        const isExpired = isTokenExpired(mockToken(exp.getTime()), TokenRefreshInterval.ACCESS);
        expect(isExpired).toBe(false);
    });

    it('Should be an expired refresh token', () => {
        const exp = new Date(now);
        exp.setMinutes(exp.getMinutes() - 1);
        const isExpired = isTokenExpired(mockToken(exp.getTime()), TokenRefreshInterval.REFRESH);
        expect(isExpired).toBe(true);
    });

    it('Should be a valid refresh token', () => {
        const exp = new Date(now);
        exp.setMinutes(exp.getMinutes() + 1);
        const isExpired = isTokenExpired(mockToken(exp.getTime()), TokenRefreshInterval.REFRESH);
        expect(isExpired).toBe(false);
    });
});

describe('Same day check', () => {
    it('Should pass the same day test', () => {
        const now = new Date();
        const todayHours = now.getHours();
        const nowStr = now.toLocaleString();
        let other = new Date(now);
        if (todayHours > 4) {
            // If there is more than 4 hours passed in the day, do the test with different hours in the same day and different date format
            // Otherwise, just try with different string format
            other.setHours(todayHours - 4);
        }
        const sameDay = isSameDay(nowStr, other.toString());
        expect(sameDay).toBe(true);
    });

    it('Should not pass the same day test', () => {
        const now = new Date();
        const other = new Date();
        other.setHours(other.getHours() - 24);
        const sameDay = isSameDay(now.toString(), other.toString());
        expect(sameDay).toBe(false);
    });
});

describe('Seconds to human readable duration', () => {
    it('Should display 12:00:00', () => {
        const secondsQty: number = 60 * 60 * 12;
        const result = humanReadableDuration(secondsQty);
        expect(result).toBe("12:00:00");
    });

    it('Should display 00:00:07', () => {
        const secondsQty: number = 7;
        const result = humanReadableDuration(secondsQty);
        expect(result).toBe("00:00:07");
    });

    it('Should display 123:45:09', () => {
        const secondsQty: number = (60 * 60 * 123) + (60 * 45) + 9;
        const result = humanReadableDuration(secondsQty);
        expect(result).toBe("123:45:09");
    });
});