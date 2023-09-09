import { useState } from "react";
import { UserAddButtonState } from "../../../components/UserAddButton/UserAddButton";

export function useAddMember(addMember: (item: any) => void) {
    const [state, setState] = useState<UserAddButtonState>({
        modalOpen: false,
        memberName: "",
    });

    function handleSubmit() {
        addMember({ name: state.memberName });
        setState({ ...state, modalOpen: false, memberName: "" });
    }

    return { state, setState, handleSubmit };
}
