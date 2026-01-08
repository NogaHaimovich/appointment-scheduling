import AddIcon from "@mui/icons-material/Add";
import "./styles.scss";

type AddFamilyMemberCardProps = {
    onClick: () => void;
};

const AddFamilyMemberCard = ({ onClick }: AddFamilyMemberCardProps) => {
    return (
        <div className="add_family_member_box" onClick={onClick}>
            <div className="add_family_member_card">
                <div className="add_family_member_icon">
                    <AddIcon />
                </div>
                <h3 className="add_family_member_title">Add Family Member</h3>
                <p className="add_family_member_description">
                    Register a child, spouse or parent to manage their care.
                </p>
            </div>
        </div>
    );
};

export default AddFamilyMemberCard;

