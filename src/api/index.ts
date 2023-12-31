import { Project, Version } from "../base_structs/index.js";
//const endpoint = "https://getpipeline-45t36rx6eq-uc.a.run.app"; //"https://getpipeline-kk2bzka6nq-uc.a.run.app/";
const endpoint = "https://getpipeline-kk2bzka6nq-uc.a.run.app/";
export const getProjectVersion = async (
  projectName: string,
  projectVersion: number,
  apiKey: string
) => {
  let res = await fetch(
    `${endpoint}?projectName=${projectName}&version=${projectVersion}&apiKey=${apiKey}`
  );
  let resJson = (await res.json()) as { project: Project; version: Version };
  return {
    project: resJson.project as Project,
    version: resJson.version as Version,
  };
};
