#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-off outreach mailer.

Triggered by .github/workflows/outreach-mail.yml (workflow_dispatch).
Secrets: QQ_USER / QQ_AUTH (QQ SMTP 授权码).
Recipient / subject / body come from workflow inputs.

Gated by repo write access: only dispatchers can send.
"""
import os
import sys
import ssl
import smtplib
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr

QQ_USER = (os.environ.get("QQ_USER") or "").strip()
QQ_AUTH = (os.environ.get("QQ_AUTH") or "").strip()
TO = (os.environ.get("TO") or "").strip()
SUBJECT = (os.environ.get("SUBJECT") or "").strip()
BODY = os.environ.get("BODY") or ""
REPLY_TO = (os.environ.get("REPLY_TO") or "").strip()

if not (QQ_USER and QQ_AUTH):
    print("[skip] QQ_USER / QQ_AUTH not configured.")
    sys.exit(0)
if not (TO and SUBJECT and BODY):
    print("[error] TO / SUBJECT / BODY are required.")
    sys.exit(1)

msg = MIMEText(BODY, "plain", "utf-8")
msg["Subject"] = Header(SUBJECT, "utf-8")
msg["From"] = formataddr(("ORIGIN", QQ_USER))
msg["To"] = TO
if REPLY_TO:
    msg["Reply-To"] = REPLY_TO

ctx = ssl.create_default_context()
with smtplib.SMTP_SSL("smtp.qq.com", 465, context=ctx) as s:
    s.login(QQ_USER, QQ_AUTH)
    s.sendmail(QQ_USER, [TO], msg.as_string())

print("[sent] to=%s subject=%r" % (TO, SUBJECT))
