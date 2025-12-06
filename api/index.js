import app from "../server.js";
import serverless from "serverless-http";

export default async function handler(req, res) {
  return serverless(app)(req, res);
}
