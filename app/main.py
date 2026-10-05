from agent import agent


def main():
    print("SYSTEM IMPACT AGENT")
    print("Type 'exit' to stop.\n")

    while True:
        question = input("You: ")

        if question.lower() == "exit":
            break

        response = agent.invoke({
            "messages": [
                {"role": "user", "content": question}
            ]
        })

        print("\nAgent:")
        print(response["messages"][-1].content)
        print()


if __name__ == "__main__":
    main()