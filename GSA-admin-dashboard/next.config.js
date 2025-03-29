// next.config.js
module.exports = {
    images: {
      loader:"default",
      remotePatterns: [
        {
          protocol: "https",
          hostname: "example.com",
          port: "",         // or undefined
          pathname: "/**",
        },
        // add other hostnames if necessary
      ],
      domains: ['res.cloudinary.com'],
    },
  };
  