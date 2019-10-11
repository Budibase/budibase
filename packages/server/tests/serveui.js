const statusCodes = require("../utilities/statusCodes");
const { readFile, writeFile, remove } = require("fs-extra");

module.exports = (app) => {

    it("should serve unauthenticated index.html as default", async () => {
        const response = await app.get("/testApp")
                            .expect(statusCodes.OK);

        const expectedIndexHtml = await readFile("appPackages/testApp/public/unauthenticated/index.html", "utf8");

        expect(response.text).toBe(expectedIndexHtml);
        
    });

    it("should serve specified files when unauthenticated", async () => {
        const response = await app.get("/testApp/app.js")
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/unauthenticated/app.js", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });

    it("should serve main index.html as default when authenticated", async () => {
        const response = await app.get("/testApp")
                            .set("cookie", app.credentials.testAppUser1.cookie)
                            .expect(statusCodes.OK);

        const expectedIndexHtml = await readFile("appPackages/testApp/public/main/index.html", "utf8");

        expect(response.text).toBe(expectedIndexHtml);
        
    });

    it("should serve specified files when authenticated", async () => {
        const response = await app.get("/testApp/budibase-client.js")
                            .set("cookie", app.credentials.testAppUser1.cookie)
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/main/budibase-client.js", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });


    it("should serve file from shared when authenticated", async () => {
        const response = await app.get("/testApp/_shared/shared_file.txt")
                            .set("cookie", app.credentials.testAppUser1.cookie)
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/_shared/shared_file.txt", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });

    it("should serve file from shared when not authenticated", async () => {
        const response = await app.get("/testApp/_shared/shared_file.txt")
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/_shared/shared_file.txt", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });

    it("should serve file from latest when instance is versionless", async () => {

        try {
            await writeFile("appPackages/testApp/public/_shared/new_file_for_versionless_test.txt", "thats right", {encoding:"utf8"});
        } catch(err) {
            // empty
        }

        try {
            await app.get("/testApp/_shared/new_file_for_versionless_test.txt")
            .set("cookie", app.credentials.user1_versionlessInstance.cookie)
            .expect(statusCodes.OK);
        } finally {
            try {
                await remove("appPackages/testApp/public/_shared/new_file_for_versionless_test.txt");
            } catch(err) {
                // empty
            }
        }
        
    });


    it("should not serve file from latest when instance has version", async () => {

        try {
            await writeFile("appPackages/testApp/public/_shared/new_file_for_versionless_test.txt", "thats right", {encoding:"utf8"});
        } catch(err) {
            // empty
        }

        try {
            await app.get("/testApp/_shared/new_file_for_versionless_test.txt")
            .set("cookie", app.credentials.testAppUser1.cookie)
            .expect(statusCodes.NOT_FOUND);
        } finally {
            try {
                await remove("appPackages/testApp/public/_shared/new_file_for_versionless_test.txt");
            } catch(err) {
                // empty
            }
        }
        
    });


}