import { Router } from 'express';

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
    console.log(data.products)
    res.render('products', {
        products: data.products
    });
})

router.get("/addProduct", privateAccess, async (req, res) => {
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

export default router;