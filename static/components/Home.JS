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

                <div class="container" style="max-width: 1530px">
                    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                        <div class="carousel-item active" data-bs-interval="3000">
                            <img src="/static/Ad1.png" class="d-block w-100" alt="Ad1">
                        </div>
                        <div class="carousel-item" data-bs-interval="3000">
                            <img src="/static/Ad2.png" class="d-block w-100" alt="Ad2">
                        </div>
                        <div class="carousel-item" data-bs-interval="4000">
                            <img src="/static/Ad3.png" class="d-block w-100" alt="Ad3">
                        </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>


                <div class="container"  style="margin-top: 10px;">
                    <ul class="nav nav-tabs nav-fill" style="color: #000">
                        <li class="nav-item" style="color: #000">
                            <a @click.prevent="set_ser('all')" :class="get_class('all')" aria-current="page" href="/">All</a>
                        </li>
                        <li class="nav-item" v-for="c in cate2" style="color: #000">
                            <a @click.prevent="set_ser(c.Name)" :class="get_class(c.Name)" aria-current="page" href="/">{{c.Name}}</a>
                        </li>
                        <li class="nav-item dropdown" style="color: #000">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                More
                            </a>
                            <ul class="dropdown-menu" style="color: #000">
                                <li v-for="c in cate"><a class="dropdown-item" @click.prevent="set_ser(c.Name)" href="#">{{c.Name}}</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>


                <div class="container">
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" style="margin-top: 10px;">
                        <div v-for="p in prod2" class="col">

                            
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
                                            <span class="text-muted">M.R.P.: </span> <span>₹{{ p.Rate_per_unit }}</span>
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
                                            <button @click.prevent="Carting(p.P_id)" data-bs-dismiss="modal" v-show="p.Inventory > 0" class="btn btn-primary">Add to cart</button>
                                            <button @click.prevent="Carting(p.P_id)" data-bs-dismiss="modal" v-show="p.Inventory <= 0" disabled class="btn btn-primary">Unavailable!</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div> 


                <div class="container" style="max-width: 1320px; margin-bottom: 10px;">
                    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active" data-bs-interval="3000">
                                <img src="/static/Ad_2.2.webp" class="d-block w-100" alt="Ad1">
                            </div>
                            <div class="carousel-item" data-bs-interval="3000">
                                <img src="/static/Ad_2.1.webp" class="d-block w-100" alt="Ad2">
                            </div>
                            <div class="carousel-item" data-bs-interval="3000">
                                <img src="/static/Ad_2.3.webp" class="d-block w-100" alt="Ad3">
                            </div>
                            <div class="carousel-item" data-bs-interval="3000">
                                <img src="/static/Ad_2.4.webp" class="d-block w-100" alt="Ad3">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>


                <div class="container justify-content-center">
                    <div style="border-top: 1px solid #ccc; margin: 10px 0; margin-bottom: 10px;max-width: 1300px;"></div>
                </div>

                <div class="container justify-content-center" style="margin-top: 10px; width: 1300px;">
                    <p><strong>GroceryStore- IITM BS online shopping platform</strong>
                    <br><span style="color: #878787">Have you ever imagined having the freshest fruits and vegetables, top-quality pulses and food grains, dairy products, and a wide selection of branded items delivered right to your doorstep with a simple click? Welcome to GroceryStore! In today's fast-paced world, GroceryStore, IITM BS online grocery store, offers an incredible array of over 40,000 products from more than 1,000 trusted brands, delighting over 10 million satisfied customers by delivering directly to their doorsteps. From essential household cleaning products to the latest beauty and makeup trends, GroceryStore is your ultimate one-stop shop for daily needs.</span></p>
                    <p style="color: #878787">We've simplified the stress of daily essential shopping. Now, you can effortlessly order all your household products and groceries online. Our platform offers the convenience of finding everything you need in one place while ensuring significant savings. GroceryStore, IITM BS largest online supermarket, has redefined the grocery shopping experience. Shopping for groceries online has become second nature. And when it comes to freshness, be it fruits and vegetables or dairy and meat, we have you covered! Easily access fresh eggs, meat, fish, and more with just a few clicks.</p>
                    <p style="color: #878787">Operating across 300+ cities and towns in India, we guarantee swift delivery, ensuring that your groceries, snacks, and branded foods reach you on time.</p>
                    <p style="color: #878787">Convenient Delivery Slots: Select the most suitable delivery slot for your groceries, from early morning to late-night options. GroceryStore caters to every schedule.</p>
                    <p style="color: #878787">GSnow Instant Delivery: Responding to the increasing demand for convenience, GSnow by GroceryStore offers lightning-fast grocery delivery, bringing your essentials to your doorstep within 15-30 minutes. Choose from a selection of over 5000 grocery essentials. Please note that GSnow is available only in select cities.</p>
                    <p style="color: #878787">Whether it's a spontaneous dinner party or an urgent need, we've got you covered. This service reflects our commitment to providing not only the widest range of products but also the fastest and most efficient shopping experience, making GroceryStore.com the ultimate destination for all your immediate grocery needs.</p>
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
            item_id: 0,
            productRating: 0,
            rev: '',
            totalStars: 5,
        }
    },

    computed: {
        prod2(){
            if (this.ser == 'all'){
                return this.prod;
            }
            else {
                const c = []
                for (const i of this.prod){
                    if( i.Category == this.ser ){
                        c.push(i);
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
        }
    },

    methods: {
        set_ser(a){
            this.ser = a;
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

    //     async search(){
    //         const res = await fetch('/api/search', {
    //             method: 'post',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(this.ser),
    //         })
      
    //         if (res.status == 500){
    //           alert('Error! Status code 500')
    //         }
    //         else if (res.status == 201){
    //           var data = await res.json()
    //           // console.log(data)
    //           // this.$root.$emit('datafromnav', data)
    //           // this.$store.commit('setReceivedData', data);
    //           const jsonString = JSON.stringify(data);
    //           if(this.role == 's_man'){
    //             localStorage.setItem('myData', jsonString)
    //             this.$router.push('/ser_p')
    //             window.location.reload()
    //           }
    //           if(this.role == 'user'){
    //             localStorage.setItem('myData', jsonString)
    //             this.$router.push('/')
    //             window.location.reload()
    //           }
    //           if(this.role == 'admin'){alert('Product search not allowed!')}
    //           if(!this.role){this.$router.push('/')}
    //         }
    //         else if (res.status == 401){
    //           var data = await res.json()
    //           alert('Error!')
    //           this.flag = 0;
    //           this.message = data.message 
    //         }
    //         else if (res.status == 403){
    //           alert('You are not authorized.')
    //           localStorage.clear()
    //         }
    //       },
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
    },
}