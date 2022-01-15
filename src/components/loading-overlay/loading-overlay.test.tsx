import { render } from "@testing-library/react";
import LoadingOverlay from "./index";

describe("LoadingOverlay component", () => {
    it("Should render without crashing", () => {
        expect(() => render(<LoadingOverlay />)).not.toThrow();
    });
});