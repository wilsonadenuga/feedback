import { ProjectsTable } from "./_components/projects-table";

import projects from "./projects.json";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <ProjectsTable data={projects} />
    </div>
  );
}
