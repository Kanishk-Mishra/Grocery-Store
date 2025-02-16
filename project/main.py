#============================================================Imports and configuration=======================================================

from flask import Flask, render_template, jsonify, request, send_file
from flask_restful import fields
from flask_security import Security, auth_required, hash_password, roles_accepted, current_user
import config
from sqlalchemy import or_, func
from api.resource import api
from datetime import datetime
from model import *
from sec import store
from worker import celery_init_app
import flask_excel as excel
from celery.result import AsyncResult
from tasks import create_resource_csv
from celery.schedules import crontab
from tasks import daily_reminder
from tasks import monthly_report
from instances import cache
from time import perf_counter_ns
from collections import defaultdict

def create_app():
    app = Flask(__name__)
    api.init_app(app)
    app.config.from_object(config)
    db.init_app(app)
    app.security = Security(app, store)
    excel.init_excel(app)
    cache.init_app(app)
    return app

app = create_app()
celery_app = celery_init_app(app)

#================================================================Scheduled & Async Jobs=======================================================

#Async Jobs: Downloading CSV
@app.get('/download-csv')
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404

#Scheduled Jobs: Sending Mails
@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=17, minute=00),
        daily_reminder.s('21f1006627@ds.study.iitm.ac.in', "Isse sasta nahi milega!! Visit GroceryStore now"),
    )
    sender.add_periodic_task(
        crontab(hour=8, minute=00, day_of_month=1),
        monthly_report.s('21f1006627@ds.study.iitm.ac.in', "GroceryStore | Monthly Expenditure Report"),
    )

#====================================================================primary apis==============================================================

@app.get('/')
def home():
    return render_template("index.html")

# import re
# def is_valid_email(email):
#     pattern = r'^\S+@\S+\.\S+$'
#     return re.match(pattern, email)

# Define the user signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        # Extract user registration data from the request JSON
        data = request.get_json()

        # Check if the user already exists (based on email or username)
        existing_user = store.find_user(email=data['email']) or store.find_user(username=data['username'])

        if existing_user:
            return jsonify({'message': 'Username/Email already taken'}), 400

        # Hash the password for security
        hashed_password = hash_password(data['password'])

        # Create a new user with the provided data
        new_user = store.create_user(
            username=data['username'],
            email=data['email'],
            password=hashed_password
        )

        role = 'User'
        if data['role'] == "s_man":
            role = 'S_man'
            new_user.active = False

        # Assign a default role (e.g., 'User') to the new user
        store.add_role_to_user(new_user, role)

        # Commit changes to the database
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

#==========================================================================Admin's (and shared) apis=======================================================

# All categories
class Creator(fields.Raw):
    def format(self, user):
        return user.email
    
@app.route('/api/all_categories', methods = ['GET'])
@auth_required('token')
@roles_accepted('Admin','S_man')
@cache.cached(timeout=50)
def all_categories():
    try:
        start=perf_counter_ns()
        if "S_man" in current_user.roles:
            categories = Category.query.filter(or_(Category.Request.in_([0, 3]), Category.creator == current_user)).all()
            
            def me(x):
                i = 'No'
                if x == current_user.email:
                    i = 'Yes'
                return i
            
            cate_data =[{
                'C_id': cate.C_id,
                'Name': cate.Name,
                'Me': me(cate.creator.email),
                '_C_id': cate._C_id,
                'Request': cate.Request}for cate in categories]
            return jsonify(cate_data), 201      
        
        elif "Admin" in current_user.roles:
            categories = Category.query.filter(Category.Request.in_([0, 3])).all()
            cate_data =[{
                'C_id': cate.C_id,
                'Name': cate.Name,
                'Creator': cate.creator.email}for cate in categories]
            return jsonify(cate_data), 201
            # return marshal(categories, cate_data_fields), 201
        stop=perf_counter_ns()
        print("Time taken", stop-start)

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

