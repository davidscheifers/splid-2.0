import { Link } from "react-router-dom";
import GroupTeaser from "../componentes/Group/GroupTeaser";
import { dummyGroups } from "../utils/utils";

const Groups = () => {
    return (
        <div>
            <h2>Groups</h2>
            <Link to="/groups/create">Create Group</Link>
            {dummyGroups.map((group) => {
                return <GroupTeaser key={group.id} group={group} />;
            })}
        </div>
    );
};
export default Groups;
