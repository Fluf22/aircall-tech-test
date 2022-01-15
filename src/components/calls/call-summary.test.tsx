import { Call } from "../../interfaces";
import { render, screen } from "../../setupTests";
import CallSummary from "./call-summary";

// For each use case, check that the right icons are in place, with the right data, formatted if necessary, and eventually with specific style
describe("CallSummary component", () => {
    const archivedMissedInboundCall: Call = {
        "id": "a3060487-6f8a-4825-b8db-4472139b8c9b",
        "duration": 35697,
        "is_archived": true,
        "from": "+33127629405",
        "to": "+33183714463",
        "direction": "inbound",
        "call_type": "missed",
        "via": "+33176926742",
        "created_at": "2022-01-12T11:26:42.130Z",
        "notes": [
            {
                "id": "ee49e5c9-aabc-4578-8cd9-37e0ac99ac87",
                "content": "Et nostrum dolores est perspiciatis harum deleniti."
            }
        ]
    };
    const voicemailOutboundCall: Call = {
        "id": "a3060487-6f8a-4825-b8db-4472139b8c9b",
        "duration": 35697,
        "is_archived": false,
        "from": "+33127629405",
        "to": "+33183714463",
        "direction": "outbound",
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
    const archivedOutboundCall: Call = {
        "id": "a3060487-6f8a-4825-b8db-4472139b8c9b",
        "duration": 35697,
        "is_archived": true,
        "from": "+33127629405",
        "to": "+33183714463",
        "direction": "outbound",
        "call_type": "answered",
        "via": "+33176926742",
        "created_at": "2022-01-12T11:26:42.130Z",
        "notes": [
            {
                "id": "ee49e5c9-aabc-4578-8cd9-37e0ac99ac87",
                "content": "Et nostrum dolores est perspiciatis harum deleniti."
            }
        ]
    };

    it("Should render an archived missed inbound call without crashing", async () => {
        render(<CallSummary call={archivedMissedInboundCall} />);

        const receivedIconElement = await screen.findByTestId("call-summary-received-icon");
        const numberElement = await screen.findByTestId("call-summary-number");
        const missedIconElement = await screen.findByTestId("call-summary-missed-icon");
        const callDateTimeElement = await screen.findByTestId("call-summary-datetime");
        const archiveIconElement = await screen.findByTestId("call-summary-archive-icon");
        const openDialogButtonElement = await screen.findByTestId("open-call-details-dialog");
        expect(receivedIconElement).toBeInTheDocument();
        expect(numberElement).toBeInTheDocument();
        expect(numberElement).toHaveTextContent(archivedMissedInboundCall.from);
        expect(numberElement).toHaveStyle("color: red;");
        expect(missedIconElement).toBeInTheDocument();
        expect(callDateTimeElement).toBeInTheDocument();
        expect(callDateTimeElement).toHaveTextContent((new Date(archivedMissedInboundCall.created_at)).toLocaleString());
        expect(archiveIconElement).toBeInTheDocument();
        expect(openDialogButtonElement).toBeInTheDocument();
    });

    it("Should render a voicemail outbound call without crashing", async () => {
        render(<CallSummary call={voicemailOutboundCall} />);

        const madeIconElement = await screen.findByTestId("call-summary-made-icon");
        const numberElement = await screen.findByTestId("call-summary-number");
        const voicemailIconElement = await screen.findByTestId("call-summary-voicemail-icon");
        const openDialogButtonElement = await screen.findByTestId("open-call-details-dialog");
        expect(madeIconElement).toBeInTheDocument();
        expect(numberElement).toBeInTheDocument();
        expect(numberElement).toHaveTextContent(voicemailOutboundCall.to);
        expect(numberElement).not.toHaveStyle("color: red;");
        expect(voicemailIconElement).toBeInTheDocument();
        expect(openDialogButtonElement).toBeInTheDocument();
    });

    it("Should render an archived answered outbound call without crashing", async () => {
        render(<CallSummary call={archivedOutboundCall} />);

        const madeIconElement = await screen.findByTestId("call-summary-made-icon");
        const numberElement = await screen.findByTestId("call-summary-number");
        const answeredIconElement = await screen.findByTestId("call-summary-answered-icon");
        const archiveIconElement = await screen.findByTestId("call-summary-archive-icon");
        const openDialogButtonElement = await screen.findByTestId("open-call-details-dialog");
        expect(madeIconElement).toBeInTheDocument();
        expect(numberElement).toBeInTheDocument();
        expect(numberElement).toHaveTextContent(archivedOutboundCall.to);
        expect(numberElement).not.toHaveStyle("color: red;");
        expect(answeredIconElement).toBeInTheDocument();
        expect(archiveIconElement).toBeInTheDocument();
        expect(openDialogButtonElement).toBeInTheDocument();
    });
});