# Add a Category
@app.route('/api/add_category', methods=['POST'])
@auth_required('token')
@roles_accepted('Admin','S_man')
def add_category():
    try:
        # print(current_user.id)
        if "Admin" in current_user.roles: 
            data = request.get_json()
            c_name = data['c_name']     
            s1 = Category(Name = c_name, Request = 0, creator_id = current_user.id)
            db.session.add(s1)
            db.session.commit()
            with app.test_request_context():
                cache.clear()
            return jsonify({'message': 'Category added successfully'}), 201
        
        elif "S_man" in current_user.roles: 
            data = request.get_json()
            c_name = data['c_name']        
            s2 = Category(Name = c_name, Request = 1, creator_id = current_user.id)
            db.session.add(s2)
            db.session.commit()
            with app.test_request_context():
                cache.clear()
            return jsonify({'message': 'Category addison requested'}), 201
        
        else:
            return jsonify({'message': 'Roles mismatch'}), 401

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Update a Category
@app.route('/api/upd_category/<int:id>', methods=['POST'])
@auth_required('token')
@roles_accepted('Admin', 'S_man')
def upd_categories(id):
    try:
        if "Admin" in current_user.roles:
            c = Category.query.get(id)
            data = request.get_json()
            c.Name = data['c_name']           
            db.session.commit()
            with app.test_request_context():
                cache.clear()
            return jsonify({'message': 'Category updated successfully'}), 201
        
        if "S_man" in current_user.roles:
            data = request.get_json()
            c_name = data['c_name']           
            s1 = Category(Name = c_name, Request = 2, creator_id = current_user.id, _C_id = int(id))
            db.session.add(s1)
            db.session.commit()
            with app.test_request_context():
                cache.clear()
            return jsonify({'message': 'Category updation requested'}), 201
        
        else:
            return jsonify({'message': 'Roles mismatch'}), 401

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Delete a Category
@app.route('/api/del_category/<int:id>', methods=['GET','POST'])
@auth_required('token')
@roles_accepted('Admin', 'S_man')
def del_category(id):
    try:  
        if "Admin" in current_user.roles:  
            c = Category.query.get(id)
            b = Category.query.filter_by(_C_id = int(id)).all()
            if b:
                for i in b:
                    db.session.delete(i)
                    db.session.commit()
            db.session.delete(c)
            db.session.commit()
            with app.test_request_context():
                cache.clear()
            return jsonify({'message': 'Category deleted successfully'}), 201
    
        if "S_man" in current_user.roles:
            c = Category.query.get(id)
            c.Request = 3
            c._C_id = c.C_id
            db.session.commit()
            with app.test_request_context():
                cache.clear()
            return jsonify({'message': 'Category deletion requested'}), 201
        
        else:
            return jsonify({'message': 'Roles mismatch'}), 401

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Pending Requests- Categories' Updations
@app.route('/api/categories', methods=['GET'])
@auth_required('token')
@roles_accepted('Admin')
@cache.cached(timeout=50)
def categories():
    try:
        start=perf_counter_ns()
        categories = Category.query.filter(Category.Request.in_([1, 2, 3])).all() 
        cate_data =[
            {'C_id': cate.C_id,
            'Name': cate.Name,
            '_C_id': cate._C_id,
            'Request': cate.Request,
            'Creator': cate.creator.email
            }for cate in categories
            ]
        stop=perf_counter_ns()
        print("Time taken", stop-start)
        return jsonify(cate_data), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

# Categories' Updations Approval
@app.route('/api/app_cate/<int:id>', methods=['GET', 'POST'])
@auth_required('token')
@roles_accepted('Admin')
def app_cate(id):
    try:    
        a = Category.query.get(id)
        if a.Request == 1:
            a.Request = 0
            db.session.commit()
        if a.Request == 2:
            c = Category.query.get(int(a._C_id))
            c.Name = a.Name
            db.session.delete(a)
            db.session.commit()
        if a.Request == 3:
            c = Category.query.filter_by(_C_id = a.C_id).all()
            if c:
                for i in c:
                    db.session.delete(i)
                    db.session.commit()
            db.session.delete(a)
            db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Category Updations approved'}), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
        
# Categories' Updations Refusal
@app.route('/api/ref_cate/<int:id>', methods=['GET', 'POST'])
@auth_required('token')
@roles_accepted('Admin')
def ref_cate(id):
    try:    
        a = Category.query.get(id)
        if a.Request == 1 or a.Request == 2:
            db.session.delete(a)
            db.session.commit()
        elif a.Request == 3:
            a.Request = 0
            db.session.commit()
        
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Category Updations refused'}), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500  

# Store Manager Approval
@app.route('/api/app_sman/<int:id>', methods=['GET', 'POST'])
@auth_required('token')
@roles_accepted('Admin')
def app_sman(id):
    try:    
        u = User.query.get(id)
        u.active = True
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Store Manger approved'}), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Store Manager Refusal
@app.route('/api/ref_sman/<int:id>', methods=['GET', 'POST'])
@auth_required('token')
@roles_accepted('Admin')
def ref_sman(id):
    try:    
        u = User.query.get(id)
        db.session.delete(u)
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Store Manger refused'}), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

# All Store Managers
@app.route('/api/all_sman', methods = ['GET'])
@auth_required('token')
@roles_accepted('Admin')
@cache.cached(timeout=50)
def all_sman():
    try:
        start=perf_counter_ns()
        # mans = User.query.all()
        s_man_role = Role.query.filter_by(name='S_man').first()

        if s_man_role:
            s_mans = (
                db.session.query(User)
                .join(User.roles)
                .filter(Role.id == s_man_role.id)
                .all()
            )
        man_data =[
            {
                'id': s.id,
                'username': s.username,
                'email': s.email,
                'active': s.active,
                }for s in s_mans
        ]
        stop=perf_counter_ns()
        print("Time taken", stop-start)
        return jsonify(man_data), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

