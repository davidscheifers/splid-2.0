import { useEffect, useState } from "react";

import { useQueryParams } from "../useQueryParams";

export function useJoinGroup() {
    const [code, setCode] = useState("");
    const query = useQueryParams();

    useEffect(() => {
        const urlCode = query.get("code");

        if (urlCode) {
            setCode(urlCode);
        }
    }, [query]);

    function handleSubmit() {
        console.log("Join group with code" + code);
        // navigate to group page
    }

    return { handleSubmit, code, setCode };
}
