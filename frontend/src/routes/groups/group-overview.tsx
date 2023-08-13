import { Title, Text } from "@mantine/core";
import Balance from "../balance/balance";
import { useParams } from "react-router-dom";
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

    return (
        <LoadingComponent status={status}>
            <Title order={1}>{data?.name}</Title>
            <Text mb="md">{data?.description}</Text>
            <Balance groupId={data?.id} />
            <GroupCode
                group={{
                    id: id || "",
                    name: "Bella Italia",
                    currency: "EUR",
                    code: "A9L B85 QXQ",
                }}
            />
        </LoadingComponent>
    );
};
export default GroupOverview;