# Remove a Store Manager
@app.route('/api/rem_sman/<int:id>', methods=['GET','POST'])
@auth_required('token')
@roles_accepted('Admin')
def rem_sman(id):
    try:    
        u = User.query.get(id)
        db.session.delete(u)
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Store Manager removed'}), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

def get_category(id):
    category = Category.query.get(id)
    return category.Name

# Progress Bars
@app.route('/api/graph', methods=['GET'])
@auth_required('token')
@roles_accepted('Admin')
def graph():
    try:
        products = Product.query.all()
        sales_data = defaultdict(int)
        total_sales = 0
        for product in products:
            total_sales += product.Sales
            sales_data[get_category(product.C_id)] += product.Sales

        if total_sales != 0:    
            for key in sales_data:
                sales_data[key] = round(sales_data[key] / total_sales * 100,2)

        return jsonify(sales_data), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

#===================================================================Store Mannager's (and shared) apis=======================================================


# All Products
@app.route('/api/all_products', methods = ['GET'])
@cache.cached(timeout=50)
def all_products():
    try:
        start=perf_counter_ns()
        products = Product.query.all()
        categories = Category.query.all()
        
        def catego(id):
            if id:
                c = Category.query.get(id)
                return c.Name
            else:
                None

        def rating(id):
            r = Rate.query.filter_by(P_id = id).all()
            if len(r) == 0:
                return 0
            else:
                sum = 0
                for i in r:
                    sum = sum + i.Stars
                return (sum/len(r))


        data ={
            'prod': [{
                'P_id': cate.P_id,
                'Name': cate.Name,
                'Description': cate.Description,
                'Manufacture_date': cate.Manufacture_date,
                'Expiry_date': cate.Expiry_date,
                'Rate_per_unit': cate.Rate_per_unit,
                'Inventory':cate.Inventory,
                'Img_link': cate.Img_link,
                'Category': catego(cate.C_id),
                'categ_id': cate.C_id,
                'Ratings': rating(cate.P_id),}for cate in products
            ],

            'cate': [{
                'C_id': cate.C_id,
                'Name': cate.Name,
                }for cate in categories
            ],
        }
        stop=perf_counter_ns()
        print("Time taken", stop-start)
        return jsonify(data), 201      

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Create Products
@app.route('/api/create_product', methods=['POST'])
@auth_required('token')
@roles_accepted('S_man')
def create_product():
    try:
        data = request.get_json()

        # Extract product details from the request
        product_name = data.get('name')
        description = data.get('desc')
        manufacture_date = datetime.strptime(data.get('mfg'), '%Y-%m-%dT%H:%M')
        expiry_date = datetime.strptime(data.get('exp'), '%Y-%m-%dT%H:%M')
        rate_per_unit = data.get('mrp')
        inventory = data.get('inventory')
        img_link = data.get('ilink')
        c_id = data.get('c_id')  # Assuming you provide the category_id

        # Create the product
        new_product = Product(
            Name=product_name,
            Description=description,
            Manufacture_date=manufacture_date,
            Expiry_date=expiry_date,
            Rate_per_unit=rate_per_unit,
            Inventory=inventory,
            Img_link=img_link,
            C_id=c_id,
            Sales = 0
        )

        # Save the product to the database
        db.session.add(new_product)
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Product created successfully'})
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Update Products
@app.route('/api/upd_product/<int:id>', methods=['POST'])
@auth_required('token')
@roles_accepted('S_man')
def upd_product(id):
    try:
        p = Product.query.get(id)
        data = request.get_json()

        p.Name = data.get('name')
        p.Description = data.get('desc')
        p.Manufacture_date = datetime.strptime(data.get('mfg'), '%Y-%m-%dT%H:%M')
        p.Expiry_date = datetime.strptime(data.get('exp'), '%Y-%m-%dT%H:%M')
        p.Rate_per_unit = data.get('mrp')
        p.Inventory = data.get('inventory')
        p.Img_link = data.get('ilink')
        p.C_id = data.get('c_id')          
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Product updated successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Delete Products
@app.route('/api/del_product/<int:id>', methods=['GET', 'POST'])
@auth_required('token')
@roles_accepted('S_man')
def del_product(id):
    try:
        p = Product.query.get(id)
        db.session.delete(p)          
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Product deleted successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

#===================================================================Users's (and shared) apis=======================================================

