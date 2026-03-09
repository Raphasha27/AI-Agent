"""
ResearchAgent – Performs web research and synthesises findings.
"""

import logging

from app.agents.base_agent import BaseAgent
from app.tools.web_search import search_web

logger = logging.getLogger(__name__)


class ResearchAgent(BaseAgent):
    """
    Searches the web, retrieves relevant results,
    and synthesises them into a clean research summary.
    """

    name = "researcher"
    role = (
        "Expert research analyst. "
        "You search the web, analyse results, and produce clear, accurate summaries."
    )

    def research(self, topic: str) -> dict:
        """
        Research a given topic and return a synthesised summary.

        Args:
            topic: The subject to research.

        Returns:
            dict with keys: agent, topic, raw_results, summary
        """
        logger.info("[%s] Researching topic | topic=%s", self.name, topic[:60])

        raw_results = search_web(topic)

        prompt = f"""
You are given raw web search results for the following topic:

TOPIC: {topic}

RAW SEARCH RESULTS:
{raw_results}

Instructions:
1. Identify the most relevant and reliable information.
2. Ignore adverts, navigation text, and irrelevant content.
3. Write a structured research summary with:
   - Key findings (bullet points)
   - Key entities or statistics mentioned
   - A conclusion

Keep your summary factual, concise (200–400 words), and well-organised.
"""

        summary = self.think(prompt)

        logger.info("[%s] Research complete | topic=%s", self.name, topic[:60])

        return {
            "agent":       self.name,
            "topic":       topic,
            "raw_results": raw_results,
            "summary":     summary,
        }
