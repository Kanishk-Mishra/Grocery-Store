export default{
    template:
        `<div>
            <body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; margin-bottom: 5px; min-height: 100vh;">
                <div v-show='flag==0'>
                    <p style="color:red; padding-top: 5px; padding-bottom: 0px;">{{message}}</p>
                </div>  
                <div v-show="len == 0">
                    <h3 style="text-align: center; margin-top: 50px; margin-bottom: 0;">No requests found!</h3>
                </div>
                <div v-show="len != 0">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-6">
                            <h3 style="margin-top: 30px; margin-bottom: 10px; text-align: left;">Managers</h3>
                            </div>
                        </div>
                    </div>

                    
                    <div class="card rounded-3 mb-4" style="width: 45%; margin: 0 auto;" v-for="c in cate">
                        <div class="card-body p-4">
                            <div class="row d-flex justify-content-between align-items-center">
                                <div class="col-md-2 col-lg-2 col-xl-2">
                                    <img src="static/Default_pfp.png" class="img-fluid rounded-3" alt="pfp">
                                </div>
                                <div class="col-md-7 col-lg-7 col-xl-7">
                                    <p class="lead fw-normal mb-0" style="text-align: left;">{{ c.username }}</p>
                                    <p style="text-align: left;">
                                        <span class="text-muted">user id: </span>{{ c.id }}</span>
                                        <br><span class="text-muted">email: </span>{{ c.email }}</span>
                                        <br><span v-show="!c.active" class="text-muted"><i style="color: #006400">Manager access requested</i></span>
                                    </p>                            
                                </div>
                                <div class="col-md-3 col-lg-3 col-xl-3 d-flex">
                                    <div v-show="!c.active" class="btn-group" role="group" aria-label="Basic outlined example">
                                        <button class="btn btn-outline-success" @click.prevent="approve(c.id)">Approve</button>
                                        <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop2' + c.id">Deny</button>
                                    </div>

                                    <!-- Modal -->
                                    <div class="modal fade" :id="'staticBackdrop2' + c.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel2' + c.id" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" :id="'staticBackdropLabel2' + c.id">Warning!</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    Are you sure? This action can't be undone.
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button @click.prevent="deny(c.id)" type="button" class="btn btn-danger" data-bs-dismiss="modal">Rrmove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <button v-show="c.active" type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop1' + c.id">Remove</button>                                              
                                                                       
                                    <!-- Modal -->
                                    <div class="modal fade" :id="'staticBackdrop1' + c.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel1' + c.id" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" :id="'staticBackdropLabel1' + c.id">Warning!</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    Are you sure? This action can't be undone.
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button @click.prevent="delLink(c.id)" type="button" class="btn btn-danger" data-bs-dismiss="modal">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            <div class="footer" style="background-color: #808080; color: #fff; padding: 10px 20px; text-align: center; width: 100%; position: fixed; bottom: 0;">
                &copy; 2023 GroceryStore. All rights reserved.
            </div>
        </div>`,
    data (){
        return{
            det:{
                c_name: '',
            },
            flag: 1,
            cate: [],
            len : 0,
            message:'',
            role:'',
        }
    },

    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.removeItem('noti');
        next();
    },

    methods:{
        async approve(id){
            // Combine the dynamic part with a base URL or other parts of the endpoint
            // return `/admin/all_categories/upd_category/${id}`;
            const res = await fetch(`/api/app_sman/${id}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify(this.det),
            })
            var data = await res.json()
            if (res.status == 500){
                alert('Error!')
                this.flag = 0
                this.message = data.message
            }
            else if (res.status == 201){
                window.location.reload();
            }
            else if (res.status == 401){
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message 
            }
            else if (res.status == 403){
                alert('Error!')
                this.flag = 0;
                this.message = 'You are not authorized. Login as Admin to continue.'
            }
        },
        async deny(id){
            const res = await fetch(`/api/ref_sman/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            })
            if (res.ok){
                window.location.reload();
            }
            else if (res.status == 401){
                alert('Error! Unauthorized access') 
            }
            else if (res.status == 403){
                alert('Error! Unauthorized access')
            }
            else if (res.status == 500){
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message
            }
        },
        async delLink(id){
            const res = await fetch(`/api/rem_sman/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            })
            if (res.ok){
                if(localStorage.getItem('role') == 's_man'){
                    alert('Delete request sent!')
                }
                window.location.reload();
            }
            else if (res.status == 401){
                alert('Error! Unauthorized access')            
            }
            else if (res.status == 403){
                alert('Error! Unauthorized access')
            }
            else if (res.status == 500){
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message
            }
        },
    },

    async mounted(){
        const res = await fetch('/api/all_sman',{
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        })
        // console.log(localStorage.getItem('auth-token'))
        const data = await res.json()
        if (res.ok){
            // console.log(data)
            this.role = localStorage.getItem('role')
            this.cate = data
            this.len = data.length
        }
        else if (res.status == 500){
            alert('Error!')
            this.flag = 0;
            this.message = data.message
        }
        else if (res.status == 401){
            alert('Error! Unauthorized access')
            this.flag = 0;
            this.message = 'Unauthorized access' 
        }
        else if (res.status == 403){
            alert('Error! Unauthorized access')
            this.flag = 0
            this.message = `You are not authorized. Login as Admin to continue.`
        }
    },
}
