import Calls from "./index";
import { render, screen } from "../../setupTests";

describe("Calls component", () => {
    it("Should render without crashing", async () => {
        render(<Calls />);

        // Just check that everything is in place, thorough tests are done on each component individually
        const titleElement = await screen.findByRole("heading", { name: /history|appels/i });
        const callsSummaryItemsElement = await screen.findByTestId("calls-summary-items");
        const callsPagination = await screen.findByTestId("calls-pagination");

        expect(titleElement).toBeInTheDocument();
        expect(callsSummaryItemsElement).toBeInTheDocument();
        expect(callsPagination).toBeInTheDocument();
    });
});