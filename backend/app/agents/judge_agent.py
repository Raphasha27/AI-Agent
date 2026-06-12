import logging
from typing import Tuple

logger = logging.getLogger(__name__)

def evaluate_goal(goal: str, agent_output: str, history: str) -> Tuple[bool, str]:
    """
    Independent "Judge" LLM loop evaluator.
    Instead of stateless responses, the agent loops until this Judge Model verifies completion.
    
    Returns:
        (is_complete, feedback_or_reasoning)
    """
    logger.info("[judge_model] Evaluating goal completion: %.50s...", goal)
    
    # In a real implementation, this would call the LLM to verify the agent output against the goal.
    # For now, we stub the logic. If the agent output is very short or explicitly requests more, we return False.
    # If the agent output contains "Task Complete" or sufficiently addresses it, we return True.
    
    if "Task Complete" in agent_output or len(agent_output.split()) > 50:
        logger.info("[judge_model] Goal verified as complete.")
        return True, "The agent appears to have successfully addressed the goal."
    
    feedback = "The response is too brief or incomplete. Continue working on the goal."
    logger.info("[judge_model] Goal NOT complete: %s", feedback)
    return False, feedback

def agent_goal_loop(goal: str, agent_function, max_iterations: int = 3) -> str:
    """
    Persistent goal-tracking loop.
    """
    history = ""
    current_input = goal
    
    for i in range(max_iterations):
        logger.info("[goal_loop] Iteration %d/%d", i+1, max_iterations)
        
        # Call the agent
        agent_output = agent_function(current_input)
        history += f"\nAgent: {agent_output}"
        
        is_complete, feedback = evaluate_goal(goal, agent_output, history)
        
        if is_complete:
            return f"[Goal Achieved in {i+1} iterations] Final Output:\n{agent_output}"
            
        # Provide feedback as the next input
        current_input = f"Your previous attempt was incomplete. Judge feedback: {feedback}\nPlease continue working on: {goal}"
        
    return f"[Max Iterations Reached] Best Effort Output:\n{agent_output}"
