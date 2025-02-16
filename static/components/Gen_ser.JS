export default {
    template: `<div>
            <body style="font-family: Arial, sans-serif; background-color: #eee; text-align: center; display: flex; flex-direction: column; min-height: 100vh;">
                
                <div class="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                Sorry! An unexpected error occured.
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>

                <div class="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast2" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                            Successfully added the product in your <router-link to="/basket" class="alert-link">cart</router-link>
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>

                <div class="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast3" class="toast align-items-center text-bg-secondary border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                            Product already added. Check your <router-link to="/basket" class="alert-link">cart</router-link>
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>

                <div v-show="found==0">
                    <p style="color:#808080; padding-top: 20px; padding-bottom: 0px;">Nothing related to your search query found!</p>
                    <router-link to="/">view all</router-link>
                </div>
                
                <div v-show="found==1">
                    
                    <div class="container" v-show="search_mo">
                        <p style="margin-top: 20px; text-align: left; color:#808080;">Search results for: {{ qword }}</p>
                    </div>

                    <div class="container" v-show="!search_mo">
                        <p style="margin-top: 20px; text-align: left; color:#808080;">Search results for: {{ ser }}</p>
                    </div>

                    <div class="container"  style="margin-top: 10px;">
                        <ul class="nav nav-tabs nav-fill">
                            <li class="nav-item">
                                <a @click.prevent="set_ser('all')" :class="get_class('all')" aria-current="page" href="/">All</a>
                            </li>
                            <li class="nav-item" v-for="c in cate2">
                                <a @click.prevent="set_ser(c.Name)" :class="get_class(c.Name)" aria-current="page" href="/">{{c.Name}}</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    More
                                </a>
                                <ul class="dropdown-menu">
                                    <li v-for="c in cate"><a class="dropdown-item" @click.prevent="set_ser(c.Name)" href="#">{{c.Name}}</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div class="container" style="margin-top: 20px; display: flex; justify-content: flex-start;">
                        <button @click.prevent="toggleFilterColumn" type="button" v-show="isFilterCollapsed" class="btn btn-outline-secondary">
                            <img src="/static/show.png" alt="Menu" style="margin-bottom: 2px; border: none; width: 25px; height: 25px;">                            
                            Show filters
                        </button>
                        <button @click.prevent="toggleFilterColumn" type="button" v-show="!isFilterCollapsed" class="btn btn-outline-secondary">
                            <img src="/static/hide.png" alt="Menu" style="margin-bottom: 2px; border: none; width: 25px; height: 25px;">
                            Hide filters
                        </button>
                    </div>
                    <div class="container" style="max-width: 1530px">
                        <div style="display: flex;">

                        
                            <div class="col-4" :style="{ width: isFilterCollapsed ? '0' : '250px', overflow: 'hidden', transition: 'width 0.3s ease-in-out' }">
                                <div :style="{ position : isFilterCollapsed ? 'relative' : 'fixed', marginTop: '40px', }">

                                    <div style="text-align: left; margin-left: 100px">

                                        <div style="border: 2px solid #ccc; border-radius: 10px; padding: 7px; width:150px; background-color: #ccc">By price</div>

                                        <label style="text-align: left">
                                        <input type="checkbox" v-model="selectedOptions" value="l20">
                                        Less than ₹20
                                        </label>

                                        <br><label style="text-align: left">
                                        <input type="checkbox" v-model="selectedOptions" value="21to50">
                                        ₹21 to ₹50
                                        </label>

                                        <br><label style="text-align: left">
                                        <input type="checkbox" v-model="selectedOptions" value="51to100">
                                        ₹51 to ₹100
                                        </label>

                                        <br><label style="text-align: left">
                                        <input type="checkbox" v-model="selectedOptions" value="101to200">
                                        ₹101 to ₹200
                                        </label>

                                        <br><label style="text-align: left">
                                        <input type="checkbox" v-model="selectedOptions" value="201to500">
                                        ₹201 to ₹500
                                        </label>

                                        <br><label style="text-align: left">
                                        <input type="checkbox" v-model="selectedOptions" value="g500">
                                        More than ₹500
                                        </label>

                                        <div style="border: 2px solid #ccc; border-radius: 10px; padding: 7px; margin-top: 10px; background-color: #ccc; width:150px;">By Mfg</div>
                                        
                                        <label for="mfg" style="display: block; text-align: left; margin-bottom: 5px; width:150px;">Choose Mfg date</label>
                                        <input type="datetime-local" id="mfg" name="mfg" required v-model="mfg" style="width: 70%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;">

                                        
                                    </div>

                                </div>
                            </div>


                            <div class="container">
                                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" style="margin-top: 10px;">
                                    <div v-for="p in prod3" class="col">

                                        
                                        <div class="card mb-3" style="width: 18rem; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                                            <a href="/" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop' + p.P_id" style="text-decoration: none;">
                                                <img v-show="p.Img_link" :src="p.Img_link" class="card-img-top" alt="p.Name">
                                                <img v-show="!p.Img_link" src="/static/default_prod.png" class="card-img-top" alt="p.Name">
                                            </a>
                                            <div class="card-body">
                                                <a href="/" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop' + p.P_id" style="text-decoration: none;">
                                                    <h5 class="card-title" style="text-decoration: none; color: #000; text-align: left;">{{ p.Name }}</h5>
                                                    <p class="card-text" style="text-align: left; color: #000; margin-bottom: 20px;">
                                                        <span class="text-muted">In stock: </span>  <span v-show="p.Inventory > 0">{{ p.Inventory }}</span><span v-show="p.Inventory <= 0">Out of stock!</span><br>
                                                        <span class="text-muted">M.R.P.: </span> ₹{{ p.Rate_per_unit }}</span>
                                                    </p>
                                                </a>
                                                <button @click.prevent="Carting(p.P_id)" v-show="p.Inventory > 0" class="btn btn-primary">Add to cart</button>
                                                <button @click.prevent="Carting(p.P_id)" v-show="p.Inventory <= 0" disabled class="btn btn-primary">Unavailable!</button>
                                            </div>
                                        </div>


                                        <!-- Modal -->
                                        <div class="modal fade" :id="'staticBackdrop' + p.P_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel' + p.P_id" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" :id="'staticBackdropLabel' + p.P_id">{{ p.Name }}</h1>
                                                        <button type="button" class="btn-close" @click.prevent="clear_rev" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="row d-flex justify-content-between align-items-center">
                                                            <div class="col-md-8 col-lg-7 col-xl-7">
                                                                <img v-show="p.Img_link" :src="p.Img_link" class="img-fluid rounded-3" :alt="p.Name">
                                                                <img v-show="!p.Img_link" src="/static/default_prod.png" class="img-fluid rounded-3" :alt="p.Name">
                                                            </div>
                                                            <div class="col-md-6 col-lg-5 col-xl-5">
                                                                <p style="text-align: left;"> <span class="text-muted">Category: </span> {{ p.Category }}

                                                                <br> <span class="text-muted">Mfg: </span> {{ new Date(p.Manufacture_date).toLocaleDateString() }}
                                                                <br> <span class="text-muted">Exp: </span> {{ new Date(p.Expiry_date).toLocaleDateString() }}
                                                                <br> <span class="text-muted">M.R.P.: </span> ₹{{ p.Rate_per_unit }}
                                                                <br> <span class="text-muted">In stock: </span>{{ p.Inventory }}            
                                                                <br> <span class="text-muted">Ratings: </span><span v-for="star in totalStars" :key="star" :style="{ fontSize: '24px', color: (star <= p.Ratings) ? '#ffd700' : 'gray' }">&#9734;</span><span> ({{ p.Ratings }})</span></p>
                                                                
                                                                <div class="d-flex justify-content-start">
                                                                    <button data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" style="margin-bottom: 10px;">Rate Product</button>
                                                                </div>
                                                                <!-- Collapse -->
                                                                <div class="collapse" id="collapseExample">
                                                                    
                                                                    <div class="card card-body">
                                                                        
                                                                        <div class="row d-flex justify-content-between align-items-center">
                                                                            <p style="text-align: left">Rate</p>
                                                                            <p><span class="star" @click="rateProduct(1)" style="font-size: 35px;" v-show="productRating < 1" >★</span>
                                                                            <span class="star" @click="rateProduct(1)" style="font-size: 35px; color: #ffd700" v-show="productRating >= 1" >★</span>
                                                                            
                                                                            <span class="star" @click="rateProduct(2)" style="font-size: 35px;" v-show="productRating < 2" >★</span>
                                                                            <span class="star" @click="rateProduct(2)" style="font-size: 35px; color: #ffd700" v-show="productRating >= 2" >★</span>
                                                                            
                                                                            <span class="star" @click="rateProduct(3)" style="font-size: 35px;" v-show="productRating < 3" >★</span>
                                                                            <span class="star" @click="rateProduct(3)" style="font-size: 35px; color: #ffd700" v-show="productRating >= 3" >★</span>
                                                                            
                                                                            <span class="star" @click="rateProduct(4)" style="font-size: 35px;" v-show="productRating < 4" >★</span>
                                                                            <span class="star" @click="rateProduct(4)" style="font-size: 35px; color: #ffd700" v-show="productRating >= 4" >★</span>
                                                                            
                                                                            <span class="star" @click="rateProduct(5)" style="font-size: 35px;" v-show="productRating < 5" >★</span>
                                                                            <span class="star" @click="rateProduct(5)" style="font-size: 35px; color: #ffd700" v-show="productRating >= 5" >★</span></p>
                                                                        </div>

                                                                    </div>

                                                                    <div class="row d-flex justify-content-center align-items-center">
                                                                        <p style="text-align: left; margin-top: 10px">Write a review</p>
                                                                        <textarea name="rev" v-model="rev" style="width: 92%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px;"></textarea>                                                                                                      
                                                                    </div>

                                                                    <div class="d-flex justify-content-end">
                                                                        <button @click.prevent="rev_sub(p.P_id)" v-show="productRating > 0" style="margin-bottom: 10px;" class="btn btn-primary">Submit</button>
                                                                        <button @click.prevent="rev_sub(p.P_id)" v-show="productRating <= 0" style="margin-bottom: 10px;" disabled class="btn btn-primary">Submit</button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="row d-flex justify-content-between align-items-center">
                                                            <p mb-0 style="text-align: left;"> <strong>Description: </strong>{{ p.Description }} </p>                              
                                                        </div>

                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" @click.prevent="clear_rev" data-bs-dismiss="modal">Close</button>
                                                        <button @click.stop="Carting(p.P_id)" data-bs-dismiss="modal" v-show="p.Inventory > 0" class="btn btn-primary">Add to cart</button>
                                                        <button @click.stop="Carting(p.P_id)" data-bs-dismiss="modal" v-show="p.Inventory <= 0" disabled class="btn btn-primary">Unavailable!</button>
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
            </body>
            <div class="footer" style="background-color: #808080; color: #fff; padding: 10px 20px; text-align: center; width: 100%; bottom: 0;">
                &copy; 2023 GroceryStore. All rights reserved.
            </div>
        </div>`,

    beforeRouteEnter(to, from, next) {
        // Set item in local storage when entering the route
        localStorage.removeItem('noti');
        next();
    },
    data (){
        return{
            cate: [],
            prod: [],
            role:'',
            ser: 'all',
            selectedOptions: [],
            isFilterCollapsed: true,
            mfg: '',
            search_mo: true,
            productRating: 0,
            rev: '',
            totalStars: 5,
        }
    },

    computed: {
        mdate(){
            if(this.mfg != ''){
                return new Date(this.mfg)
            }
            else{
                return ''
            }
        },
        prod2(){
            if (this.ser == 'all'){
                let c = []
                if(this.selectedOptions.length == 0 && this.mdate == ''){
                    return this.prod;
                }
                if(this.selectedOptions.length != 0 && this.mdate != ''){ 
                    for (const j of this.selectedOptions){
                        for (const i of this.prod){
                            c = this.insert(j,i,c)
                        }                    
                    }
                    const f = []
                    for (const q of c){
                        const da = new Date(k.Manufacture_date)
                        if (da >= this.mdate){
                            f.push(q);
                        }
                    }
                    return f;
                }
                if(this.mdate != '' && this.selectedOptions.length == 0 ){
                    for (const k of this.prod){
                        const da = new Date(k.Manufacture_date)
                        if(da >= this.mdate){
                            c.push(k);
                        }
                    }
                    return c;
                }
                if(this.selectedOptions.length != 0 && this.mdate == ''){ 
                    for (const j of this.selectedOptions){
                        for (const i of this.prod){
                            c = this.insert(j,i,c)
                        }                    
                    }
                    return c;
                }  
            }
            else {
                let c = []
                for (const i of this.prod){
                    if( i.Category == this.ser ){
                        if(this.selectedOptions.length == 0 && this.mdate == ''){
                            c.push(i);
                        }
                        if(this.selectedOptions.length != 0 && this.mdate != ''){
                            for (const j of this.selectedOptions){
                                c = this.insert(j,i,c)
                            }
                            c = c.filter(item => new Date(item.Manufacture_date) >= this.mdate);                            
                        }
                        if(this.mdate != '' && this.selectedOptions.length == 0){
                            
                            const da = new Date(i.Manufacture_date)
                            if(da >= this.mdate){
                                c.push(i);
                            }
                            
                        }
                        if(this.selectedOptions.length != 0 && this.mdate == ''){ 
                            for (const j of this.selectedOptions){
                                c = this.insert(j,i,c)
                            }
                        }
                    }
                }
                return c;
            }
        },
        cate2(){
            const d = []
            const c = this.cate.length
            for (let i = 0; i < 5 && i < c; i++){
                d.push(this.cate[i])
            }
            return d
        },
        prod3(){
            if (!this.search_mo){
                return this.prod2;
            }
            else {
                let c = []
                if (this.kind == 'item'){
                    for (const i of this.prod){
                        if( this.ser_result.includes(i.Name)){

                            
                            
                            if(this.selectedOptions.length == 0 && this.mdate == ''){
                                c.push(i);
                            }
                            if(this.selectedOptions.length != 0 && this.mdate != ''){
                                for (const j of this.selectedOptions){
                                    c = this.insert(j,i,c)
                                }
                                c = c.filter(item => new Date(item.Manufacture_date) >= this.mdate);                            
                            }
                            if(this.mdate != '' && this.selectedOptions.length == 0){
                                const da = new Date(i.Manufacture_date)
                                if(da >= this.mdate){
                                    c.push(i);
                                }
                            }
                            if(this.selectedOptions.length != 0 && this.mdate == ''){ 
                                for (const j of this.selectedOptions){
                                    c = this.insert(j,i,c)
                                }
                            }
                        }
                    }
                }
                if (this.kind == 'section'){
                    for (const i of this.prod){
                        if( i.Category == this.ser_result){

                            
                            
                            if(this.selectedOptions.length == 0 && this.mdate == ''){
                                c.push(i);
                            }
                            if(this.selectedOptions.length != 0 && this.mdate != ''){
                                for (const j of this.selectedOptions){
                                    c = this.insert(j,i,c)
                                }
                                c = c.filter(item => new Date(item.Manufacture_date) >= this.mdate);                            
                            }
                            if(this.mdate != '' && this.selectedOptions.length == 0){
                                const da = new Date(i.Manufacture_date)
                                if(da >= this.mdate){
                                    c.push(i);
                                }
                            }
                            if(this.selectedOptions.length != 0 && this.mdate == ''){ 
                                for (const j of this.selectedOptions){
                                    c = this.insert(j,i,c)
                                }
                            }
                        }
                    }
                }
                return c;
            }
        },
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

    methods: {
        insert(l,m,lis){
            if(l == 'l20'){
                if(m.Rate_per_unit <= 20){
                    lis.push(m);
                }
            }
            if(l == '21to50'){
                if(m.Rate_per_unit <= 50 && m.Rate_per_unit >= 21){
                    lis.push(m);
                }
            }
            if(l == '51to100'){
                if(m.Rate_per_unit <= 100 && m.Rate_per_unit >= 51){
                    lis.push(m);
                }
            }
            if(l == '101to200'){
                if(m.Rate_per_unit <= 200 && m.Rate_per_unit >= 101){
                    lis.push(m);
                }
            }
            if(l == '201to500'){
                if(m.Rate_per_unit <= 500 && m.Rate_per_unit >= 201){
                    lis.push(m);
                }
            }
            if(l == 'g500'){
                if(m.Rate_per_unit >= 500){
                    lis.push();
                }
            }
            return lis
        },
        set_ser(a){
            this.ser = a;
            this.search_mo = false;
        },
        toggleFilterColumn() {
            this.isFilterCollapsed = !this.isFilterCollapsed;
        },
        get_class(b){
            if (b == this.ser){
                return 'nav-link active'
            }
            else{
                return 'nav-link'
            }
        },
        rateProduct(rating) {
            this.productRating = rating;
        },
        clear_rev(){
            this.productRating = 0;
            this.rev = '';
        },
        async Carting(id){
            if(!this.role){
                this.$router.push('/loginUser')
            }
            else if(this.role == 'admin'){
                alert('This action is restricted for admin.')
            }
            else if(this.role == 's_man'){
                alert('This action is restricted for store manager.')
            }
            else if(this.role == 'user'){
                const res = await fetch(`/api/basketing/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                })
                if (res.status == 500){
                    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                    liveToast.show();
                }
                else if (res.status == 201){
                    const liveToast = new bootstrap.Toast(document.getElementById('liveToast2'));
                    liveToast.show();
                    this.productRating = 0;
                    this.rev = '';
                }
                else if (res.status == 200){
                    const liveToast = new bootstrap.Toast(document.getElementById('liveToast3'));
                    liveToast.show();
                    this.productRating = 0;
                    this.rev = '';
                }
                else if (res.status == 401){
                    alert('Error! Unauthorized access')
                    this.productRating = 0;
                    this.rev = '';
                }
                else if (res.status == 403){
                    alert('You are not authorized.')
                    localStorage.clear()
                }
            }
        },
        async rev_sub(id){
            if(!this.role){
                this.$router.push('/loginUser')
                window.location.reload()
            }
            else{
                const review = {
                    Stars: this.productRating,
                    Review: this.rev,
                }; 
                const res = await fetch(`/api/rating/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token'),                        
                    },
                    body: JSON.stringify(review),
                })
                if (res.status == 500){
                    alert('Error! Review not shared')
                }
                else if (res.status == 201){    
                    window.location.reload()
                }
                else if (res.status == 401){
                    alert('Error! Unauthorized access') 
                }
                else if (res.status == 403){
                    alert('You are not authorized.')
                    localStorage.clear()
                }
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
            const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
            liveToast.show();
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