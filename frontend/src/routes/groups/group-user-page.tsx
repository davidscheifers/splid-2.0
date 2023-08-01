import { useParams } from "react-router-dom";
import { dummyUsers } from "../../utils/data/data";

const GroupUserPage = () => {
    const { userId } = useParams<{ userId: string }>();

    const user = dummyUsers.find((user) => user.id === parseInt(userId || ""));

    return (
        <div>
            <p>GroupUserPage for user {user?.name}</p>
        </div>
    );
};
export default GroupUserPage;
