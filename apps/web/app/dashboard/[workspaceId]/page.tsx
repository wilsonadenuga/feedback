import { ProjectsTable } from "./_components/projects-table";

import projects from "./projects.json";

export default function Page() {
  return <ProjectsTable data={projects} />;
}
