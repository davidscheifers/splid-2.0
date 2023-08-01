import { Link } from "react-router-dom";
import { Button, Group, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import GroupTeaser from "../../features/Group/GroupTeaser";
import { filterDatasetByStringName } from "../../utils/functions/functions";
import { dummyGroups } from "../../utils/data/data";
import { useTranslation } from "react-i18next";

const Groups = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = useMemo(
        () => filterDatasetByStringName(dummyGroups, "name", searchQuery),
        [searchQuery, dummyGroups]
    );

    return (
        <>
            <Group position="apart" mb="lg">
                <Title>{t("groups.title")}</Title>
                <Group>
                    <Link to="/groups/join">
                        <Button variant="default">Join Group</Button>
                    </Link>
                    <Link to="/groups/create">
                        <Button variant="default">Create Group</Button>
                    </Link>
                </Group>
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
