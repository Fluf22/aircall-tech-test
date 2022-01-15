import LanguageSelector from "./index";
import { render, screen } from "../../setupTests";
import userEvent from "@testing-library/user-event";

describe("LanguageSelector component", () => {
    it("Should render without crashing", async () => {
        render(<LanguageSelector />);

        const selectElement = await screen.findByTestId("language-selector");

        expect(selectElement).toBeInTheDocument();
    });

    it("Should change the language", async () => {
        render(<LanguageSelector />);

        const selectElement: HTMLSelectElement = await screen.findByTestId("language-selector");

        userEvent.selectOptions(selectElement, "fr");

        const selectedFrLang = selectElement.options[selectElement.selectedIndex].label;
        expect(selectedFrLang).toBe("Français");

        userEvent.selectOptions(selectElement, "en");

        const selectedEnLang = selectElement.options[selectElement.selectedIndex].label;
        expect(selectedEnLang).toBe("English");
    });
});