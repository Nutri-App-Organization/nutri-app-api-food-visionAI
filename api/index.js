/* import app from "../index.js";
import serverless from "serverless-http";

export default async function handler(req, res) {
  return serverless(app)(req, res);
}
 */

import app from "../index.js";
import serverless from "serverless-http";

const handler = serverless(app);
export default handler;
