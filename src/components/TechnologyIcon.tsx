import { getTechnology } from "../constants/techIcons";

export default function TechnologyIcon({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  const technology = getTechnology(name);
  if (!technology.icon) return <span>{technology.label}</span>;

  return (
    <svg className={className} aria-hidden="true">
      <use href={technology.icon} />
    </svg>
  );
}
