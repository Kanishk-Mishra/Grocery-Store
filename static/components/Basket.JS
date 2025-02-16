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
                    <div class="toast-body" v-html="message">
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>

        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast3" class="toast align-items-center text-bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        {{message}}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
        
        <div v-show="len==0">
            <p style="color:#808080; padding-top: 20px; padding-bottom: 0px;">Your cart is empty!</p>
            <router-link to="/">+Add</router-link>
        </div>

        <div v-show="len != 0">
            <div class="container h-100 py-5">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-10">
            
                        <div class="d-flex justify-content-between align-items-center mb-4" style="max-width: 900px; margin: auto;">
                            <h3 class="fw-normal mb-0 text-black">Shopping Cart</h3>
                            <div>
                                <p class="mb-0"><router-link to="/" class="text-body">+Add</router-link></p>
                            </div>
                        </div>
                    
                        <div class="card rounded-3 mb-4" style="max-width: 900px; margin: auto;" v-for="p in prod2">
                            <div class="card-body">
                                <div class="row d-flex justify-content-between align-items-center">
                                    <label class="col">
                                        <input type="checkbox" v-model="selectedProducts" :value="p.P_id">
                                    </label>
                                    <div class=" col-md-2 col-lg-2  ">
                                        <img v-show="p.Img_link" :src="p.Img_link" class="card-img-top" alt="p.Name">
                                        <img v-show="!p.Img_link" src="/static/default_prod.png" class="card-img-top" alt="p.Name">
                                    </div>
                                    <div class=" col-md-3 col-lg-3 col-xl-3">
                                        <p class="lead fw-normal mb-2" style="text-align: left;">{{ p.Name }}</p>
                                    </div>
                                    <div class=" col-md-2 col-lg-2   d-flex">
                                        <button class="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                            <i class="fas fa-minus"></i>
                                        </button>
                    
                                        <input :id="'form'+p.P_id" min="1" v-model="quantities[p.P_id]" value="1" name="quantity" type="number" placeholder="1" class="form-control form-control-sm" @input="handleInput(p.P_id)" />
                    
                                        <button class="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div class=" col-md-2 col-lg-2  ">
                                        <h5 class="mb-0">₹{{ p.Mrp }}</h5>
                                    </div>
                                    <div class=" col-md-3 col-lg-2  ">
                                        <button @click.prevent="remove(p.B_id)" class="btn btn-outline-danger">
                                        Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div class="card mb-4" style="max-width: 900px; margin: auto;">
                            <div class="card-body p-4 d-flex flex-row">
                                <form class="d-flex justify-content-center" style=" margin: auto; width: 80%;">
                                    <div class="input-group justify-content-center" style="margin: auto;">
                                        <input class="form-control form-control-lg" placeholder="Coupon-Code" style="border: 1px solid; width: 300px; margin: auto;" aria-label="Coupon-Code">
                                        <button class="btn btn-outline-secondary btn-lg" type="submit" style="flex: 1;">Apply</button>
                                    </div>                
                                </form>
                            </div>
                        </div>
                        
                        <div class="card mb-4 justify-content-center" style="max-width: 900px; margin: auto;">
                            <div class="card-body p-4 d-flex flex-row">
                                <div class="col-md-f col-lg-5 d-flex align-items-center offset-sm-2">
                                    <h5 class="m-0" style="text-align: left;">Grand Total <strong>₹{{ grand_total }}</strong></h5>
                                </div>
                                <div class="col-md-4 col-lg-4 d-flex align-items-center justify-content-center">
                                    <button type="button" style="width: 300px" class="btn btn-warning btn-lg" @click.prevent="buy">Proceed to Pay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>`,

    data(){
        return{
            prod: [],
            message: '',
            flag: 1,
            selectedProducts: [],
            quantities: {},
        }
    },
    computed: {
        prod2(){
            return this.prod.filter(item => item.Basket == 1);                                
        },
        len(){
            if(this.prod2.length != 0){return this.prod2.length}
            else{return 0}
        },
        grand_total(){
            let sum = 0;
            if(this.selectedProducts.length != 0){
                for(const i of this.selectedProducts){
                    for(const j of this.prod2){
                        if(j.P_id == i){
                            let q = this.quantities[i]
                            if(q){sum = sum + j.Mrp*q}
                            else{sum = sum + j.Mrp}
                        }
                    }
                }
            }
            return Number(sum.toFixed(2));
        }
    },
    methods:{
        handleInput(id) {
            if (this.quantities[id] == 0) {
              this.quantities[id] = 1;
            }
        },
        async remove(id){
            const res = await fetch(`/api/rem_bask_item/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            })
            if (res.ok){
                this.message = 'Item removed!'
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast2'));
                liveToast.show();
                this.selectedProducts = [];
                this.quantities= {}
                setTimeout(() => {
                    window.location.reload();
                }, 1000);                
            }
            else if (res.status == 401){
                const data = await res.json()
                alert('Error! Unauthorize access')
            }
            else if (res.status == 403){
                alert('You are not authorized.')
                localStorage.clear()
            }
            else if (res.status == 500){
                this.message = 'Sorry! Unable to remove the item.'
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                liveToast.show();
            }
        },
        async buy(){
            if(this.selectedProducts.length != 0){
                const cartItems = this.selectedProducts.map(P_id => ({
                    P_id,
                    Quantity: this.quantities[P_id] || 1,
                }));
                var res = await fetch('/api/purchase',{
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                    body: JSON.stringify(cartItems),
                })
                if (res.status == 201){
                    this.message = `Payment successful! check <router-link to="/my_ord" class="alert-link">My Orders</router-link> to know more`
                    const liveToast = new bootstrap.Toast(document.getElementById('liveToast2'));
                    liveToast.show();
                    this.selectedProducts = [];
                    this.quantities= {};
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);               
                }
                if (res.status == 200){
                    const data = await res.json() 
                    this.message = data.message
                    const liveToast = new bootstrap.Toast(document.getElementById('liveToast3'));
                    liveToast.show();                
                }
                else if (res.status == 401){
                    alert('Error! Unauthorize access')
                }
                else if (res.status == 403){
                    alert('You are not authorized.')
                    localStorage.clear()
                }
                else if (res.status == 500){
                    this.message = 'Sorry! Unable to buy the item.'
                    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                    liveToast.show();
                }
            }
            else{
                this.message = 'No item selected!'
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast3'));
                liveToast.show();
            }
        },
    },
    async mounted(){
        const res = await fetch('/api/pur_items',{
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        })
        // console.log(localStorage.getItem('auth-token'))
        const data = await res.json()
        if (res.ok){
            // console.log(data)            
            this.prod = data
        }
        else if (res.status == 500){
            this.message = 'Sorry! Unable to fetch the contents.'
            const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
            liveToast.show();
        }
        else if (res.status == 401){
            alert('Error! Unauthorized access')
        }
        else if (res.status == 403){
            alert('You are not authorized.')
            localStorage.clear()
        }
    },    
}
