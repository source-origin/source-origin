#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
board-notify · 留言板新信号 → QQ 邮箱
由 .github/workflows/board-notify.yml 触发。
凭证来自 repo secrets：QQ_USER / QQ_AUTH / MAIL_TO
设置方法（QQ 邮箱 → 设置 → 账户 → 开启 SMTP → 生成授权码）
"""
import os, re, ssl, smtplib, sys, json
from datetime import datetime, timezone
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr

QQ_USER = (os.environ.get("QQ_USER") or "").strip()
QQ_AUTH = (os.environ.get("QQ_AUTH") or "").strip()
MAIL_TO = (os.environ.get("MAIL_TO") or QQ_USER).strip()

if not (QQ_USER and QQ_AUTH):
    print("[skip] QQ_USER / QQ_AUTH 未配置 —— 请在 repo Settings > Secrets and variables > Actions 添加。")
    sys.exit(0)

EV = os.environ.get("EV", "")
NUM = os.environ.get("ISSUE_NUM", "")
TITLE = os.environ.get("ISSUE_TITLE", "")
URL = os.environ.get("ISSUE_URL", "")
AUTHOR = os.environ.get("ISSUE_AUTHOR", "")
BODY = os.environ.get("ISSUE_BODY", "") or ""
C_BODY = os.environ.get("COMMENT_BODY", "") or ""
C_AUTHOR = os.environ.get("COMMENT_AUTHOR", "")
C_URL = os.environ.get("COMMENT_URL", "")

# --- 事件去重 -------------------------------------------------------------
# 带 label 创建 issue 时，GitHub 会同时派发 opened 与 labeled 两个事件，
# 若都处理会重复发信。这里读默认注入的事件 payload，对「刚创建」的 labeled
# 事件直接跳过（opened 已负责通知）；只有事后补标签（issue 已存在一段时间）
# 的 labeled 事件才发信。
ACTION = ""
CREATED_AT = ""
try:
    _ev_path = os.environ.get("GITHUB_EVENT_PATH", "")
    if _ev_path and os.path.exists(_ev_path):
        with open(_ev_path, "r", encoding="utf-8") as _f:
            _pl = json.load(_f) or {}
        ACTION = _pl.get("action", "") or ""
        CREATED_AT = ((_pl.get("issue") or {}).get("created_at")) or ""
except Exception:
    pass


def _is_create_burst_label():
    """判断是否为「创建 issue 时随带标签」触发的 labeled 事件。"""
    if EV != "issues" or ACTION != "labeled" or not CREATED_AT:
        return False
    try:
        t = datetime.strptime(CREATED_AT, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        return (datetime.now(timezone.utc) - t).total_seconds() < 180
    except Exception:
        return False


if _is_create_burst_label():
    print("[skip] labeled 事件与 opened 重复（issue 刚创建）—— 不重复发信")
    sys.exit(0)

MARK = "<!--origin-board-->"


def nick(text):
    m = re.search(r"昵称：\s*([^\n<]+)", text or "")
    return m.group(1).strip() if m else ""


def main_text(text):
    return (text or "").split(MARK)[0].rstrip()


def row(label, value):
    if not value:
        return ""
    return (
        '<tr><td style="padding:6px 12px;color:#8899bb;font-size:13px;white-space:nowrap">'
        + label
        + '</td><td style="padding:6px 12px;color:#e8eaf0;font-size:14px">'
        + value
        + "</td></tr>"
    )


if EV == "issue_comment":
    who = nick("") or ("@" + C_AUTHOR if C_AUTHOR else "匿名")
    subject = "[源·ORIGIN 留言板] 新回复 · " + (TITLE or ("#" + NUM))
    heading = "💬 留言板新回复"
    content = C_BODY
    link = C_URL or URL
else:
    who = nick(BODY) or ("@" + AUTHOR if AUTHOR else "匿名信号")
    subject = "[源·ORIGIN 留言板] 新留言 · " + (TITLE or ("#" + NUM))
    heading = "🚀 留言板新信号"
    content = main_text(BODY) or TITLE
    link = URL

safe = lambda s: (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

html = (
    '<div style="background:#05060d;padding:24px;font-family:-apple-system,Segoe UI,Roboto,sans-serif">'
    '<div style="max-width:640px;margin:0 auto;background:#0a1122;border:1px solid rgba(0,212,255,.18);border-radius:14px;overflow:hidden">'
    '<div style="padding:18px 22px;border-bottom:1px solid rgba(240,185,11,.25)">'
    '<div style="color:#f0b90b;font-size:16px;font-weight:700">' + heading + '</div>'
    '<div style="color:#556688;font-size:12px;margin-top:4px">源·ORIGIN · Dev Command 留言板</div>'
    "</div>"
    '<table style="width:100%;border-collapse:collapse">'
    + row("留言者", safe(who))
    + row("标题", safe(TITLE))
    + row("GitHub", '@<a style="color:#00d4ff;text-decoration:none" href="https://github.com/' + safe(AUTHOR) + '">' + safe(AUTHOR) + "</a>")
    + row("链接", '<a style="color:#00d4ff;text-decoration:none" href="' + safe(link) + '">' + safe(link) + "</a>")
    + "</table>"
    '<div style="padding:14px 22px;border-top:1px solid rgba(0,212,255,.12)">'
    '<div style="color:#8899bb;font-size:13px;line-height:1.8;white-space:pre-wrap">'
    + safe(content) + "</div></div>"
    '<div style="padding:12px 22px;background:#070c18;color:#556688;font-size:11px">'
    "此邮件由 GitHub Actions 自动发送 · 回复请直接打开上面的链接</div>"
    "</div></div>"
)

text = (
    heading + "\n\n留言者：" + who + "\n标题：" + TITLE + "\n链接：" + link + "\n\n" + content + "\n"
)

msg = MIMEText(html, "html", "utf-8")
msg["Subject"] = Header(subject, "utf-8")
msg["From"] = formataddr((str(Header("源·ORIGIN 留言板", "utf-8")), QQ_USER))
msg["To"] = MAIL_TO
msg["X-ORIGIN-Board"] = "1"

sent = False
try:
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.qq.com", 465, context=ctx, timeout=25) as s:
        s.login(QQ_USER, QQ_AUTH)
        s.sendmail(QQ_USER, [MAIL_TO], msg.as_string())
    sent = True
except Exception as e1:
    print("[warn] 465/SSL 失败: " + str(e1))
    try:
        with smtplib.SMTP("smtp.qq.com", 587, timeout=25) as s:
            s.starttls(context=ssl.create_default_context())
            s.login(QQ_USER, QQ_AUTH)
            s.sendmail(QQ_USER, [MAIL_TO], msg.as_string())
        sent = True
    except Exception as e2:
        print("[error] 587/STARTTLS 失败: " + str(e2))

print("[ok] 已发送到 " + MAIL_TO if sent else "[fail] 邮件未发送")
sys.exit(0 if sent else 1)
