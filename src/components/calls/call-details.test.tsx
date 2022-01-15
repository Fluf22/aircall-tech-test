import { waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { humanReadableDuration } from "../../helpers";
import { Call } from "../../interfaces";
import { render, screen } from "../../setupTests";
import CallDetails from "./call-details";

describe("CallDetails dialog component", () => {
    const call: Call = {
        "id": "a3060487-6f8a-4825-b8db-4472139b8c9b",
        "duration": 35697,
        "is_archived": false,
        "from": "+33127629405",
        "to": "+33183714463",
        "direction": "inbound",
        "call_type": "voicemail",
        "via": "+33176926742",
        "created_at": "2022-01-12T11:26:42.130Z",
        "notes": [
            {
                "id": "ee49e5c9-aabc-4578-8cd9-37e0ac99ac87",
                "content": "Et nostrum dolores est perspiciatis harum deleniti."
            }
        ]
    };

    it("Should render without crashing", async () => {
        render(<CallDetails call={call} />);

        // Check that, initially, there is only the dialog opening button rendered
        const openDialogButtonElement = await screen.findByTestId("open-call-details-dialog");
        const dialogElement = screen.queryByTestId("call-details-dialog");

        expect(openDialogButtonElement).toBeInTheDocument();
        expect(dialogElement).not.toBeInTheDocument();
    });

    it("Should open a dialog with all the call details", async () => {
        render(<CallDetails call={call} />);

        const openDialogButtonElement = await screen.findByTestId("open-call-details-dialog");

        // On clicking the dialog opening button
        userEvent.click(openDialogButtonElement);

        // Check that the dialog is rendered in the scene
        const dialogElement = await screen.findByTestId("call-details-dialog");
        expect(dialogElement).toBeInTheDocument();

        // And that every data bit of the call object is rendered as well
        const closeButtonElement = await screen.findByRole("button", { name: /close/i });
        const titleElement = await screen.findByRole("heading", { name: /appel|call/i });
        const archiveTriggerButtonElement = await screen.findByTestId("call-details-archive-call-button");
        const idElement = await screen.findByTestId("call-details-id");
        const durationElement = await screen.findByTestId("call-details-duration");
        const isArchivedElement = await screen.findByTestId("call-details-is-archived");
        const fromElement = await screen.findByTestId("call-details-from");
        const toElement = await screen.findByTestId("call-details-to");
        const directionElement = await screen.findByTestId("call-details-direction");
        const callTypeElement = await screen.findByTestId("call-details-call-type");
        const viaElement = await screen.findByTestId("call-details-via");
        const createdAtElement = await screen.findByTestId("call-details-created-at");
        const noteElements = await screen.findAllByTestId(/^call-details-note-[0-9]+$/i);

        // With formatted text where it's needed
        expect(closeButtonElement).toBeInTheDocument();
        expect(titleElement).toBeInTheDocument();
        expect(archiveTriggerButtonElement).toBeInTheDocument();
        expect(idElement).toHaveTextContent(call.id);
        expect(durationElement).toHaveTextContent(humanReadableDuration(call.duration));
        expect(isArchivedElement).toBeInTheDocument();
        expect(fromElement).toHaveTextContent(call.from);
        expect(toElement).toHaveTextContent(call.to);
        expect(directionElement).toBeInTheDocument();
        expect(callTypeElement).toBeInTheDocument();
        expect(viaElement).toHaveTextContent(call.via);
        expect(createdAtElement).toHaveTextContent((new Date(call.created_at)).toLocaleString());

        // Also, check that there are as many note text area rendered as there are note nodes in the initial call object
        expect(noteElements.length).toBe(call.notes.length);
        noteElements.forEach((noteElement, idx) => {
            // And that their respective contents match
            expect(noteElement).toHaveTextContent(call.notes[idx].content);
        });
    });

    it("Should handle note taking", async () => {
        render(<CallDetails call={call} />);

        const openDialogButtonElement = await screen.findByTestId("open-call-details-dialog");
        expect(openDialogButtonElement).toBeInTheDocument();
        
        userEvent.click(openDialogButtonElement);

        // Check that the add note button is rendered with the dialog
        const addButtonElement = await screen.findByTestId("add-note-button");
        expect(addButtonElement).toBeInTheDocument();

        userEvent.click(addButtonElement);

        // On clicking the button, an empty text area should render with a send note disabled button
        // Eventually, if the call isn't already archived, a second disabled should be rendered
        // to give the user the ability to send the note then archive the call
        const addNoteInput = await screen.findByTestId("add-note-input");
        const sendNoteButton = await screen.findByTestId("send-note-button");
        const sendNoteAndArchiveButton = await screen.findByTestId("send-note-and-archive-button");

        expect(addNoteInput).toBeInTheDocument();
        expect(sendNoteButton).toBeInTheDocument();
        expect(sendNoteAndArchiveButton).toBeInTheDocument();
        expect(addNoteInput).toHaveTextContent("");
        expect(sendNoteButton).toBeDisabled();
        expect(sendNoteAndArchiveButton).toBeDisabled();

        // Typing something in the text area should make the two buttons clickable
        // See the isInvalidText function associated tests to understand how it works
        userEvent.type(addNoteInput, "Test.");
        expect(addNoteInput).toHaveTextContent("Test.");
        expect(sendNoteButton).not.toBeDisabled();
        expect(sendNoteAndArchiveButton).not.toBeDisabled();
    });
});