import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { cartModel } from '../dao/models/cart.model.js';
import { adminPass } from '../utils.js';

const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/');
    next();
}

export const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    res.render('register');
})

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
})

router.get('/', privateAccess, async (req, res) => {
    console.log(req.session.user);
    res.render('profile', {
        user: req.session.user
    });
});

router.get("/products", privateAccess, async (req, res) => {
    const response = await fetch('http://localhost:8080/api/products');
    const data = await response.json();
    res.render('products', {
        products: data.products
    });
})

router.get("/addproduct", privateAccess, async (req, res) => {
    res.render("createProduct")
})

router.get("/sendrecoveremail", async (req, res) => {
    res.render("sendRecoverEmail")
})

router.get("/loggerTest", async (req, res) => {
    req.logger.debug('Mensaje de depuración');
    req.logger.info('Mensaje informativo');
    req.logger.warning('Mensaje de advertencia');
    req.logger.error('Mensaje de error');
    req.logger.fatal('Mensaje de error fatal');

    res.send('Logs enviados. Verifica la consola o el archivo de registro.');
})

router.get("/mycart", async (req, res) => {
    let emailUser = req.session.user.email;
    let userFind = await userModel.findOne({ email: emailUser });

    if (!userFind) {
        return res.status(403).send("No se encontró el usuario");
    }

    const cart = userFind.cart

    const response = await fetch(`http://localhost:8080/api/carts/${cart}`);
    const data = await response.json();

    res.render("myCart", { products: data.products })
})

router.get("/purchases", async (req, res) => {
    let emailUser = req.session.user.email;
    let userFind = await userModel.findOne({ email: emailUser });

    if (!userFind) {
        return res.status(403).send("No se encontró el usuario");
    }

    const userId = userFind._id

    const response = await fetch(`http://localhost:8080/api/tickets/${userId}`);
    const data = await response.json();

    res.render("purchases", { tickets: data.tickets })
})

router.get("/admin", adminPass, async (req, res) => {
    const response = await fetch(`http://localhost:8080/api/users/`);
    const data = await response.json();

    res.render("admin", { users: data.users })
})

router.get("/payment", async (req, res) => {
    res.render("payment")
})

export default router;