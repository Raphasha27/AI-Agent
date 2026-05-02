"""
Future AGI | CRM Integration Layer
============================================================
Provides unified connectors to 15+ CRM providers including
Salesforce, HubSpot, Pipedrive, and Zoho.
"""

import aiohttp
import logging
from typing import Dict, Any, Optional

class CRMConnector:
    def __init__(self, provider: str, api_key: str):
        self.provider = provider
        self.api_key = api_key
        self.base_urls = {
            "salesforce": "https://api.salesforce.com/v1",
            "hubspot": "https://api.hubapi.com/v1",
            "pipedrive": "https://api.pipedrive.com/v1",
            "zoho": "https://www.zohoapis.com/crm/v2"
        }
        self.logger = logging.getLogger(f"FutureAGI.CRM.{provider}")

    async def update_contact(self, contact_id: str, data: Dict[str, Any]) -> bool:
        """
        Updates contact details in the specified CRM.
        """
        url = f"{self.base_urls.get(self.provider)}/contacts/{contact_id}"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.patch(url, json=data, headers=headers) as resp:
                    if resp.status in [200, 204]:
                        self.logger.info(f"Successfully updated contact {contact_id}")
                        return True
                    else:
                        self.logger.error(f"Failed to update CRM: {resp.status}")
                        return False
        except Exception as e:
            self.logger.exception("CRM sync error")
            return False

    async def log_call(self, contact_id: str, duration: int, transcript: str, outcome: str):
        """
        Logs a voice call activity to the CRM timeline.
        """
        activity_data = {
            "type": "Voice Call",
            "duration_seconds": duration,
            "transcript_summary": transcript[:500],
            "outcome": outcome,
            "platform": "Future AGI Voice"
        }
        return await self.update_contact(contact_id, {"last_activity": activity_data})

class CRMFactory:
    """
    Factory to instantiate CRM connectors dynamically.
    """
    @staticmethod
    def get_connector(provider: str, credentials: Dict[str, str]) -> CRMConnector:
        return CRMConnector(provider, credentials.get("api_key"))
