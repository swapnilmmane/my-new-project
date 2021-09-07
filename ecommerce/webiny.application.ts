export default {
    id: "eCommerce",
    name: "ECommerce",
    description: "E-Commerce Application",
    cli: {
        // Default args for the "yarn webiny watch ..." command (we don't need deploy option while developing).
        watch: {
            deploy: false
        }
    }
};
