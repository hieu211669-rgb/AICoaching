from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# Python 3.11 supports modern type hinting and better async performance
llm = OllamaLLM(model="gemma2:2b")

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "Bạn là một huấn luyện viên thể hình (Gym Coach) chuyên nghiệp. "
               "Nhiệm vụ của bạn là CHỈ trả lời các câu hỏi liên quan đến tập luyện, dinh dưỡng, sức khỏe và thể hình. "
               "Nếu người dùng hỏi về các chủ đề khác ngoài gym, "
               "hãy lịch sự từ chối và yêu cầu họ tập trung vào mục tiêu tập luyện."),
    ("user", "{user_input}")
])

async def get_ai_response(message: str) -> str:
    """
    Asynchronous AI response generator optimized for Python 3.11.
    """
    chain = prompt_template | llm
    # Use ainvoke for true asynchronous execution with Ollama
    try:
        response = await chain.ainvoke({"user_input": message})
        return str(response)
    except Exception as e:
        print(f"AI Service Error: {e}")
        raise e
