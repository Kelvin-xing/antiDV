from locust import HttpUser, task, between

class DifyChatUser(HttpUser):
    # 模拟用户思考时间，在连续请求之间暂停 1 到 5 秒
    wait_time = between(1, 5) 

    @task
    def send_chat_message(self):
        # 这里替换为你 Vercel 网站的真实请求 Payload
        payload = {
            "query":  [ "我处理困难情绪时会把自己隔离开来、变得冷漠，这是一种保护机制吗，会不会影响我的人际关系？", 
        "如果我选择原谅他，是不是就等于认可他当年对我做的那一切都可以接受？", 
        "他倒背我走向那个黑漆漆的山谷，说要把我扔下去，我现在该怎么办？", 
        "我在大学宿舍说感谢爸爸打我，朋友都很惊讶，但我当时真的是这么想的，这正常吗？", 
        "他说这都是为了管教我、让我好好学习，所以被打是应该的吗？", 
        "我越来越不信任周围的人，甚至对身边的同学产生了敌意，这是正常的反应吗？", 
        "他一骂就到凌晨一两点，第二天女儿还要去读书，我怎样才能让他停止？", 
        "我应该在婚前就跟他讨论好财务、生育计划这些重要的话题吗？", 
        "我在这段婚姻中一点经济来源都没有，我怎样才能为离开做准备？", 
        "如果我离婚了没有孩子也没有钱，我应该去哪里寻求法律援助和经济帮助？"
        ]               # 如果你有其他参数，比如 user_id 等，一并带上
        }
        
        # 假设你的接口是 POST /api/chat
        with self.client.post("/api/chat", json=payload, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 504:
                response.failure("Vercel Gateway Timeout (504)")
            elif response.status_code == 429:
                response.failure("Too Many Requests (429) - 触发限流")
            else:
                response.failure(f"Error {response.status_code}")