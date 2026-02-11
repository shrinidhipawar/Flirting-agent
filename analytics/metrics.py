import pandas as pd


class EngagementMetrics:
    """
    Engagement Metrics Calculator for Flirting Agent System
    Calculates:
    - Open Rate
    - Click Through Rate (CTR)
    - Reactivation Rate
    - Engagement Score
    """

    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe

    # -----------------------------
    # Overall Metrics
    # -----------------------------

    def open_rate(self):
        total_sent = self.df["sent"].sum()
        total_opened = self.df["opened"].sum()
        return total_opened / total_sent if total_sent else 0

    def click_through_rate(self):
        total_opened = self.df["opened"].sum()
        total_clicked = self.df["clicked"].sum()
        return total_clicked / total_opened if total_opened else 0

    def reactivation_rate(self):
        total_sent = self.df["sent"].sum()
        total_reactivated = self.df["reactivated"].sum()
        return total_reactivated / total_sent if total_sent else 0

    def overall_summary(self):
        return {
            "open_rate": round(self.open_rate(), 3),
            "ctr": round(self.click_through_rate(), 3),
            "reactivation_rate": round(self.reactivation_rate(), 3)
        }

    # -----------------------------
    # Metrics By Message Type
    # -----------------------------

    def metrics_by_message_type(self):
        results = {}

        message_types = self.df["message_type"].unique()

        for msg_type in message_types:
            subset = self.df[self.df["message_type"] == msg_type]

            total_sent = subset["sent"].sum()
            total_opened = subset["opened"].sum()
            total_clicked = subset["clicked"].sum()
            total_reactivated = subset["reactivated"].sum()

            open_rate = total_opened / total_sent if total_sent else 0
            ctr = total_clicked / total_opened if total_opened else 0
            reactivation = total_reactivated / total_sent if total_sent else 0

            engagement_score = (
                0.4 * open_rate +
                0.3 * ctr +
                0.3 * reactivation
            )

            results[msg_type] = {
                "open_rate": round(open_rate, 3),
                "ctr": round(ctr, 3),
                "reactivation_rate": round(reactivation, 3),
                "engagement_score": round(engagement_score, 3)
            }

        return results


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

    metrics = EngagementMetrics(df)

    print("Overall Metrics:")
    print(metrics.overall_summary())

    print("\nMetrics By Message Type:")
    print(metrics.metrics_by_message_type())
