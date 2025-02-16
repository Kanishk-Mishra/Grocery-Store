from celery import shared_task
from model import Product, Purchase
import flask_excel as excel
from mail_service import send_message
from model import User, Role
from jinja2 import Template
from weasyprint import HTML
import uuid


@shared_task(ignore_result=False)
def create_resource_csv():
    prod_res = Product.query.with_entities(Product.Name, Product.Description, Product.Manufacture_date, Product.Expiry_date, Product.Rate_per_unit, Product.Inventory, Product.Sales).all()

    csv_output = excel.make_response_from_query_sets(prod_res, ["Name", "Description", "Manufacture_date", "Expiry_date", "Rate_per_unit", "Inventory", "Sales"], "csv")
    filename = "products.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users_without_purchases = User.query.outerjoin(Purchase).filter(Purchase.B_id == None).all()
    for user in users_without_purchases:
        if 'User' in user.roles:
            with open('test.html', 'r') as f:
                template = Template(f.read())
                send_message(user.email, subject,
                            template.render(username=user.username), None)
    return "OK"

def format_report(template_file, data={}):
    with open(template_file) as file_:
        template = Template(file_.read())
        return template.render(data=data)

def create_pdf_report(data):
    message = format_report("report-template.html", data=data)
    html = HTML(string=message)
    file_name = str(uuid.uuid4()) + ".pdf"
    print(file_name)
    html.write_pdf(target=file_name)
    return(file_name)

@shared_task(ignore_result=True)
def monthly_report(to, subject):
    users_with_purchases = User.query.join(Purchase, Purchase.U_id == User.id).all()
    if users_with_purchases:
        for user in users_with_purchases:
            data = {"buyer": user.username,"purchases": []}
            purchases = Purchase.query.filter_by(U_id = user.id).all()
            for purchase in purchases:
                item = Product.query.get(purchase.P_id)
                purchase_data = {
                    "name": item.Name,
                    "quantity": purchase.Quantity,
                    "mrp": item.Rate_per_unit
                }
                data["purchases"].append(purchase_data)

            with open('report-template.html', 'r') as f:
                template = Template(f.read())
                send_message(user.email, subject,
                            template.render(data = data), create_pdf_report(data))
    return "OK"