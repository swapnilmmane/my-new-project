import { CmsModelFieldToStoragePlugin } from "@webiny/api-headless-cms/types";
import cryptr from 'cryptr';

export default (): CmsModelFieldToStoragePlugin<String> => ({
    type: "cms-model-field-to-storage",
    name: "cms-model-field-to-storage-address",
    fieldType: "secret-text",
    async toStorage({ value }) {
        const encryptText = new cryptr('myTotalySecretKey').encrypt(value)
        return {
            value: encryptText
        };
    },
    async fromStorage({ value }) {
        return value.value
        // return new cryptr('myTotalySecretKey').decrypt(value.value)
    }
});
