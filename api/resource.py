from flask_restful import Api, Resource, fields, marshal
from flask import request, jsonify
from flask_security import auth_required, current_user, roles_accepted

api = Api(prefix="/api")

# All categories
class Role(fields.Raw):
    def format(self, role):
        return role.name

user_res_fields = {
    "username": fields.String,
    "email": fields.String,
    "role": Role,
}

def rol():
    if "S_man" in current_user.roles:
        return 's_man'
    if 'Admin' in current_user.roles:
        return 'admin'
    if 'User' in current_user.roles:
        return 'user'
    
class User(Resource):
    @auth_required('token')
    def get(self):
        # print(request.headers)
        u = {
            'username': current_user.username,
            'email': current_user.email,
            'r': rol()
        }
        return (u), 201
        # return marshal(current_user, user_res_fields)

api.add_resource(User, '/users')

