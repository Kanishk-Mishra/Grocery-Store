export default{
    template:`<body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; min-height: 100vh;">
        
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast1" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        {{message}}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
        
        <div v-show="len==0">
            <p style="color:#808080; padding-top: 20px; padding-bottom: 0px;">You haven't ordered anything!</p>
            <router-link to="/">+Buy</router-link>
        </div>

        <div v-show="len != 0">
            <div class="container h-100 py-5">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-10">
            
                        <div class="d-flex justify-content-between align-items-center mb-4" style="max-width: 900px; margin: auto;">
                            <h3 class="fw-normal mb-0 text-black">My Orders</h3>
                            <div>
                                <p class="mb-0"><router-link to="/" class="text-body">+Buy</router-link></p>
                            </div>
                        </div>
                    
                        <div class="card rounded-3 mb-4" style="max-width: 900px; margin: auto;" v-for="p in prod2">
                            <div class="card-body">
                                <div class="row d-flex justify-content-between align-items-center">
                                    <div class=" col-md-2 col-lg-2  ">
                                        <img v-show="p.Img_link" :src="p.Img_link" class="card-img-top" alt="p.Name">
                                        <img v-show="!p.Img_link" src="/static/default_prod.png" class="card-img-top" alt="p.Name">
                                    </div>
                                    <div class=" col-md-3 col-lg-3 col-xl-3">
                                        <p class="lead fw-normal mb-2" style="text-align: left;">{{ p.Name }}</p>
                                    </div>
                                    <div class=" col-md-2 col-lg-2 col-xl-2">
                                        <p class="lead fw-normal mb-2" style="text-align: left;"><span class="text-muted">Quantity: </span>{{ p.Quantity }}</p>
                                    </div>
                                    <div class=" col-md-2 col-lg-2  ">
                                        <h5 class="mb-0"><span class="text-muted">Mrp: </span>₹{{ p.Mrp }}</h5>
                                    </div>
                                    <div class=" col-md-2 col-lg-2  ">
                                        <button class="btn btn-outline-secondary" id="#liveToastBtn">Track Order</button>
                                        <div class="toast-container position-fixed bottom-0 end-0 p-3">
                                            <div id="liveToastBtn" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                                                <div class="d-flex">
                                                    <div class="toast-body">
                                                        Order delivered successfully! Thanks for shopping with GroceryStore.
                                                    </div>
                                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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
        </div>
    </body>`,

    data(){
        return{
            prod: [],
            message: '',
            flag: 1,
        }
    },
    computed: {
        prod2(){
            return this.prod.filter(item => item.Basket == 0);                                
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
            return sum;
        }
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
            const liveToast = new bootstrap.Toast(document.getElementById('liveToast1'));
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
