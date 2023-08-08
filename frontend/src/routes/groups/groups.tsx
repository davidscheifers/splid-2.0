import { Button, Group, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import GroupTeaser from "../../features/Group/GroupTeaser";

import { dummyGroups } from "../../utils/data/data";
import { useFilterData } from "../../utils/hooks/useFilterData";
import { useGetGroups } from "../../api/Groups/useGetGroups";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const Groups = () => {
    const { t } = useTranslation();

    const { data, status } = useGetGroups();

    const { searchQuery, setSearchQuery, filteredData } = useFilterData(
        dummyGroups,
        "name"
    );

    console.log(data);

    return (
        <LoadingComponent status={status}>
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
            {filteredData.map((group) => {
                return <GroupTeaser key={group.id} group={group} />;
            })}
        </LoadingComponent>
    );
};
export default Groups;
