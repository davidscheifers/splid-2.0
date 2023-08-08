import { Title } from "@mantine/core";
import Balance from "../balance/balance";
import { useParams } from "react-router-dom";
import { dummyGroups } from "../../utils/data/data";
import GroupCode from "../../features/Group/GroupCode";

const GroupOverview = () => {
    const { id } = useParams<{ id: string }>();

    const group = dummyGroups.find((group) => group.id === parseInt(id || ""));

    return (
        <div>
            <Title mb="md" order={1}>
                {group?.name}
            </Title>
            <Balance groudId={group?.id || -1} />
            <GroupCode group={group} />
        </div>
    );
};
export default GroupOverview;
