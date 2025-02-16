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
                            <router-link to="/all_products" style="display: block; width: 100%; padding-bottom: 10px; padding-top: 10px; text-decoration: none; color: inherit; transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor= '#e4e4e4'" onmouseout="this.style.backgroundColor='rgba(0, 0, 0, 0)'">
                                <img src="/static/product.png" alt="Menu" style="border: none; width: 25px; height: 25px;">
                                Products
                            </router-link>                
                            
                            <hr class="offcanvas-divider" style="margin-top: 0px; margin-bottom: 0px;">
                        </div>
                    </div>
                    </div>
                    
                    <p style="color:red;">{{error}}</p>

                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="accordion" id="accordionPanelsStayOpenExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            How to Manage Categories?
                                        </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
                                        <div class="accordion-body" style="text-align: left">
                                            <strong>Management of categories </strong>is a secondary role of a Store Manager. Being a primary job of an Admin, categories can also be requested by a Store Manager for <strong>Creation, Modification & Deletion.</strong> These requests are sent to the Admin's dashboard, which upon approval gets reflected on the server/view. However an Admin also holds the right to deny any creation, modification or deletion requests. Click on the menu button to access the 'Categories' section and start managing.  
                                        </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                            How to create a Product?
                                        </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
                                        <div class="accordion-body" style="text-align: left">
                                            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                            How to Manage & Update Products?
                                        </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse">
                                        <div class="accordion-body" style="text-align: left">
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <p v-if='isWaiting'>Downloading <span class="spinner-border text-primary" style="margin-top: 10px" role="status"></span><p>
                    <div class="container">
                        <div class="row justify-content-center" style="padding-top: 20px">
                            <div class="col-md-3 col-sm-6 mb-4">
                                <a href='#' @click="downlodResource"><img src="/static/down_res.jpg" class="img-thumbnail rounded" alt="Image 1"></a>
                            </div>
                            <div class="col-md-3 col-sm-6 mb-4">
                                <img src="/static/check_shifts.jpg" class="img-thumbnail rounded" alt="Image 2">
                            </div>
                        </div>
                        </div>

                        <div class="container" style="padding-bottom: 50px;">
                            <div class="row justify-content-center">
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <img src="/static/check_salary.jpg" class="img-thumbnail rounded" alt="Image 1">
                                </div>
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <img src="/static/check_holidays.jpg" class="img-thumbnail rounded" alt="Image 2">
                                </div>
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
            isWaiting: false,
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

    methods: {

        async downlodResource() {
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok) {
              const taskId = data['task-id']
              const intv = setInterval(async () => {
                const csv_res = await fetch(`/get-csv/${taskId}`)
                if (csv_res.ok) {
                  this.isWaiting = false
                  clearInterval(intv)
                  window.location.href = `/get-csv/${taskId}`
                }
              }, 1000)
            }
          },

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
            if (data.r != 's_man'){
                this.flag = 0
                this.message = "You are not authorized. Kindly use Store Manager's credentials"
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
            localStorage.removeItem('auth-token');
        }
    },
}
