import pandas as pd
from metrics import EngagementMetrics


class FeedbackEngine:
    """
    Feedback Engine that adjusts strategy
    based on engagement performance.
    """

    def __init__(self, dataframe: pd.DataFrame):
        self.metrics = EngagementMetrics(dataframe)
        self.results = self.metrics.metrics_by_message_type()

    def adjust_strategy(self):

        if "flirty" not in self.results or "utility" not in self.results:
            return "Insufficient data to compare message types."

        flirty_score = self.results["flirty"]["engagement_score"]
        utility_score = self.results["utility"]["engagement_score"]

        if flirty_score > utility_score:
            return "Increase frequency of Flirty Agent messages."
        elif flirty_score < utility_score:
            return "Refine Flirty tone or adjust timing."
        else:
            return "Both strategies performing equally. Test new variants."


# ---------------------------------------------
# Test Block
# ---------------------------------------------
if __name__ == "__main__":

    data = {
        "user_id": [1, 2, 3, 4, 5, 6],
        "message_type": ["flirty", "flirty", "utility", "flirty", "utility", "utility"],
        "sent": [1, 1, 1, 1, 1, 1],
        "opened": [1, 0, 1, 1, 0, 1],
        "clicked": [1, 0, 0, 1, 0, 0],
        "reactivated": [1, 0, 0, 1, 0, 0]
    }

    df = pd.DataFrame(data)

    engine = FeedbackEngine(df)

    print("\nStrategy Recommendation:")
    print(engine.adjust_strategy())
