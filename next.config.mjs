/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Serve the Decap CMS admin page (public/admin/index.html) at /admin.
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
