/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
  : "";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS && repoName ? repoName : ""),
};

export default nextConfig;
