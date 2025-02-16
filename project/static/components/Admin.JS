export default{
    template:`<div>
            <body style="margin: 0px auto; font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; min-height: 100vh;max-width: 1550px;">
                <div v-show='flag==0'>
                    <p style="color:red; padding-top: 50px; padding-bottom: 0px;">{{message}}</p>

                    <p style="color:red; padding-top: 50px; padding-bottom: 0px;">{{error}}</p>

                </div>

                <div v-show='flag==1'>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-6">   
                                <div style="display: flex; align-items: center; margin-top: 20px;">
                                    <button style="border: none;" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                                        <img src="/static/menu_button.png" alt="Menu" style="border: none; width: 25px; height: 25px;">
                                    </button>
                                    <h3 style="margin-left: 10px;">Welcome, {{username}}!</h3>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Management</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div class="dropdown mt-3">
                            
                            <hr class="offcanvas-divider" style="margin-top: 0px; margin-bottom: 0px;">
                            <router-link to="/all_categories" style="display: block; width: 100%; padding-bottom: 10px;  padding-top: 10px; text-decoration: none; color: inherit; transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor= '#e4e4e4'" onmouseout="this.style.backgroundColor='rgba(0, 0, 0, 0)'">
                                <img src="/static/categories.png" alt="Menu" style="border: none; width: 25px; height: 25px;">
                                Categories
                            </router-link>
                        
                            <hr class="offcanvas-divider" style="margin-top: 0px; margin-bottom: 0px;">                        
                            <router-link to="/pending_req" style="display: block; width: 100%; padding-bottom: 10px; padding-top: 10px; text-decoration: none; color: inherit; transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor= '#e4e4e4'" onmouseout="this.style.backgroundColor='rgba(0, 0, 0, 0)'">
                                <img src="/static/pending-req.png" alt="Menu" style="border: none; width: 25px; height: 25px;">
                                Category Requests
                            </router-link>
                            
                            <hr class="offcanvas-divider" style="margin-top: 0px; margin-bottom: 0px;">
                            <router-link to="/all_sman" style="display: block; width: 100%; padding-bottom: 10px; padding-top: 10px; text-decoration: none; color: inherit; transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor= '#e4e4e4'" onmouseout="this.style.backgroundColor='rgba(0, 0, 0, 0)'">
                                <img src="/static/store_managers.png" alt="Menu" style="border: none; width: 25px; height: 25px;">
                                Managers
                            </router-link>
                            
                            <hr class="offcanvas-divider" style="margin-top: 0px; margin-bottom: 0px;">
                        </div>
                    </div>
                    </div>
                    
                    <p style="color:red;">{{error}}</p>

                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div v-for="k in sales">
                                    <div v-show="k[1] >= 10">
                                        <div class="progress"  style="margin-bottom: 2px;">
                                            <div class="progress-bar" role="progressbar" :style="{ width: k[1] + '%' }" :aria-valuenow="k[1]" aria-valuemin="0" aria-valuemax="100"></div>                                                                        
                                        </div>
                                        <p style="text-align: left; font-size: 10px; top-margin: 2px; margin-right: 5px; bottom-margin: 0px;">{{ k[0] }} {{ k[1] }}%</p>
                                    </div>
                                </div>
                                
                                <p class="text-muted" style="text-align: center; font-size: 13.5px; margin-top: 0px; bottom-margin: 30px;"><strong>POPULAR CATEGORIES</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="container" style="margin-top: 20px;">
                        <div class="row justify-content-center">
                            <div class="col-md-3 col-sm-6 mb-4">
                                <img src="/static/red.png" class="img-thumbnail rounded" alt="Image 1">
                            </div>
                            <div class="col-md-3 col-sm-6 mb-4">
                                <img src="/static/l_blue.png" class="img-thumbnail rounded" alt="Image 2">
                            </div>
                        </div>
                    </div>

                    <div class="container" style="padding-bottom: 50px">
                        <div class="row justify-content-center">
                            <div class="col-md-3 col-sm-6 mb-4">
                                <img src="/static/yellow.png" class="img-thumbnail rounded" alt="Image 1">
                            </div>
                            <div class="col-md-3 col-sm-6 mb-4">
                                <img src="/static/blue.png" class="img-thumbnail rounded" alt="Image 2">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer" style="background-color: #808080; color: #fff; padding: 10px 20px; text-align: center; width: 100%; position: fixed; bottom: 0;">
                    &copy; 2023 GroceryStore. All rights reserved.
                </div>
            </body>
        </div>`,

    data (){
        return{
            flag: 1,
            username: '',
            message:'',
            error: '',
            role: '',
            sales: [],
            keys: [],
        }
    },

    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.setItem('noti', 1);
        next();
    },
    
    beforeRouteLeave(to, from, next) {
        // Remove item from local storage when leaving the route
        localStorage.removeItem('noti');
        next();
    },

    async mounted(){
        // console.log(localStorage.getItem('auth-token'))
        const res = await fetch('/api/users',{
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        })
       
        if (res.ok){
            const data = await res.json()
            localStorage.setItem('role', data.r)
            if (data.r != 'admin'){
                this.flag = 0
                this.message = "You are not authorized. Kindly use Admin's credentials"
                // localStorage.clear()
            }
            this.username = data.username
        }
        else if (res.status == 500){
            this.flag = 0
            this.message = 'An error occured!'
        }
        else if (res.status == 403){
            alert("You are not authorized. Kindly re-login as a User/Manager or use Admin's credentials")
            localStorage.clear()
        }
        
        const response = await fetch('/api/graph',{
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        })
       
        if (response.ok){
            const data = await response.json()            
            this.keys = Object.keys(data)
            for(let key of this.keys){this.sales.push([key, data[key]])}
        }
        else if (response.status == 500){
            this.flag = 0
            this.message = 'An error occured!'
        }
        else if (response.status == 403){
            alert("You are not authorized. Kindly re-login as a User/Manager or use Admin's credentials")
            localStorage.clear()
        }
    },
}
