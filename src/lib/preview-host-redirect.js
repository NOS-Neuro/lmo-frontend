export function getPreviewHostRedirect(environment) {
  const vercelEnv = String(environment.VERCEL_ENV || "");
  const deploymentHost = String(environment.VERCEL_URL || "");
  const branchHost = String(environment.VERCEL_BRANCH_URL || "");

  if (
    vercelEnv !== "preview" ||
    !deploymentHost ||
    !branchHost ||
    deploymentHost === branchHost
  ) {
    return null;
  }

  return { deploymentHost, branchHost };
}
