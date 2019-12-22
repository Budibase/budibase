import {setupApphierarchy,
    basicAppHierarchyCreator_WithFields} from "./specHelpers";
import {Readable} from "readable-stream";


const getFile = () => {
    const contentString = "hello";
    var bytes = []; // char codes

    for (let i = 0; i < contentString.length; ++i) {
        const code = contentString.charCodeAt(i);    
        bytes = bytes.concat([code & 0xff, code / 256 >>> 0]);
    } 

    const s = new Readable();
    s._read = () => {
        s.push(Buffer.from(bytes));
        s.push(null);
    }; 

    return ({
        file: {relativePath:"thefile.txt", size:bytes.length},
        content: bytes,
        stream: s
    });
}



describe("recordApi > files", () => {
 
    it("upload should fail when files size does not equal stream size", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const {file, stream, content} = getFile();
        file.size = file.size - 1;
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.profilepic = file;
        await recordApi.save(record);
        expect(recordApi.uploadFile(record.key, stream, file.relativePath)).rejects.toThrow();
    });

    it("upload should fail when record does not exist", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const {file, stream, content} = getFile();
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.profilepic = file;
        await recordApi.save(record);
        expect(recordApi.uploadFile("does nto exist", stream, file.relativePath)).rejects.toThrow();
    });

    it("download should get an uploaded file", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const {file, stream, content} = getFile();
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.profilepic = file;
        await recordApi.save(record);
        await recordApi.uploadFile(record.key, stream, file.relativePath);
        const downloadedStream = await recordApi.downloadFile(record.key, file.relativePath);
        const downloadedBytes = downloadedStream.read();
        for(let i=0; i<downloadedBytes.length; i++) {
            expect(downloadedBytes[i]).toEqual(content[i]);
        }
    });
    
    it("upload should fail when filename contains invalid characters", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const {file, stream, content} = getFile();
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.profilepic = file;
        await recordApi.save(record);
        let ex;
        try {
            await recordApi.uploadFile(record.key, stream, "some:file.txt");
        } catch (e) {
            ex = e;
        }
        expect(ex).not.toBeNull();
    });


    it("upload should fail when path contains '..' ", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const {file, stream, content} = getFile();
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "Ledog";
        record.profilepic = file;
        await recordApi.save(record);
        expect(recordApi.uploadFile(record.key, stream, "../somefile.txt")).rejects.toThrow();
    });
    
});