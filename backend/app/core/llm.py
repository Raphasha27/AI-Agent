"""
LLM Engine – unified interface to OpenAI (or any compatible provider).
Supports streaming, retry logic, and token tracking.
"""

import logging
from typing import Generator, Optional

from openai import OpenAI, OpenAIError
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Client ────────────────────────────────────────────────────────────────────
_client: Optional[OpenAI] = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


# ── Core LLM Call ─────────────────────────────────────────────────────────────
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(OpenAIError),
    reraise=True,
)
def ask_llm(
    prompt: str,
    system_prompt: str = "You are a helpful AI agent.",
    temperature: float | None = None,
    max_tokens: int | None = None,
    model: str | None = None,
) -> str:
    """
    Send a prompt to the LLM and return the response text.

    Args:
        prompt:        User-facing message.
        system_prompt: System-level instructions.
        temperature:   Override default temperature.
        max_tokens:    Override default max tokens.
        model:         Override default model name.

    Returns:
        str: The LLM's response content.
    """
    client = get_client()

    response = client.chat.completions.create(
        model=model or settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": prompt},
        ],
        temperature=temperature if temperature is not None else settings.LLM_TEMPERATURE,
        max_tokens=max_tokens or settings.LLM_MAX_TOKENS,
    )

    content = response.choices[0].message.content or ""
    usage   = response.usage

    logger.info(
        "LLM response received | model=%s tokens_used=%s",
        model or settings.LLM_MODEL,
        usage.total_tokens if usage else "?",
    )

    return content


def ask_llm_stream(
    prompt: str,
    system_prompt: str = "You are a helpful AI agent.",
) -> Generator[str, None, None]:
    """
    Stream tokens from the LLM one chunk at a time.

    Yields:
        str: Text delta from each streaming chunk.
    """
    client = get_client()

    stream = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": prompt},
        ],
        temperature=settings.LLM_TEMPERATURE,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
