import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { TDummyUser } from "../../types/group";
import UserAddButton from "./UserAddButton";

// window.matchmedia error workaround (https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function)
window.matchMedia =
    window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: function () {},
            removeListener: function () {},
        };
    };

function Wrapper() {
    const [members, setMembers] = useState<TDummyUser[]>([]);

    return <UserAddButton setMembers={setMembers} members={members} />;
}

describe("User Add Button", () => {
    it("renders default state", () => {
        render(<Wrapper />);

        expect(
            screen.getByText(/Start to add a Member to your group/i)
        ).toBeDefined();
    });

    it("Opens modal", () => {
        const { getByText } = render(<Wrapper />);

        const addButton = getByText(/Add Member/i);

        fireEvent.click(addButton);

        const input = screen.getByPlaceholderText(/Enter Member Name/i);

        expect(input).toBeDefined();
    });

    it("adds without inserting name", () => {
        const { getByText, getByRole } = render(<Wrapper />);

        const addButton = getByText(/Add Member/i);

        fireEvent.click(addButton);

        const addMemberButton = getByRole("button", { name: /Add/i });

        fireEvent.click(addMemberButton);

        expect(addMemberButton).toBeDefined();
    });

    it("adds member", () => {
        const { getByText, getByRole } = render(<Wrapper />);

        const addButton = getByText(/Add Member/i);

        fireEvent.click(addButton);

        const input = screen.getByPlaceholderText(/Enter Member Name/i);

        fireEvent.change(input, { target: { value: "Member 1" } });

        const addMemberButton = getByRole("button", { name: /Add/i });

        fireEvent.click(addMemberButton);

        expect(screen.getByText(/Member 1/i)).toBeDefined();
    });

    it("removes member", () => {
        const { getByText, getByRole } = render(<Wrapper />);

        const addButton = getByText(/Add Member/i);

        fireEvent.click(addButton);

        const input = screen.getByPlaceholderText(/Enter Member Name/i);

        fireEvent.change(input, { target: { value: "Member 1" } });

        const addMemberButton = getByRole("button", { name: /Add/i });

        fireEvent.click(addMemberButton);

        const removeButton = getByRole("button", { name: /Remove/i });

        fireEvent.click(removeButton);

        expect(
            screen.getByText(/Start to add a Member to your group/i)
        ).toBeDefined();
    });
});
