from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = '21f1006627@ds.study.iitm.ac.in'
SENDER_PASSWORD = ''


def send_message(to, subject, content_body, attachment_filename):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))
    
    if attachment_filename:
        with open(attachment_filename, 'rb') as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename= {attachment_filename}')
            msg.attach(part)
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.login(SENDER_EMAIL, SENDER_PASSWORD)
    client.send_message(msg=msg)
    client.quit()