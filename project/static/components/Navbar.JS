export default {
  template:
    `<nav class="navbar navbar-expand-lg" data-bs-theme="dark" style="background-color: #192841;">
    <div class="container" style="width: 100%;">
        <a class="navbar-brand" href="#">
            <img src="/static/GroceryStore_logo.png" alt="Logo" style="height: 80px; padding-right: 70px">
        </a>

        <form class="d-flex justify-content-center" data-bs-theme="light" role="search" style="width: 45%;">
            <div class="input-group" >
                <input class="form-control" type="search" placeholder="Search" v-model="ser.sear" aria-label="Search">
                <button class="btn btn-outline-success" @click.prevent="search" type="submit" style="color: #fff; border-color: #ff7f00" onmouseover="this.style.backgroundColor='#ff7f00'" onmouseout="this.style.backgroundColor='#192841';">Search</button>
            </div>
        </form>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >
        <span class="navbar-toggler-icon">
        <i class="fa fa-navicon" style="color:#fff; font-size:28px;"></i>
        </span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item" v-show="role == 'user' || !role">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
          </li>

          <li class="nav-item dropdown" v-show="(!role || role=='user') && 1==2">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Categories
            </a>
            <ul class="dropdown-menu">
              <li v-for="c in cate"><a class="dropdown-item" @click.prevent="search_by_cate(c.Name)" href="#">{{c.Name}}</a></li>
            </ul>
          </li>

          <li class="nav-item" v-show="role == 'admin'">
            <router-link class="nav-link active" aria-current="page" to="/admin">Home</router-link>
          </li>

          <li class="nav-item" v-show="role == 's_man'">
            <router-link class="nav-link active" aria-current="page" to="/s_man">Home</router-link>
          </li>

          <li class="nav-item" v-show="!role">
            <router-link to="/loginUser" class="nav-link">Login</router-link>
          </li>

          </li>
          <li class="nav-item" v-show="!role">
            <router-link to="/signup" class="nav-link">Signup</router-link>
          </li>

          <li class="nav-item" v-show="(role == 'admin' || role == 's_man')  && !noti">
            <router-link to="/all_categories" class="nav-link">Categories</router-link>
          </li>

          <li class="nav-item" v-show="role == 'admin' && !noti">
            <router-link to="/pending_req" class="nav-link">Requests</router-link>
          </li>

          <li class="nav-item" v-show="role == 'admin' && !noti">
            <router-link to="/all_sman" class="nav-link">Managers</router-link>
          </li>

          <li class="nav-item" v-show="role == 's_man' && !noti">
            <router-link to="/all_products" class="nav-link">Products</router-link>
          </li>

          <li class="nav-item" v-show="role == 'user'">
            <router-link to="/my_ord" class="nav-link">My Orders</router-link>
          </li>

          <li class="nav-item" v-show="role && noti">
            <a class="nav-link disabled" aria-disabled="true">
              Messages
            </a>
          </li>

          <li class="nav-item" v-show="role && noti">
            <a href="#" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-title="Notifications" data-bs-placement="bottom" data-bs-content="No new notifications!">
              <img src="/static/notification.png" alt="Notifications" style="height: 20px; width: 20px; margin-right: 5px; margin-left: 3px; margin-top: 10px;">
            </a>
          </li>

          <li class="nav-item">
            <router-link to="/loginUser" v-show="!role" class="nav-link" aria-disabled="true">
              <img src="/static/basket.png" alt="Basket" style="height: 20px; width: 30px; margin-right: 2px;">
              Cart
            </router-link>
            <router-link to="/basket" v-show="role == 'user'" class="nav-link" aria-disabled="true">
              <img src="/static/basket.png" alt="Basket" style="height: 20px; width: 25px; margin-right: 2px;">
              Cart
            </router-link>
          </li>

          <li class="nav-item dropdown" v-show="role">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img v-show="role == 'admin'" src="/static/admin.png" alt="User Profile" style="height: 30px; width: 30px; border-radius: 50%; margin-right: 3px;">
                <img v-show="role != 'admin'" src="/static/Default_pfp.png" alt="User Profile" style="height: 30px; width: 30px; border-radius: 50%; margin-right: 3px;">
                {{username}}
            </a>
            <!-- Dropdown menu for user profile options -->
            <ul class="dropdown-menu">
                <!-- Options like profile, settings, logout, etc. -->
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    </nav>`,
  data (){
    return{
        role: localStorage.getItem('role'),
        username: '',
        noti: localStorage.getItem('noti'),
        ser: {
          sear: '',
        },
        cate:[],
        len:0
    }
  },
  props:{
    showNavItem: {
      type: Boolean,
      default: false
    }
  },
  async mounted(){
    // console.log(localStorage.getItem('auth-token'))
    if(localStorage.getItem('auth-token')){
      const res = await fetch('/api/users',{
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
        },
      })
    
      if (res.ok){
        const data = await res.json()
        this.username = data.username
      }
      else if (res.status == 500){
        this.flag = 0
        alert('An error occured!')
        this.message = 'An error occured!'
      }
      else if (res.status == 403){
        this.flag = 0
        alert('You are not authorized!')
        this.message = `You are not authorized. Kindly re-login as a User/Manager or use Admin's credentials`
      }

      // Find all popovers and initialize them within this specific component
      var popoverTriggerList = [].slice.call(this.$el.querySelectorAll('[data-bs-toggle="popover"]'));
      var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
      })
    }


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
        this.len = this.cate.length
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
  methods:{
    async logout(){
      const res = await fetch('/logout')
      if (res.ok){
        localStorage.clear()
        this.$router.push('/loginUser')
      }
      else{
        this.flag = 0;
        console.log('could not logout the user')
        alert('Logout failed. Please try later')
        this.message='An error occured'
      }
    },
    async search(){
      const res = await fetch('/api/search', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.ser),
      })

      if (res.status == 500){
        alert('Error!')
        var data = await res.json()
        this.flag = 0
        this.message = data.message
      }
      else if (res.status == 201){
        var data = await res.json()
        // console.log(data)
        // this.$root.$emit('datafromnav', data)
        // this.$store.commit('setReceivedData', data);
        const jsonString = JSON.stringify(data);
        if(this.role == 's_man'){
          localStorage.setItem('myData', jsonString)
          this.$router.push('/ser_p')
          window.location.reload()
        }
        if(this.role == 'user'){
          localStorage.setItem('myData', jsonString)
          this.$router.push('/gen_ser')
          window.location.reload()
        }
        if(!this.role){
          localStorage.setItem('myData', jsonString)
          this.$router.push('/gen_ser')
          window.location.reload()
        }
        if(this.role == 'admin'){alert('Product search not allowed!')}
        if(!this.role){this.$router.push('/')}
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
}
