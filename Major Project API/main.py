from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# In-memory storage
sessions_storage = []

# Pydantic models
class Session(BaseModel):
    id: str
    topic: str
    date: str
    durationMinutes: int

class SessionList(BaseModel):
    sessions: List[Session]

# Endpoint to store sessions
@app.post("/store-sessions")
async def store_sessions(session_list: SessionList):
    try:
        sessions_to_store = [
            {
                "id": session.id,
                "topic": session.topic,
                "date": session.date,
                "duration": session.durationMinutes / 60,  # Convert minutes to hours
                "performance": 0.0
            }
            for session in session_list.sessions
        ]
        if sessions_to_store:
            sessions_storage.extend(sessions_to_store)
        return {"message": "Sessions stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing sessions: {str(e)}")

# Endpoint for study analysis
@app.get("/study-analysis")
def get_study_analysis():
    if not sessions_storage:
        return {"study_plan": []}

    df = pd.DataFrame(sessions_storage)
    df["date"] = pd.to_datetime(df["date"])

    # Get unique topics and their original dates and durations
    study_plan = []
    unique_topics = df["topic"].unique()
    for topic in unique_topics:
        topic_df = df[df["topic"] == topic]
        date = str(topic_df["date"].iloc[0].date())  # Use the first occurrence's date
        duration_hours = topic_df["duration"].iloc[0]  # Duration in hours
        study_plan.append({"date": date, "topic": topic, "duration": duration_hours})

    # Add combined topic if there are topics
    if unique_topics.size > 0:
        combined_topic = " + ".join(unique_topics)
        date = str(df["date"].iloc[0].date())  # Use the first date for combined topic
        # Use the minimum duration among the topics for the combined topic
        duration_hours = df["duration"].min()
        study_plan.append({"date": date, "topic": combined_topic, "duration": duration_hours})

    return {"study_plan": study_plan}