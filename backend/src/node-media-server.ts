const NodeMediaServer = require('node-media-server');
import { config } from "./config/config";

export const nms = new NodeMediaServer(config);

nms.on('prePublish', async (id: any, StreamPath: string, args: any) => {
    console.log("lll");
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});
 
const getStreamKeyFromStreamPath = (path: string) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};