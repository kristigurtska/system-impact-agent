
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import agent


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:63342"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Question(BaseModel):
    question: str


@app.post("/analyze")
def analyze(question: Question):
    response = agent.invoke({
        "messages": [
            {"role": "user", "content": question.question}
        ]
    })

    answer = response["messages"][-1].content

    return {
        "answer": answer
    }
