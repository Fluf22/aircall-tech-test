import userEvent from "@testing-library/user-event";
import { render, screen } from "../../setupTests";
import Login from "./index";

describe("Login component", () => {
    const goToHoneypot = jest.fn();
    const goToRequiredPage = jest.fn();
    const mockOnSubmitLogin = () => {
        const formData = new FormData(document.querySelector("form") as HTMLFormElement);
        const honeypot = formData.get("honeypot");
        if (honeypot === "") {
            // Should trigger navigation to the required page
            goToRequiredPage();
        } else {
            // Should do nothing, like with a bot
            goToHoneypot();
        }
    };

    it("Should render without crashing", async () => {
        render(<Login />);

        // Let's check that all the components are in place
        const loginFormElement = await screen.findByTestId("login-form");
        const honeypotElement = await screen.findByRole("textbox", { name: /honeypot/i });
        const usernameElement = await screen.findByRole("textbox", { name: /username/i });
        const passwordElement = await screen.findByTestId("password-input");
        const submitButtonElement = await screen.findByRole("button", { name: /submit/i });
        const usernameHelperTextElement = await screen.findByTestId("username-helper-text");
        const passwordHelperTextElement = await screen.findByTestId("password-helper-text");

        expect(loginFormElement).toBeInTheDocument();
        expect(honeypotElement).toBeInTheDocument();
        expect(usernameElement).toBeInTheDocument();
        expect(passwordElement).toBeInTheDocument();
        expect(submitButtonElement).toBeInTheDocument();

        // And that the input helper texts don't have their error class on
        expect(usernameHelperTextElement).not.toHaveClass("Mui-error");
        expect(passwordHelperTextElement).not.toHaveClass("Mui-error");
    });

    it("Should not allow to login when form is not filled", async () => {
        render(<Login />);

        const submitButtonElement = await screen.findByRole("button", { name: /submit/i });

        expect(await screen.findByTestId("username-helper-text")).not.toHaveClass("Mui-error");
        expect(await screen.findByTestId("password-helper-text")).not.toHaveClass("Mui-error");

        // When the inputs are empty, after a click on the submit button...
        userEvent.click(submitButtonElement);

        // ... input helper texts should have error classes
        expect(await screen.findByTestId("username-helper-text")).toHaveClass("Mui-error");
        expect(await screen.findByTestId("password-helper-text")).toHaveClass("Mui-error");
    });

    it("Should not allow to login when username is not filled", async () => {
        render(<Login />);

        const usernameElement = await screen.findByRole("textbox", { name: /username/i });
        const passwordElement = await screen.findByTestId("password-input");
        const submitButtonElement = await screen.findByRole("button", { name: /submit/i });

        expect(await screen.findByTestId("username-helper-text")).not.toHaveClass("Mui-error");
        expect(await screen.findByTestId("password-helper-text")).not.toHaveClass("Mui-error");

        // If we fill only the password input...
        userEvent.type(passwordElement, "test");

        expect(usernameElement).toHaveValue("");
        expect(passwordElement).toHaveValue("test");

        // ... and we click on the submit button...
        userEvent.click(submitButtonElement);

        // ... the username input helper text should have an error class
        expect(await screen.findByTestId("username-helper-text")).toHaveClass("Mui-error");
        expect(await screen.findByTestId("password-helper-text")).not.toHaveClass("Mui-error");
    });

    it("Should not allow to login when password is not filled", async () => {
        render(<Login />);

        const usernameElement = await screen.findByRole("textbox", { name: /username/i });
        const passwordElement = await screen.findByTestId("password-input");
        const submitButtonElement = await screen.findByRole("button", { name: /submit/i });

        expect(await screen.findByTestId("username-helper-text")).not.toHaveClass("Mui-error");
        expect(await screen.findByTestId("password-helper-text")).not.toHaveClass("Mui-error");

        // If we fill only the password input...
        userEvent.type(usernameElement, "test");

        expect(usernameElement).toHaveValue("test");
        expect(passwordElement).toHaveValue("");

        // ... and we click on the submit button...
        userEvent.click(submitButtonElement);

        // ... the password input helper text should have an error class
        expect(await screen.findByTestId("username-helper-text")).not.toHaveClass("Mui-error");
        expect(await screen.findByTestId("password-helper-text")).toHaveClass("Mui-error");
    });

    it("Should not allow to login when honeypot is filled", async () => {
        render(<Login />);

        const loginFormElement = await screen.findByTestId("login-form");
        const honeypotElement = await screen.findByRole("textbox", { name: /honeypot/i });
        const usernameElement = await screen.findByRole("textbox", { name: /username/i });
        const passwordElement = await screen.findByTestId("password-input");
        const submitButtonElement = await screen.findByRole("button", { name: /submit/i });

        loginFormElement.onsubmit = mockOnSubmitLogin;

        // If the honeypot is filled by a bot
        userEvent.type(honeypotElement, "test");
        userEvent.type(usernameElement, "test");
        userEvent.type(passwordElement, "test");

        expect(honeypotElement).toHaveValue("test");
        expect(usernameElement).toHaveValue("test");
        expect(passwordElement).toHaveValue("test");

        userEvent.click(submitButtonElement);

        // We souldn't call the auth signin endpoint as we sould do nothing
        expect(goToHoneypot).toHaveBeenCalledTimes(1);
        expect(goToRequiredPage).toHaveBeenCalledTimes(0);
    });

    it("Should allow to login when form is filled", async () => {
        render(<Login />);

        const loginFormElement = await screen.findByTestId("login-form");
        const usernameElement = await screen.findByRole("textbox", { name: /username/i });
        const passwordElement = await screen.findByTestId("password-input");
        const submitButtonElement = await screen.findByRole("button", { name: /submit/i });

        loginFormElement.onsubmit = mockOnSubmitLogin;

        // If we fill the form correctly
        userEvent.type(usernameElement, "test");
        userEvent.type(passwordElement, "test");

        expect(usernameElement).toHaveValue("test");
        expect(passwordElement).toHaveValue("test");

        userEvent.click(submitButtonElement);

        // We sould call the auth signin endpoint
        expect(goToHoneypot).toHaveBeenCalledTimes(0);
        expect(goToRequiredPage).toHaveBeenCalledTimes(1);
    });
});