#Rating a product
@app.route('/api/rating/<int:id>', methods=['POST','GET'])
@auth_required('token')
@roles_accepted('User')
def rating(id):
    try:
        data = request.get_json()
        new_ratings = Rate(U_id= int(current_user.id), P_id=int(id), Rater=current_user.username, Review=data['Review'], Stars=int(data['Stars']))
        old_ratings = Rate.query.filter_by(U_id = current_user.id, P_id=int(id)).first()
        if old_ratings:
            db.session.delete(old_ratings)
        db.session.add(new_ratings)
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Product rated'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

# Basketing
@app.route('/api/basketing/<int:id>', methods=['POST','GET'])
@auth_required('token')
@roles_accepted('User')
def basket(id):
    try:
        if "User" in current_user.roles:
            new_purchase = Purchase(U_id=current_user.id, P_id=int(id), Basket=1, Quantity=1)
            old_purchase = Purchase.query.filter_by(Basket = 1, U_id = current_user.id, P_id=int(id)).first()
            if old_purchase:
                return jsonify({'message': 'Product already added'}), 200
            else:
                db.session.add(new_purchase)
                db.session.commit()
            with app.test_request_context():
                cache.clear()                
            return jsonify({'message': 'Product added successfully'}), 201
        
        else:            
            return jsonify({'message': 'Unauthorized access!', 'error': str(e)}), 401
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# All Purchase items
@app.route('/api/pur_items', methods=['POST','GET'])
@auth_required('token')
@roles_accepted('User')
@cache.cached(timeout=50)
def pur_items():
    try:
        start=perf_counter_ns()
        pur_items = Purchase.query.filter_by(U_id = int(current_user.id)).all()

        def produ(id):
            if id:
                p = Product.query.get(id)
                return [p.Name, p.Rate_per_unit, p.Img_link]
            else:
                return ['','','']

        data = [{
                'P_id': pur.P_id,
                'Name':(produ(pur.P_id))[0],
                'B_id': pur.B_id,         
                'Mrp': (produ(pur.P_id))[1],
                'Basket':pur.Basket,
                'Quantity': pur.Quantity,
                'Img_link': (produ(pur.P_id))[2],}for pur in pur_items]
        
        stop=perf_counter_ns()
        print("Time taken", stop-start)
        return jsonify(data), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

# Removing basketed item
@app.route('/api/rem_bask_item/<int:id>', methods=['POST','GET'])
@auth_required('token')
@roles_accepted('User')
def rem_bask_item(id):
    try:
        b = Purchase.query.get(id)
        db.session.delete(b)          
        db.session.commit()
        with app.test_request_context():
                cache.clear()
        return jsonify({'message': 'Product removed from the basket'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
# Finally Purchasing the items
@app.route('/api/purchase', methods=['POST'])
@auth_required('token')
@roles_accepted('User')
def purchase():
    try:
        if "User" in current_user.roles:
            data = request.get_json()

            if len(data) == 0:
                return jsonify({'message': 'Empty data provided!'}), 400           

            for item in data:
                basket_item = Purchase.query.filter_by(Basket=1, U_id=current_user.id, P_id=int(item['P_id'])).first()
                product = Product.query.get(int(item['P_id']))
                requested_quantity = int(item['Quantity'])

                if product.Inventory < requested_quantity:
                    return jsonify({'message': f'Provided quantity is not avlaible for {product.Name}. Please try with a lesser amount.'}), 200

                # Update inventory and purchase details
                product.Inventory -= requested_quantity
                product.Sales += requested_quantity
                basket_item.Basket = 0
                basket_item.Quantity = requested_quantity

                db.session.commit()
                with app.test_request_context():
                    cache.clear()
        else:            
            return jsonify({'message': 'Unauthorized access!', 'error': str(e)}), 401

        return jsonify({'message': 'Products bought successfully!'}), 201

    except Exception as e:
        db.session.rollback()  # Rollback changes in case of an exception
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500
    
#=======================================================================General apis================================================================

# Search
@app.route('/api/search', methods = ['GET', 'POST'])
def search():
    try:    
        data = request.get_json()
        
        search_term = data['sear']
        c_query = Category.query.filter(func.lower(Category.Name).like(f"%{search_term.lower()}%")).first()
        p_query = Product.query.filter(func.lower(Product.Name).like(f"%{search_term.lower()}%")).all()

        if c_query:
            return jsonify({'ser_result': c_query.Name, 'kind': 'section', 'qword': search_term}), 201
        
        elif p_query:
            s = [p.Name for p in p_query]
            return jsonify({'ser_result': s, 'kind': 'item', 'qword': search_term}), 201
        
        else:
            return jsonify({'ser_result': 'No', 'kind': 'No', 'qword': search_term}), 201
    
    except Exception as e:
        return jsonify({'message': 'An error occurred!', 'error': str(e)}), 500

#================================================================Configuration & debugging==============================================================  

if __name__ == '__main__':
    app.run(debug=True)