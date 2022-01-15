import { authRefresh, authSignin } from "./auth";

describe("Auth API service", () => {
    let refreshToken: string | null = null;

    it("Should send back a user and its auth token", async () => {
        const result = await authSignin("test", "test");
        expect(result).toHaveProperty("access_token");
        expect(result).toHaveProperty("refresh_token");
        refreshToken = result.refresh_token;
        expect(result).toHaveProperty("user");
        expect(result.user).toHaveProperty("id");
        expect(result.user).toHaveProperty("username");
    });

    it("Should send back a user and its refreshed auth token", async () => {
        if (refreshToken != null) {
            const result = await authRefresh(refreshToken);
            expect(result).toHaveProperty("access_token");
            expect(result).toHaveProperty("refresh_token");
            expect(result).toHaveProperty("user");
            expect(result.user).toHaveProperty("id");
            expect(result.user).toHaveProperty("username");
        } else {
            fail("No refresh token found to test!");
        }
    });
});