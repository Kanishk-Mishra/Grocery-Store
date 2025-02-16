export default{
    template:
        `<div>
            <body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; margin-bottom: 5px; min-height: 100vh;">
                <div v-show='flag==0'>
                    <p style="color:red; padding-top: 5px; padding-bottom: 0px;">{{message}}</p>
                </div>  
                <div v-show="len == 0">
                    <h3 style="text-align: center; margin-top: 50px; margin-bottom: 0;">No categories found!</h3>
                </div>
                <div v-show="len != 0">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-6">
                            <h3 style="margin-top: 30px; margin-bottom: 10px; text-align: left;">Categories</h3>
                            </div>
                        </div>
                    </div>

                    
                    <div class="card rounded-3 mb-4" style="width: 45%; margin: 0 auto;" v-for="c in cate">
                        <div class="card-body p-4">
                            <div class="row d-flex justify-content-between align-items-center">
                                <div class="col-md-7 col-lg-6 col-xl-6">
                                    <p class="lead fw-normal mb-0" style="text-align: left;" >{{ c.Name }}</p>
                                    
                                    <p mb-0 style="text-align: left;" v-show="role == 'admin'"> <span class="text-muted">Creator: </span><i>{{ c.Creator }} </i><br><span class="text-muted">Category Id: </span>{{ c.C_id }}</span></p>
                                    
                                    <p mb-0 style="text-align: left;" v-show="role == 's_man'">
                                        <span v-show="c.Me == 'No'">
                                            <span class="text-muted">Category Id: </span>{{ c.C_id }}
                                        </span>
                                        <span v-show="c.Me == 'Yes' && (c.Request == 1 || c.Request == 2)" >
                                            <span class="text-muted">Created by you</span>        <br><span class="text-muted">Category Id: </span>{{ c._C_id }}
                                        </span>
                                        <span v-show="c.Me == 'Yes' && (c.Request != 1 && c.Request != 2)" >
                                            <span class="text-muted">Category Id: </span>{{ c.C_id }}
                                        </span>
                                    </p>
                                </div>
                                <div class="col-md-6 col-lg-4 col-xl-4 d-flex">
                                    <div class="btn-group" role="group" aria-label="Basic outlined example">
                                        <button v-show="c.Request != 1 && c.Request != 2" @click.prevent="getval(c.Name)" type="button" class="btn btn-outline-info" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop1' + c.C_id">Update</button>
                                        <button v-show="c.Request != 1 && c.Request != 2" type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop2' + c.C_id">Delete</button>
                                    </div>
                                    <span style="text-align: left;" v-show="c.Me == 'Yes' && (c.Request == 1 || c.Request == 2)" >
                                        <span class="text-muted">Status: </span><i style="color: #e34234">Pending Request </i>          <br><span class="text-muted">Type: </span><span v-show="c.Request == 1">Create</span><span v-show="c.Request == 2">Update</span>
                                    </span>            
                                    <!-- Modal -->
                                    <div class="modal fade" :id="'staticBackdrop1' + c.C_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel1' + c.C_id" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" :id="'staticBackdropLabel1' + c.C_id">Update</h1>
                                                    <button @click.prevent="getval()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div @input="validateForm" class="modal-body">
                                                    <label :for="'c_name' + c.C_id" style="display: block; text-align: left; margin-bottom: 5px;">Type new name</label>
                                                    <input type="text" :id="'c_name' + c.C_id" name="c_name" required v-model="det.c_name" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">
                                                </div>
                                                <div class="modal-footer">
                                                    <button @click.prevent="getval()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button  @click.prevent="updLink(c.C_id)" type="button" :disabled="!isFormValid" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                        
                                    <!-- Modal -->
                                    <div class="modal fade" :id="'staticBackdrop2' + c.C_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel2' + c.C_id" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" :id="'staticBackdropLabel2' + c.C_id">Warning!</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    Are you sure? This action can't be undone.
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button @click.prevent="delLink(c.C_id)" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="flag != 0 || (flag == 0 && len != 0)" class="container" style="display: flex; justify-content: space-evenly; align-items: center; margin-top: 20px;">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style="display: inline-block; background-color: #007bff; color: white; text-align: center; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-bottom: 60px; margin-top: 0px">
                        +Add
                    </button>
                    <!-- Modal -->
                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add a Category</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @input="validateForm" method="post">
                                        <label for="c_name" style="display: block; text-align: left; margin-bottom: 5px;">Category name</label>
                                        <input type="text" id="c_name" name="c_name" required v-model="det.c_name" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">
                                    </form>  
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button @click.prevent="add_category" type="button" :disabled="!isFormValid" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
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
            isFormValid: false,
        }
    },

    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.removeItem('noti');
        next();
    },

    methods:{
        validateForm() {
            // Check if required fields are filled
            if (
                this.det.c_name.trim() !== ''
            ) {
              // All required fields are filled
                this.isFormValid = true;
            } 
            else {
                this.isFormValid = false;
            }
        },
        getval(a){
            this.det.c_name = a
        },
        async updLink(id){
            // Combine the dynamic part with a base URL or other parts of the endpoint
            // return `/admin/all_categories/upd_category/${id}`;
            this.det.c_name = this.det.c_name.trim()
            const res = await fetch(`/api/upd_category/${id}`, {
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
                if(localStorage.getItem('role') == 's_man'){
                    alert('Edit request sent!')
                }
                window.location.reload();
            }
            else if (res.status == 401){
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message 
            }
            else if (res.status == 403){
                alert('You are not authorized.')
                localStorage.clear()
            }
        },
        async delLink(id){
            const res = await fetch(`/api/del_category/${id}`, {
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
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message 
            }
            else if (res.status == 403){
                alert('You are not authorized.')
                localStorage.clear()
            }
            else if (res.status == 500){
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message
            }
        },
        async add_category(){
            this.det.c_name = this.det.c_name.trim()
            var res = await fetch('/api/add_category',{
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
                if(localStorage.getItem('role') == 's_man'){
                    alert('Create request sent!')
                }
                window.location.reload();
            }
            else if (res.status == 401){
                const data = await res.json()
                alert('Error!')
                this.flag = 0;
                this.message = data.message 
            }
            else if (res.status == 403){
                alert('You are not authorized.')
                localStorage.clear()
            }
        },

    },

    async mounted(){
        const res = await fetch('/api/all_categories',{
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
            this.flag = 0;
            this.message = data.message
        }
        else if (res.status == 401){
            alert('Error!')
            this.flag = 0;
            this.message = 'Unauthorized access' 
        }
        else if (res.status == 403){
            alert('You are not authorized.')
            localStorage.clear()
        }
    },
}

