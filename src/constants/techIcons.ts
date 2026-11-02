import icons from "../assets/icons.svg";
import catalog from "../assets/technologies.json";

interface Technology {
  label: string;
  icon?: string | null;
}

const technologies: Readonly<Record<string, Technology | undefined>> = catalog;

export function getTechnology(name: string) {
  const technology = technologies[name];
  return {
    label: technology?.label ?? name,
    icon: technology?.icon ? `${icons}#${technology.icon}` : undefined,
  };
}
