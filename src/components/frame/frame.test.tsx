import { render, screen } from "@testing-library/react";
import Frame from "./index";

const FrameWithChild = () => {
    return (
        <Frame>
            <h1>Frame Child</h1>
        </Frame>
    );
};

describe("Frame component", () => {
    it("Should render with its child without crashing", () => {
        render(<FrameWithChild />);

        expect(screen.getByRole("heading", { name: /frame child/i })).toBeInTheDocument();
    });
});