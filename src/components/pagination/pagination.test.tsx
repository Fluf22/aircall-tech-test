import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ITEMS_PER_PAGE } from "../../helpers";
import Pagination from "./index";

describe("Pagination component", () => {
    const handlePageUpdate = jest.fn();

    it("Should render without crashing", async () => {
        render(<Pagination total={ITEMS_PER_PAGE * 2} handlePageUpdate={handlePageUpdate} />);

        expect(screen.getByLabelText("previous page")).toBeInTheDocument();
        expect(screen.getByLabelText("current page")).toBeInTheDocument();
        expect(screen.getByLabelText("next page")).toBeInTheDocument();

        expect(screen.getByLabelText("current page")).toHaveValue("1");
    });

    it("Should execute update function to move through the pages", async () => {
        // Beginning with a pagination component handling 50 elements, so 5 pages of 10 items
        render(<Pagination total={ITEMS_PER_PAGE * 5} handlePageUpdate={handlePageUpdate} />);

        // Clicking on previous will do nothing since the button is disabled on page 1
        fireEvent.click(screen.getByLabelText("previous page"));
        expect(handlePageUpdate).toHaveBeenCalledTimes(1);
        expect(screen.getByLabelText("current page")).toHaveValue("1");

        // Clicking on next will send us to the second page
        fireEvent.click(screen.getByLabelText("next page"));
        expect(handlePageUpdate).toHaveBeenCalledTimes(2);
        expect(screen.getByLabelText("current page")).toHaveValue("2");

        // Typing 7 in the input will just change the visible input value and set it to 27
        userEvent.type(screen.getByLabelText("current page"), "7");
        expect(handlePageUpdate).toHaveBeenCalledTimes(2);
        expect(screen.getByLabelText("current page")).toHaveValue("27");

        // Typing [Enter] will validate the page change and try to send us to the 27th page
        userEvent.type(screen.getByLabelText("current page"), "[Enter]");
        expect(handlePageUpdate).toHaveBeenCalledTimes(3);

        // But since the max page is 5, we will go there instead
        expect(screen.getByLabelText("current page")).toHaveValue("5");

        // Finally, clicking on the previous button from here will leave us on the 4th page
        fireEvent.click(screen.getByLabelText("previous page"));
        expect(handlePageUpdate).toHaveBeenCalledTimes(4);
        expect(screen.getByLabelText("current page")).toHaveValue("4");
    });
});