import { Router } from "express";
import {ProductModel} from "../../models/productModel.js";
import passport from "passport";
/* import { authToken } from "../../utils.js"; */




const router = Router();

router.get("/login", /* authToken,  */(req, res) => {
    res.render('login')
});

router.get("/register", (req, res) => {
    res.render('register')
});



// Cuando ya tenemos una session activa con los datos del user, renderizamos la vista profile
router.get("/", passport.authenticate('jwt', { session: true}), async (req, res) => {
    let page = parseInt(req.query.page);
    /* const userObject = {
        name: req.user,
        email: req.user.email,
        role: req.user.role,
    }  */ 
        if (!page) page = 1;
        let result = await ProductModel.paginate({}, {page, lean: true })
        let prevLink = result.hasPrevPage ? `http://localhost:8080/users?page=${result.prevPage}` : '';
        let nextLink = result.hasNextPage ? `http://localhost:8080/users?page=${result.nextPage}` : '';
        let isValid = !(result.page <= 0 || result.page > result.totalPages)

        res.render('profile', {user: req.user /* userObject */ ,  result, prevLink, nextLink, isValid })
});

export default router;