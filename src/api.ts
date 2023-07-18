import { Project, Version } from "./base_structs";

export const getProjectVersion = async (
  projectName: string,
  projectVersion: number
) => {
  let res = await fetch(
    `https://getpipeline-kk2bzka6nq-uc.a.run.app/?projectName=${projectName}&version=${projectVersion}`
  );
  let resJson = (await res.json()) as { project: Project; version: Version };
  return {
    project: resJson.project as Project,
    version: resJson.version as Version,
  };
};
