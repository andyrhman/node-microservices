import { Router } from "express";
import { AuthMiddleware } from "./middleware/auth.middleware";

const routes = (router: Router) => {
    // * Ambassador
    // router.post('/api/ambassador/register', Register);
    // router.post('/api/ambassador/login', Login);
    // router.get('/api/ambassador/user', AuthMiddleware, AuthenticatedUser);
    // router.post('/api/ambassador/logout', AuthMiddleware, Logout);
    // router.put('/api/ambassador/users/info', AuthMiddleware, UpdateInfo);
    // router.put('/api/ambassador/users/password', AuthMiddleware, UpdatePassword);
    // router.get('/api/ambassador/products/frontend', ProductsFrontend);
    // router.get('/api/ambassador/products/backend', ProductsBackend);
    // router.post('/api/ambassador/links', AuthMiddleware, CreateLink);
    // router.get('/api/ambassador/stats', AuthMiddleware, Stats);
    // router.get('/api/ambassador/rankings', AuthMiddleware, Rankings);
}

export default routes;