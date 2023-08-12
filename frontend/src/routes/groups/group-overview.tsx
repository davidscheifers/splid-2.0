import { Title, Text } from "@mantine/core";
import Balance from "../balance/balance";
import { useParams } from "react-router-dom";
import { dummyGroups } from "../../utils/data/data";
import GroupCode from "../../features/Group/GroupCode";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import { apiEndPoints } from "../../utils/constants/constants";

const GroupOverview = () => {
    const { id } = useParams<{ id: string }>();

    const { data, status } = useGetOneQuery({
        url: apiEndPoints.group.getGroup(id || ""),
        id: id || "",
        invalidationProperty: "group",
    });

    const group = dummyGroups.find((group) => group.id === parseInt(id || ""));

    console.log(data);

    return (
        <LoadingComponent status={status}>
            <Title order={1}>{data?.name}</Title>
            <Text mb="md">{data?.description}</Text>
            <Balance groudId={group?.id || -1} />
            <GroupCode group={group} />
        </LoadingComponent>
    );
};
export default GroupOverview;
