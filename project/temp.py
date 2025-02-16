from model import db, User as u_model
from main import app
from sec import store
from flask_security import hash_password

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        if not store.find_role('Admin'):
            store.create_role(name = 'Admin', description = 'Admin Role')
            db.session.commit()
        if not store.find_role('User'):
            store.create_role(name='User', description='User Role')
            db.session.commit()
        if not store.find_role('S_man'):
            store.create_role(name='S_man', description='Store Manager')
            db.session.commit()


        if not store.find_user(email='user@email.com'):
            new_user = store.create_user(username = 'user', email = 'user@email.com', password = hash_password('1234'))
            store.add_role_to_user(new_user, 'User')
            db.session.commit()
        if not store.find_user(email="admin@email.com"):
            new_admin = store.create_user(username = 'admin', email = 'admin@email.com', password = hash_password('1234'))
            store.add_role_to_user(new_admin, 'Admin')
            db.session.commit()
        if not store.find_user(email="s_man@email.com"):
            new_sman = store.create_user(username = 's_man', email = 's_man@email.com', password = hash_password('1234'), active = False)
            store.add_role_to_user(new_sman, 'S_man')
            db.session.commit()

        
        # new_user = store.create_user(username = 'user2', email = 'user2@gmail.com', password = hash_password('1234'))
        # store.add_role_to_user(new_user, 'User')
        # db.session.commit()

        # new_user = store.create_user(username = 'user', email = 'user3@gmail.com', password = hash_password('1234'))
        # store.add_role_to_user(new_user, 'User')
        # db.session.commit()