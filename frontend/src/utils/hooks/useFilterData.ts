import { useMemo, useState } from "react";
import { filterDatasetByStringName } from "../functions/functions";

// while in dev mode use dummy data
export function useFilterData(data: any[], key: string) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(
        () => filterDatasetByStringName(data, key, searchQuery),
        [searchQuery, data]
    );

    return { filteredData, setSearchQuery, searchQuery };
}
