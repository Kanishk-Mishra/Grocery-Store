export default{
    template:`<div>
            <body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; margin-bottom: 5px; min-height: 100vh;">
                
                <div v-show="found==0">
                    <p style="color:#808080; padding-top: 20px; padding-bottom: 0px;">Nothing related to your search query found!</p>
                    <router-link to="/all_products">view all</router-link>
                </div>

                <div v-show='flag==0' >
                    <p style="color:red; padding-top: 5px; padding-bottom: 0px;">{{message}}</p>
                </div>  
                <div v-show="len == 0">
                    <h3 style="text-align: center; margin-top: 50px; margin-bottom: 0;">No products found!</h3>
                </div>
                <div v-show="len != 0 && found == 1">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-3 d-flex justify-content-start">
                                <h3 style="margin-top: 30px; margin-bottom: 10px; text-align: left;">Products</h3>
                            </div>
                            <div class="col-3 d-flex justify-content-end">
                                <button type="button" style="border: none;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
                                    <img src="/static/add-button.svg" style="margin-top: 35px; margin-bottom: 10px; height: 25px; width: 25px;">
                                </button>                        
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6 d-flex justify-content-start">
                                <p style="margin-top: 0px; margin-bottom: 10px; text-align: left; color:#808080;">Search results for: {{ qword }}</p>
                            </div>
                        </div>
                    </div>

                    
                    <div v-for="p in prod">    
                        <div class="card rounded-3 mb-4" style="width: 45%; margin: 0 auto;" v-show="p.Category == ser_result || ser_result.includes(p.Name)">
                            <div class="card-body p-4">
                                <div class="row d-flex justify-content-between align-items-center">
                                    
                                    <div class="row d-flex justify-content-between align-items-center">
                                        <div class="col-md-6 col-lg-5 col-xl-5">
                                            <img v-show="p.Img_link && def_pic==0" :src="p.Img_link" class="img-fluid rounded-3" :alt="p.Name">
                                            <img v-show="!p.Img_link || def_pic==1" src="/static/default_prod.png" class="img-fluid rounded-3" :alt="p.Name">
                                        </div>
                                        <div class="col-md-6 col-lg-7 col-xl-7">
                                            <p class="lead fw-normal mb-0" style="text-align: left;">{{ p.Name }}</p>
                                            <p style="text-align: left;"><span class="text-muted">Category: </span>{{ p.Category }}</span>
                                            <br><span class="text-muted">Product id: </span>{{ p.P_id }}</span>
                                            <br><span class="text-muted">Mfg: </span>{{ new Date(p.Manufacture_date).toLocaleDateString() }}
                                            <br><span class="text-muted">Exp: </span>{{ new Date(p.Expiry_date).toLocaleDateString() }}</span>
                                            <br><span class="text-muted">M.R.P.: </span> ₹{{ p.Rate_per_unit }}</span>
                                            <br><span class="text-muted">In stock: </span>{{ p.Inventory }}</span></p>
                                        </div>
                                    </div>

                                    <div class="row d-flex justify-content-center align-items-center">                                            
                                        <p mb-0 style="text-align: left;"> <strong>Description: </strong>{{ p.Description }} </p>                                    
                                    </div>
                                    

                                    <div class="row d-flex justify-content-between align-items-center">
                                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                                            <button @click.prevent="getval(p.Name, p.Description, p.categ_id, p.Manufacture_date, p.Expiry_date, p.Rate_per_unit, p.Inventory, p.Img_link)" type="button" class="btn btn-outline-info" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop1' + p.P_id">Update</button>
                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop2' + p.P_id">Delete</button>
                                        </div>                                          
                                        <!-- Modal -->
                                        <div class="modal fade" :id="'staticBackdrop1' + p.P_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel1' + p.P_id" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-scrollable">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" :id="'staticBackdropLabel1' + p.P_id">Update</h1>
                                                        <button type="button" @click.prevent="resetval()" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <form @input="validateForm" method="post">
                                                            <label for="p_name" style="display: block; text-align: left; margin-bottom: 5px;">Product name</label>
                                                            <input type="text" id="p_name" name="name" required v-model="det.name" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                                            <label for="desc" style="display: block; text-align: left; margin-bottom: 5px;">Description</label>                                        
                                                            <textarea id="desc" name="desc" v-model="det.desc" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;"></textarea>

                                                            <label for="mfg" style="display: block; text-align: left; margin-bottom: 5px;">Mfg.</label>
                                                            <input type="datetime-local" id="mfg" name="mfg" required v-model="det.mfg" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                                            <label for="exp" style="display: block; text-align: left; margin-bottom: 5px;">Exp.</label>
                                                            <input type="datetime-local" id="exp" name="exp" required v-model="det.exp" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                                            <label for="mrp" style="display: block; text-align: left; margin-bottom: 5px;">M.R.P.</label>
                                                            <input type="number" step="0.01" id="mrp" name="mrp" required v-model="det.mrp" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">
                                                            
                                                            <label for="inventory" style="display: block; text-align: left; margin-bottom: 5px;">Inventory</label>
                                                            <input type="number" step="1" id="inventory" name="invetory" required v-model="det.inventory" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                                            <label for="ilink" style="display: block; text-align: left; margin-bottom: 5px;">Image link (optional)</label>
                                                            <input type="text" id="ilink" name="ilink" v-model="det.ilink" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                                            <label for="cat" style="display: block; text-align: left; margin-bottom: 5px;">Choose category</label>                                       
                                                            <select required  v-model="det.c_id" name="c_id" id="cat" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">
                                                                <option v-for="c in cate" :value="c.C_id">{{c.Name}}</option>
                                                            </select>
                                                        </form>          
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" @click.prevent="resetval()" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button @click.prevent="updLink(p.P_id)" type="button" class="btn btn-primary" :disabled="!isFormValid" data-bs-dismiss="modal">Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                        
                                        <!-- Modal -->
                                        <div class="modal fade" :id="'staticBackdrop2' + p.P_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel2' + p.P_id" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" :id="'staticBackdropLabel2' + p.P_id">Warning!</h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        Are you sure? This action can't be undone.
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button @click.prevent="delLink(p.P_id)" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                                                    </div>
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
                        <div class="modal-dialog modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add a Product</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @input="validateForm" method="post">
                                        <label for="p_name" style="display: block; text-align: left; margin-bottom: 5px;">Product name</label>
                                        <input type="text" id="p_name" name="name" required v-model="det.name" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                        <label for="desc" style="display: block; text-align: left; margin-bottom: 5px;">Description</label>                                        
                                        <textarea id="desc" name="desc" v-model="det.desc" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;"></textarea>

                                        <label for="mfg" style="display: block; text-align: left; margin-bottom: 5px;">Mfg.</label>
                                        <input type="datetime-local" id="mfg" name="mfg" required v-model="det.mfg" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                        <label for="exp" style="display: block; text-align: left; margin-bottom: 5px;">Exp.</label>
                                        <input type="datetime-local" id="exp" name="exp" required v-model="det.exp" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                        <label for="mrp" style="display: block; text-align: left; margin-bottom: 5px;">M.R.P.</label>
                                        <input type="number" step="0.01" id="mrp" name="mrp" required v-model="det.mrp" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">
                                        
                                        <label for="inventory" style="display: block; text-align: left; margin-bottom: 5px;">Inventory</label>
                                        <input type="number" step="1" id="inventory" name="invetory" required v-model="det.inventory" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                        <label for="ilink" style="display: block; text-align: left; margin-bottom: 5px;">Image link (optional)</label>
                                        <input type="text" id="ilink" name="ilink" v-model="det.ilink" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                        <label for="cat" style="display: block; text-align: left; margin-bottom: 5px;">Choose category</label>                                       
                                        <select required  v-model="det.c_id" name="c_id" id="cat" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">
                                            <option v-for="c in cate" :value="c.C_id">{{c.Name}}</option>
                                        </select>

                                    </form>  
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button @click.prevent="create_product" type="button" class="btn btn-primary" :disabled="!isFormValid" data-bs-dismiss="modal">Submit</button>
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
                name: '',
                desc: '',
                mfg: '',
                exp: '',
                mrp: '',
                inventory: '',
                ilink: '',
                c_id: 1,
            },
            flag: 1,
            def_pic: 0,
            cate: [],
            prod: [],
            len : 0,
            message:'',
            role:'',
            isFormValid: false,
            
            // found: 0,
            myData: localStorage.getItem('myData') || '',
            // kind: JSON.parse(localStorage.getItem('myData')),
            // ser_result: JSON.parse(localStorage.getItem('myData')).ser_result,
            // qword: JSON.parse(localStorage.getItem('myData')).qword,
        }
    },

    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.removeItem('noti');
        next();
    },

    computed: {
        found() {
          if (JSON.parse(localStorage.getItem('myData')).kind == 'No') {
            return 0;
          }
          return 1;
        },
        kind() {
            return JSON.parse(localStorage.getItem('myData')).kind
        },
        ser_result() {
            return JSON.parse(localStorage.getItem('myData')).ser_result
        },
        qword() {
            return JSON.parse(localStorage.getItem('myData')).qword
        },
    },

    // watch: {
    //     kind(newVal, oldVal){
    //         if(newVal != oldVal){
    //             window.location.reload()
    //         }
    //     }
    // },

    // mounted() {
    //     this.$root.$on('datafromnav', (data) =>{
    //         console.log(data)
    //     });
        // console.log(this.$store.state.receivedDataFromNavbar);
    //   },
            

    methods:{
        
        getval(Name, Description, categ_id, Manufacture_date, Expiry_date, Rate_per_unit, Inventory, Img_link){
            this.det.name = Name;
            this.det.desc = Description;
            

            const mfgDate = new Date(Manufacture_date);
            const expDate = new Date(Expiry_date);
            const formattedMfgDate = mfgDate.toISOString().slice(0, 16);
            const formattedExpDate = expDate.toISOString().slice(0, 16);

            this.det.mfg = formattedMfgDate;
            this.det.exp = formattedExpDate;


            this.det.mrp = Rate_per_unit;
            this.det.inventory = Inventory;
            this.det.ilink = Img_link;
            this.det.c_id = categ_id;
        },
        resetval() {
            // Reset other fields
            this.det.name = '';
            this.det.desc = '';
            this.det.c_id = 1;
            this.det.mrp = '';
            this.det.inventory = '';
            this.det.ilink = '';
            this.det.mfg = ''; 
            this.det.exp = '';
        },
  
        validateForm() {
            // Check if required fields are filled
            if (
                this.det.name.trim() !== '' &&
                this.det.mfg &&
                this.det.exp &&
                this.det.mrp &&
                this.det.inventory &&
                this.det.c_id
            ) {
              // All required fields are filled
                this.isFormValid = true;
            } 
            else {
                this.isFormValid = false;
            }
        },

        async updLink(id){
            // return `/admin/all_categories/upd_category/${id}`;
            this.det.name = this.det.name.trim()
            const res = await fetch(`/api/upd_product/${id}`, {
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
                alert('You are not authorized.')
                localStorage.clear()
            }
        },
        async delLink(id){
            const res = await fetch(`/api/del_product/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            })
            if (res.ok){
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
        async create_product(){
            
            this.det.name = this.det.name.trim()
            var res = await fetch('/api/create_product',{
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify(this.det),
            })
            if (res.ok){
                var data = await res.json()
                alert('Product added!')
                window.location.reload();
            }

            else if (res.status == 500){
                var data = await res.json()
                alert('Error!')
                this.flag = 0
                this.message = data.message
            }

            else if (res.status == 401){
                var data = await res.json()
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
        const res = await fetch('/api/all_products',{
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
            this.cate = data.cate
            this.prod = data.prod
            this.len = this.prod.length
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
        else if (res.status == 404){
            this.def_pic = 1;
        }
    },
}

