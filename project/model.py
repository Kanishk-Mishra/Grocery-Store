from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()
   
roles_users = db.Table('roles_users', db.Column('user_id', db.Integer(), db.ForeignKey('user.id')), db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(), unique = False)
    email =  db.Column(db.String, unique = True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary = roles_users, backref = db.backref('users', lazy = 'dynamic'))
    buyings = db.relationship('Product', backref = 'customer', secondary = 'purchase')
    section = db.relationship('Category', backref = 'creator')
    
    def get_id(self):
        return str(self.id)
    
    def __repr__(self):
        return (self.username)
    
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique = True)
    description = db.Column(db.String(255))
    def __repr__(self):
        return (self.name)

class Category(db.Model):
    C_id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(50), nullable=False)
    _C_id = db.Column(db.Integer, nullable=True)
    Request = db.Column(db.Integer, nullable = False)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    wares = db.relationship('Product', backref = 'section', lazy='dynamic')

    def __repr__(self):
        return f"<Category {self.Name}>"
    
class Product(db.Model):
    P_id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(50), nullable = False)
    Description = db.Column(db.String(255))
    Manufacture_date = db.Column(db.DateTime, nullable=False)
    Expiry_date = db.Column(db.DateTime, nullable=False)
    Rate_per_unit = db.Column(db.Float, nullable=False)
    Inventory = db.Column(db.Integer, nullable=False)
    Img_link = db.Column(db.String(), nullable=True)
    C_id = db.Column(db.Integer, db.ForeignKey("category.C_id"), nullable=True)
    Ratings =  db.relationship('Rate', backref = 'product', lazy='dynamic') 
    Sales = db.Column(db.Integer, nullable=True)
       
    def __repr__(self):
        return f"<Product {self.Name}>"

class Purchase(db.Model):
    B_id = db.Column(db.Integer, primary_key = True)
    U_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    P_id = db.Column(db.Integer, db.ForeignKey("product.P_id"))
    Basket = db.Column(db.Integer, nullable = True)
    Quantity = db.Column(db.Integer, nullable = False)

class Rate(db.Model):
    R_id = db.Column(db.Integer, primary_key = True)
    U_id = db.Column(db.Integer)
    Rater = db.Column(db.String())
    P_id = db.Column(db.Integer, db.ForeignKey("product.P_id"))
    Review = db.Column(db.String(255))
    Stars = db.Column(db.Integer, nullable = False)