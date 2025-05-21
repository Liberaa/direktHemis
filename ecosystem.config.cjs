module.exports = {
    apps: [
        {
            name: "DirektHem", // Name of your application, can be anything
            script: "server.js", // Path to your main application file
            env: {
                NODE_ENV: "production", // Set the environment to production (should always be set to production when deploying publicly)
                PORT: 3001, // Set the port to 3000 (or whatever port your application uses)
                BASE_URL: "/", // Set the base URL
                SESSION_NAME: "direkthem",
                SESSION_SECRET: "this-is-a-super-secret-key"
            },
        },
    ],
}