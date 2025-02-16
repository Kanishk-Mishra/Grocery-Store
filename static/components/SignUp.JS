export default{
    template:`<body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; min-height: 100vh;">
            
                <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            {{message}}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast2" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            {{message}}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
    
            <h2 style="text-align: center; margin-top: 30px;">Signup</h2>
            <div v-show='flag==0'>
                <p style="color:red; padding-top: 10px; padding-bottom: 0px;">{{message}}</p>
            </div>
            <form action="/api/signup" method="post" style="margin: 20px auto; width: 300px; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
                <label for="username" style="display: block; margin-bottom: 10px; text-align: left;">Username</label>
                <input type="text" id="username" placeholder = "username" name="username" required v-model="cred.username" style="display: block; width: 100%; padding: 10px; margin-bottom: 20px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc;">
                <label for="email" style="display: block; margin-bottom: 10px; text-align: left;">Email</label>
                <input type="email" id="email" placeholder = "user@email.com" autocomplete="email" name="email" required v-model="cred.email" style="display: block; width: 100%; padding: 10px; margin-bottom: 20px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc;">
                <label for="password" style="display: block; margin-bottom: 10px; text-align: left;">Password</label>
                <input type="password" id="password" placeholder = "password" name="password" required v-model="cred.password" style="display: block; width: 100%; padding: 10px; margin-bottom: 20px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc;">    
                
                <label style="display: block; margin-bottom: 10px; text-align: left;">Signup as:</label>
                <input type="radio" name="role" value="s_man" v-model="cred.role" style= "margin-bottom: 20px; margin-right: 3px; text-align: left;" >Manager<input type="radio" name="role" value="user" checked v-model="cred.role" style= "margin-bottom: 20px; margin-right: 3px; margin-left: 5px; text-align: left;" >User            
                
                <button @click.prevent="signupUser" style="display: block; width: 100%; padding: 10px; font-size: 18px; color: #fff; background-color: #007bff; border: none; border-radius: 5px; cursor: pointer;" onmouseover="this.style.backgroundColor='#0069d9'" onmouseout="this.style.backgroundColor='#007bff'">SignUp</button>
            
            </form>
            <p>Already have an account<router-link to="/loginUser"> Login</router-link></p>
            <div class="footer" style="background-color: #808080; color: #fff; padding: 10px 20px; text-align: center; width: 100%; position: fixed; bottom: 0;">
                &copy; 2023 GroceryStore. All rights reserved.
            </div>
        </body>`,
    data (){
        return{
            cred:{
                username: '',
                email:'',
                password: '',
                role:'user',
            },
            message: '',
            flag: 1,
        }
    },
    
    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.removeItem('noti');
        next();
    },
    
    methods: {
        async signupUser(){
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(emailRegex.test(this.cred.email)){
                var res = await fetch('/api/signup',{
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.cred),
                })
                var data = await res.json()
                if (res.status == 400){
                    this.flag = 0;
                    this.message = data.message;
                }
                else if (res.status == 500){
                    this.flag =0;
                    this.message = data.message
                }
                else if (res.ok){                    
                    if(this.cred.role == 's_man'){
                        this.message = `Manager access request sent. After admin's approval you will be able to login.`
                        const liveToast = new bootstrap.Toast(document.getElementById('liveToast2'));
                        liveToast.show();             
                    }
                    else if(this.cred.role == 'user'){
                        this.message = `Signup successful! You'll be redirected to login.`
                        const liveToast = new bootstrap.Toast(document.getElementById('liveToast2'));
                        liveToast.show();                        
                        setTimeout(() => {
                            this.$router.push('/loginUser');
                        }, 2000);                                                
                    }
                }
            }
            else{
                this.flag =0;
                this.message = 'Please enter a valid email address'
            }
        },
    },
}