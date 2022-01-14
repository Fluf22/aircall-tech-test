import { authSignin, fetchCalls, triggerArchiveStatus } from "./index";
import { AuthResponse, Call, GetCallsResponse } from "../interfaces";

describe("Calls API service", () => {
    let auth: AuthResponse | null = null;
    let call: Call | null = null;

    beforeAll(async () => {
        auth = await authSignin("test", "test");
    });

    it("Should send back a list of calls with the total count of nodes in DB and a boolean describing the existence of a next page", async () => {
        if (auth != null) {
            const result: GetCallsResponse = await fetchCalls(auth.access_token);
            expect(result).toHaveProperty("nodes");
            if (result.nodes.length > 0) {
                call = result.nodes[0];
            } else {
                fail("No call found for test!");
            }
            expect(result).toHaveProperty("hasNextPage");
            expect(result).toHaveProperty("totalCount");
        } else {
            fail("No auth data found for test!");
        }
    });

    it("Should trigger the archive status on an existing call", async () => {
        if (auth != null && call != null) {
            const result: Call = await triggerArchiveStatus(auth.access_token, call.id);
            expect(result).toHaveProperty("is_archived");
            expect(result.is_archived).toBe(!call.is_archived);
        } else {
            fail("No auth data or callId found for test!");
        }
    });

    afterAll(() => {
        auth = null;
        call = null;
    });
});