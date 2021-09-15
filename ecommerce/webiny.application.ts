export default {
    id: "ecommerce",
    name: "ecommerce",
    description: "Serverless E-Commerce",
    cli: {
        // Default args for the "yarn webiny watch ..." command (we don't need deploy option while developing).
        watch: {
            deploy: false
        }
    }
};
