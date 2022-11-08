module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@controllers": ["./src/controllers"],
          "@middlewares": ["./src/middlewares"],
          "@models": ["./src/models"],
        },
      },
    ],
    "babel-plugin-trasform-typescript-metadata", 
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properites", { loose: true }], 

  ]
}