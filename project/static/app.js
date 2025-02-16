// import Vue from 'vue';

import store from './store.js';

import Home from './components/Home.JS'
import LoginUser from './components/LoginUser.JS'
import SignUp from './components/SignUp.JS'
import Admin from './components/Admin.JS'
import Navbar from './components/Navbar.JS'
import Basket from './components/Basket.JS'
import All_categories from './components/All_categories.JS'
import Pending_req from './components/Pending_req.JS'
import All_sman from './components/All_sman.JS'
import S_man from './components/S_man.JS'
import All_products from './components/All_products.JS'
import Searched_prod from './components/Searched_prod.JS';
import Gen_ser from './components/Gen_ser.JS';
import My_ord from './components/My_ord.JS';

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/', component: Navbar, name: 'navbar' },
    { path: '/basket', component: Basket, name: 'basket' },
    { path: '/signup', component: SignUp, name: 'signup' },
    { path: '/loginUser', component: LoginUser, name: 'loginUser' },
    { path: '/admin', component: Admin, name: 'admin' },
    { path: '/all_categories', component: All_categories, name: 'all_categories' },
    { path: '/pending_req', component: Pending_req, name: 'pending_req' },
    { path: '/all_sman', component: All_sman, name: 'all_sman' },
    { path: '/s_man', component: S_man, name: 's_man' },
    { path: '/all_products', component: All_products, name: 'all_products' },    
    { path: '/ser_p', component: Searched_prod, name: 'ser_p' },    
    { path: '/gen_ser', component: Gen_ser, name: 'gen_ser' },    
    { path: '/my_ord', component: My_ord, name: 'my_ord' },    
]

const router = new VueRouter({
    routes,
    base: '/',
})

router.beforeEach((to, from, next) => {
    if ((to.name !== 'loginUser' && to.name !== 'signup' && to.name !== 'home' && to.name !== 'gen_ser') && !localStorage.getItem('auth-token')) {
        localStorage.clear();
        next({ name: 'loginUser' });
    } else {
        next();
    }
});


new Vue({
    el: '#app',
    template: `<div>
    <Navbar :key='has_changed'/>
    <router-view></router-view>
    </div>`,
    router,
    store,
    components: {
        Home,
        Navbar,
    },
    data: {
        has_changed: true,
    },
    watch: {
        $route(to, from) {
            this.has_changed = !this.has_changed
        },
    },
})