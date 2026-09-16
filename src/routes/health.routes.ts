import { type Request, type Response, Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);
  res.status(200).json({ message: "ok" });
});

export default healthRouter;
