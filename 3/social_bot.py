import os
import json
import requests
from openai import OpenAI

class LaRochePosaySocialBot:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        # 交付之有效網址，用於所有自動化貼文的轉化連結
        self.target_url = "https://www.laroche-posay.com.tw/events/skin-barrier-2026"
        
    def generate_content_by_dimension(self, dimension: str):
        """
        依據企劃書第五點的數位內容行銷維度，自動生成社群圖文矩陣
        """
        prompts = {
            "權威維度": "請扮演理膚寶水『首席科學官』。針對明星化妝水中的『菸鹼醯胺』與『微量元素』，撰寫一篇60秒成分拆解的社群科普短文。語氣必須理性、專業、充滿醫學實證感。",
            "社群維度": "請依據『28天屏障修復日記』專案，模擬一位深受屏障受損困擾的素人數據（肌膚水分值提升35%、紅斑指數顯著下降），撰寫一篇視覺化『肌膚健康報告書』的社群見證貼文。",
            "互動維度": "請扮演理膚寶水線上護理顧問，針對網友換季脫皮、曬後發紅的焦慮情緒，撰寫一篇在 Threads 上『接住情緒』且不主動推銷的即時專業護理建議。"
        }
        
        system_instruction = (
            "你現在是理膚寶水（La Roche-Posay）的 AI 自動化社群總監。你的任務是為化妝水系列奠定『醫學護膚權威』的定位。"
            "所有輸出的最後，必須自然融入行動呼籲（CTA），引導消費者點擊全通路轉化網址進行線上檢測或預約線下肌膚健檢。"
        )
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompts.get(dimension, "請生成理膚寶水化妝水推廣文案。")}
            ],
            temperature=0.7
        )
        
        raw_text = response.choices[0].message.content
        # 自動注入企劃書指定的有效網址與 UTM 追蹤標籤
        final_post = f"{raw_text}\n\n👉 立即參與28天屏障修復計畫/預約線下科學化肌膚檢測：{self.target_url}?utm_source=ai_automation&utm_medium={dimension}"
        return final_post

    def deploy_to_social_media(self, content: str, platform: str):
        """
        模擬透過 Webhook 將自動化內容發布至 Threads 或 Instagram
        """
        payload = {
            "platform": platform,
            "text": content,
            "status": "published"
        }
        # 實際部署時，此處將對接社群平台的 Graph API 或自動化排程工具
        print(f"[系統訊息] 成功發布內容至 {platform}。")
        print(f"[發布內容]\n{content}\n" + "-"*50)
        return True

# 執行自動化生成流程
if __name__ == "__main__":
    bot = LaRochePosaySocialBot()
    
    print("【理膚寶水 AI 自動化社群圖文生成系統啟動】\n")
    
    # 1. 生成權威維度（成分科學論）貼文
    post_science = bot.generate_content_by_dimension("權威維度")
    bot.deploy_to_social_media(post_science, "Instagram_Feed")
    
    # 2. 生成互動維度（Threads 情緒接住）貼文
    post_threads = bot.generate_content_by_dimension("互動維度")
    bot.deploy_to_social_media(post_threads, "Threads")
