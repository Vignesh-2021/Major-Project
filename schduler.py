import pandas as pd

# Data from input
sessions = [
    {"topic": "Machine Learning", "date": "2025-03-24", "duration": 2},
    {"topic": "DBMS", "date": "2025-03-25", "duration": 1},
    {"topic": "Machine Learning", "date": "2025-03-26", "duration": 3}
]

# Convert to DataFrame
df = pd.DataFrame(sessions)
df["date"] = pd.to_datetime(df["date"])

# Analyze Study Patterns
total_hours = df["duration"].sum()
topic_summary = df.groupby("topic")["duration"].sum().reset_index()
most_studied_topic = topic_summary.loc[topic_summary["duration"].idxmax(), "topic"]
least_studied_topic = topic_summary.loc[topic_summary["duration"].idxmin(), "topic"]

# Display Study Pattern Analysis
print(f"📊 **Study Pattern Analysis**")
print(f"Total Study Hours: {total_hours} hours")
print(f"Most Studied Topic: {most_studied_topic}")
print(f"Least Studied Topic: {least_studied_topic}\n")

# Generate a Study Plan 
recommended_plan = [
    {"date": "2025-03-27", "topic": least_studied_topic, "duration": 2},  # Focus on the least studied topic
    {"date": "2025-03-28", "topic": most_studied_topic, "duration": 2},   # Continue strong topic
    {"date": "2025-03-29", "topic": "New Topic (e.g., Algorithms)", "duration": 1.5},  # Introduce new topic
    {"date": "2025-03-30", "topic": "Mixed Practice (DBMS + ML)", "duration": 2}  # Reinforcement session
]

# Display Study Plan
print("📅 **Optimized Study Plan**")
for session in recommended_plan:
    print(f"{session['date']} - {session['topic']} ({session['duration']} hours)")

#Recommend Improvements
recommendations = [
    f"Increase focus on {least_studied_topic} to improve weaker areas.",
    "Follow a structured study plan with frequent but balanced sessions.",
    "Combine theory with practice (e.g., coding exercises for Machine Learning & DBMS).",
    "Use mock tests to assess progress and reinforce learning.",
    "Apply active recall techniques to retain information longer."
]

# Display Recommendations
print("\n🎯 **Study Improvement Recommendations**")
for rec in recommendations:
    print(rec)
