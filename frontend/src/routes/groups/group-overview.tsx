import { Title, Text } from "@mantine/core";
import Balance from "../balance/balance";
import { useParams } from "react-router-dom";
import { dummyGroups } from "../../utils/data/data";
import GroupCode from "../../features/Group/GroupCode";
import { useGetGroupDetail } from "../../api/Groups/useGetGroupDetails";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const GroupOverview = () => {
    const { id } = useParams<{ id: string }>();

    const { data, status } = useGetGroupDetail(id || "");

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
