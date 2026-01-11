import React from "react";
import "./styles.scss";

type HighlightCardProps = {
  title: string;
  number: number;
  icon: React.ReactNode;
};

const HighlightCard: React.FC<HighlightCardProps> = ({ title, number, icon }) => {
  return (
    <div className="highlight-card">
      <div className="highlight-card__content">
        <h3 className="highlight-card__title">{title}</h3>
        <div className="highlight-card__number">{number}</div>
      </div>
      <div className="highlight-card__icon">
        {icon}
      </div>
    </div>
  );
};

export default HighlightCard;

