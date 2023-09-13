import { Button, Group, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import { useGetAllQuery } from "@/api/GenericCalls/useGetAllQuery";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";
import GroupTeaser from "@/features/Group/GroupTeaser";
import { apiEndPoints } from "@/utils/constants/constants";
import { useFilterData } from "@/utils/hooks/useFilterData";

const Groups = () => {
    const { data, status } = useGetAllQuery({
        url: apiEndPoints.user.getGroupsFromUser("admin"),
        invalidationProperty: "groups",
    });

    const { searchQuery, setSearchQuery, filteredData } = useFilterData(
        data || [],
        "name"
    );

    console.log(data);

    return (
        <LoadingComponent status={status}>
            <Group position="apart" mb="lg">
                <Title>Gruppen</Title>
                <Group>
                    <Link to="/groups/join">
                        <Button variant="default">Gruppe beitreten</Button>
                    </Link>
                    <Link to="/groups/create">
                        <Button variant="default">Gruppe erstellen</Button>
                    </Link>
                </Group>
            </Group>
            <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                mb="md"
                placeholder="Gruppen suchen"
                icon={<IconSearch size={20} />}
            />
            {filteredData.map((group) => {
                return <GroupTeaser key={group.id} group={group} />;
            })}
        </LoadingComponent>
    );
};
export default Groups;
