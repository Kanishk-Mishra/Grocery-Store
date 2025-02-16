export default{
    template:`<body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; min-height: 100vh;">
            <h2 style="text-align: center; margin-top: 30px;">Login</h2>
            <div v-show='flag==0'>
                <p style="color:red; padding-top: 10px; padding-bottom: 0px;">{{message}}</p>
            </div>
            <form action="/login" method="post" style="margin: 20px auto; width: 300px; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
                <label for="email" style="display: block; margin-bottom: 10px; text-align: left;">Email</label>
                <input type="email" id="email" placeholder = "user@email.com" autocomplete="email" name="email" required v-model="cred.email" style="display: block; width: 100%; padding: 10px; margin-bottom: 20px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc;">
                
                <label for="password" style="display: block; margin-bottom: 10px;text-align: left;">Password</label>
                <input type="password" id="password" placeholder = "password" name="password" required v-model="cred.password" style="display: block; width: 100%; padding: 10px; margin-bottom: 20px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc;">                

                <label style="display: block; margin-bottom: 10px; text-align: left;">Login as:</label>
                <input type="radio" id="adminRole" name="role" value="admin" v-model="role" style="margin-bottom: 20px; margin-right: 3px; text-align: left;"><label for="adminRole">Admin</label>
                <input type="radio" id="managerRole" name="role" value="s_man" v-model="role" style="margin-bottom: 20px; margin-right: 3px; margin-left: 5px; text-align: left;"><label for="managerRole">Manager</label>
                <input type="radio" id="userRole" name="role" value="user" checked v-model="role" style="margin-bottom: 20px; margin-right: 3px; margin-left: 5px; text-align: left;"><label for="userRole">User</label>
                
                <button @click.prevent="loginUser" style="display: block; width: 100%; padding: 10px; font-size: 18px; color: #fff; background-color: #007bff; border: none; border-radius: 5px; cursor: pointer;" onmouseover="this.style.backgroundColor='#0069d9'" onmouseout="this.style.backgroundColor='#007bff'">Login</button>
            
            </form>
            <p>Create a new account<router-link to="/signup"> SignUp</router-link></p>
            <div class="footer" style="background-color: #808080; color: #fff; padding: 10px 20px; text-align: center; width: 100%; position: fixed; bottom: 0;">
                &copy; 2023 GroceryStore. All rights reserved.
            </div>
        </body>`,
    data (){
        return{
            cred:{
                username: '',
                password: '',
            },
            message: '',
            flag:1,
            role:'user',
        }
    },
    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.removeItem('noti');
        next();
    },
    
    methods: {
            async loginUser(){
            var res = await fetch('/login?include_auth_token',{
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })

            if (res.ok){
                const data = await res.json()
                localStorage.setItem('auth-token', data.response.user.authentication_token)
                localStorage.setItem('role', this.role)
                if(this.role == 'admin'){this.$router.push('/admin')}
                else if(this.role == 's_man'){this.$router.push('/s_man')}
                else if(this.role == 'user'){this.$router.push('/')}
            }
            else{
                this.flag=0;
                this.message = 'Wrong Credentials';
            }
        },
    },
}