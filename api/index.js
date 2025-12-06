import app from "../index";
import serverless from "serverless-http";

export default async function handler(req, res) {
  return serverless(app)(req, res);
}
