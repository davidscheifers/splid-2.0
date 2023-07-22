import { Link } from "react-router-dom";
import { TDummyGroup } from "../../types/group";

type GroupTeaserProps = {
    group: TDummyGroup;
};

const GroupTeaser = ({ group }: GroupTeaserProps) => {
    return (
        <Link to={`/groups/${group.id}`}>
            <h3>{group.name}</h3>
        </Link>
    );
};
export default GroupTeaser;
