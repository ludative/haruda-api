module.exports = {
  apps: [
    {
      name: "haruda-api",
      script: "./src/app.js",
      watch: true,
      node_args: '-r esm',
      "env_public-develop": {
        NODE_ENV: "public-develop",
        PORT: 18080,
      },
      // env_production: {
      //   NODE_ENV: "production",
      //   PORT: ,
      // }
    }
  ]
};