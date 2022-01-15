import { render } from "../../setupTests";
import Router from "./router";

describe("Router component", () => {
    it("Should render without crashing", () => {
        expect(() => render(<Router />)).not.toThrow();
    });
});