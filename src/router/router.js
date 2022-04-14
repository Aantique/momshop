import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            },
            {
                path: "/product",
                name: "product",
                meta: {
                    title: '商品列表'
                },
                component: () => import ( /* webpackChunkName: "product" */ "../views/ProductList.vue")
            },
            {
                path: "/updateProduct",
                name: "updateProduct",
                meta: {
                    title: '商品更新'
                },
                component: () => import ( /* webpackChunkName: "updateProduct" */ "../views/UpdateProduct.vue")
            },
            {
                path: "/add",
                name: "add",
                meta: {
                    title: '商品添加'
                },
                component: () => import ( /* webpackChunkName: "add" */ "../views/AddProduct.vue")
            },
            {
                path: "/category",
                name: "category",
                meta: {
                    title: '商品分类'
                },
                component: () => import ( /* webpackChunkName: "category" */ "../views/Category.vue")
            },
            {
                path: "/order",
                name: "order",
                meta: {
                    title: '订单列表'
                },
                component: () => import ( /* webpackChunkName: "order" */ "../views/Order.vue")
            },

        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    },
    {path: '/404', component: () => import('../views/404.vue'), hidden: true},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

/*router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} `;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});*/

export default router;
