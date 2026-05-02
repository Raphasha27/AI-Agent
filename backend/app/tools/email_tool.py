"""
Email Tool – sends emails via SMTP (or SendGrid in production).
"""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(
    to: List[str],
    subject: str,
    body: str,
    html: Optional[str] = None,
    from_addr: Optional[str] = None,
) -> dict:
    """
    Send an email via SMTP.

    Args:
        to:        List of recipient email addresses.
        subject:   Email subject line.
        body:      Plain-text body.
        html:      Optional HTML body.
        from_addr: Sender address (defaults to settings).

    Returns:
        dict with keys: success (bool), message (str)
    """
    smtp_host = getattr(settings, "SMTP_HOST", "localhost")
    smtp_port = int(getattr(settings, "SMTP_PORT", 587))
    smtp_user = getattr(settings, "SMTP_USER", "")
    smtp_pass = getattr(settings, "SMTP_PASS", "")
    sender    = from_addr or smtp_user

    msg = MIMEMultipart("alternative")
    msg["From"]    = sender
    msg["To"]      = ", ".join(to)
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))
    if html:
        msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            if smtp_user and smtp_pass:
                server.login(smtp_user, smtp_pass)
            server.sendmail(sender, to, msg.as_string())

        logger.info("[email_tool] Email sent | to=%s subject=%s", to, subject)
        return {"success": True, "message": "Email sent successfully."}

    except Exception as exc:  # noqa: BLE001
        logger.error("[email_tool] Failed to send email | error=%s", exc)
        return {"success": False, "message": str(exc)}
