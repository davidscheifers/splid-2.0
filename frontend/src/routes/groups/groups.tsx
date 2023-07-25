import { Link } from "react-router-dom";
import { Button, Group, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import GroupTeaser from "../../features/Group/GroupTeaser";
import { filterDatasetByStringName } from "../../utils/functions/functions";
import { dummyGroups } from "../../utils/data/data";

const Groups = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = filterDatasetByStringName(
        dummyGroups,
        "name",
        searchQuery
    );

    return (
        <>
            <Group position="apart" mb="lg">
                <Title>Groups</Title>
                <Link to="/groups/create">
                    <Button variant="default">Create Group</Button>
                </Link>
            </Group>
            <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                mb="md"
                placeholder="Search Groups"
                icon={<IconSearch size={20} />}
            />
            {filteredGroups.map((group) => {
                return <GroupTeaser key={group.id} group={group} />;
            })}
        </>
    );
};
export default Groups;
