import { Router } from "express";
import { registerMiddleWareLocal, loginMiddleWareLocal, postRegisterController, postLoginController, githubAuthenticateMiddleWare, githubCallbackMiddleWare, getGitHubCallbackController, getFailRegisterController, getFailLoginController, getFailGHController, getDummyFunction } from "../controllers/sessions.controller.js";
const router = Router();

//POST
router.post("/register", registerMiddleWareLocal, postRegisterController);
router.post("/login", loginMiddleWareLocal, postLoginController);

//GET
router.get ("/github", githubAuthenticateMiddleWare, getDummyFunction);
router.get ("/githubcallback", githubCallbackMiddleWare, getGitHubCallbackController);
router.get("/fail-register", getFailRegisterController);
router.get("/fail-login", getFailLoginController);
router.get("/fail-gh", getFailGHController);

export default router;