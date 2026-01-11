import React from "react";
import HighlightCard from "../HighlightCard/HighlightCard";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import "./styles.scss";

type HighlightsSectionProps = {
  upcomingCount: number;
  historyCount: number;
  familyMembersCount: number;
};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  upcomingCount,
  historyCount,
  familyMembersCount,
}) => {
  return (
    <div className="highlights-section">
      <HighlightCard
        title="Upcoming Visits"
        number={upcomingCount}
        icon={<CalendarMonthIcon />}
      />
      <HighlightCard
        title="History Events"
        number={historyCount}
        icon={<HistoryIcon />}
      />
      <HighlightCard
        title="Family Members"
        number={familyMembersCount}
        icon={<PeopleIcon />}
      />
    </div>
  );
};

export default HighlightsSection;

