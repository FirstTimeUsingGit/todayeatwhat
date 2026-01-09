from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
import json
import time
import random

app = Flask(__name__)

# 模擬從icook抓取的食譜數據
icook_recipes = [
    {
        'id': 1,
        'name': "清爽夏日涼拌絲瓜",
        'category': "主菜",
        'ingredients': ["絲瓜", "蒜", "醬油", "醋"],
        'method': "1. 絲瓜去皮切片，焯水後過冷水備用\n2. 蒜切末，加入醬油、醋調成醬汁\n3. 將絲瓜與醬汁拌勻即可",
        'cuisine': "中式",
        'season': "夏季"
    },
    {
        'id': 2,
        'name': "滋補冬日羊肉爐",
        'category': "主菜",
        'ingredients': ["羊肉", "白蘿蔔", "薑", "枸杞"],
        'method': "1. 羊肉切塊焯水去腥\n2. 白蘿蔔去皮切塊\n3. 將所有材料放入鍋中燉煮\n4. 燉至羊肉軟爛即可",
        'cuisine': "中式",
        'season': "冬季"
    },
    {
        'id': 3,
        'name': "秋季養生蓮藕排骨湯",
        'category': "湯水",
        'ingredients': ["排骨", "蓮藕", "薑", "鹽"],
        'method': "1. 排骨焯水去血沫\n2. 蓮藕去皮切塊\n3. 所有材料放入鍋中，加水煮沸\n4. 轉小火慢燉2小時",
        'cuisine': "中式",
        'season': "秋季"
    },
    {
        'id': 4,
        'name': "甜蜜桂花糯米丸子",
        'category': "甜品",
        'ingredients': ["糯米粉", "桂花", "糖", "水"],
        'method': "1. 糯米粉加水揉成光滑面團\n2. 分成小份搓成圓球\n3. 水開後放入糯米球煮熟\n4. 撒上桂花和糖即可",
        'cuisine': "中式",
        'season': "四季"
    },
    {
        'id': 5,
        'name': "清爽青木瓜沙拉",
        'category': "健康餐",
        'ingredients': ["青木瓜", "番茄", "花生", "魚露"],
        'method': "1. 青木瓜刨絲，番茄切片\n2. 花生烘烤碾碎\n3. 所有材料混合，加入調料拌勻\n4. 裝盤即可",
        'cuisine': "泰式",
        'season': "四季"
    },
    {
        'id': 6,
        'name': "麻辣香鍋",
        'category': "重口味",
        'ingredients': ["各種蔬菜", "肉類", "火鍋料", "花椒"],
        'method': "1. 各種食材處理好備用\n2. 熱油爆香花椒、辣椒\n3. 加入各種食材翻炒\n4. 加入調料炒熟即可",
        'cuisine': "中式",
        'season': "四季"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/recipes')
def get_recipes():
    """獲取所有食譜"""
    return jsonify(icook_recipes)

@app.route('/api/recipes/filter')
def filter_recipes():
    """根據條件篩選食譜"""
    cuisine = request.args.get('cuisine', '')
    season = request.args.get('season', '')
    category = request.args.get('category', '')
    
    filtered_recipes = icook_recipes
    
    if cuisine:
        filtered_recipes = [r for r in filtered_recipes if r['cuisine'] == cuisine or cuisine == '中式']
    if season:
        filtered_recipes = [r for r in filtered_recipes if r['season'] == season or r['season'] == '四季']
    if category:
        filtered_recipes = [r for r in filtered_recipes if r['category'] == category]
    
    return jsonify(filtered_recipes)

@app.route('/api/recipes/load_latest', methods=['POST'])
def load_latest_recipes():
    """從 icook.tw 加載最新食譜"""
    global icook_recipes
    
    # 這裡我們模擬從 icook.tw 抓取數據的過程
    # 實際應用中，這裡會進行真正的網絡請求
    new_recipes = scrape_latest_from_icook()
    
    # 更新全局食譜數據
    icook_recipes.extend(new_recipes)
    
    return jsonify({'message': f'成功載入 {len(new_recipes)} 個最新食譜', 'count': len(new_recipes)})

def scrape_latest_from_icook():
    """
    從 icook.tw 抓取最新的食譜數據
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        # 訪問 icook 最新食譜頁面
        url = 'https://icook.tw/recipes/latest'
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 找到食譜項目
        recipe_items = soup.find_all('div', {'data-test-id': 'browse-recipe-item'})[:10]  # 只抓取前10個
        
        recipes = []
        for item in recipe_items:
            try:
                # 提取食譜標題
                title_element = item.find('h2')
                title = title_element.get_text(strip=True) if title_element else f"新增食譜 {len(recipes)+1}"
                
                # 提取食材列表 (這部分需要根據實際網頁結構調整)
                ingredients_elements = item.find_all('a', href=lambda x: x and '/ingredients/' in x)
                ingredients = [elem.get_text(strip=True) for elem in ingredients_elements[:5]]  # 只取前5個
                
                # 模擬食譜步驟 (因為在列表頁面通常不會顯示詳細步驟)
                steps = f"1. 準備食材：{', '.join(ingredients) if ingredients else '各種食材'}\n"
                steps += "2. 按照一般烹飪步驟進行處理\n"
                steps += "3. 根據個人口味調整調料\n"
                steps += "4. 完成後即可享用"
                
                # 根據標題判斷菜系和類別
                cuisine = classify_cuisine(title)
                category = classify_category(title)
                season = random.choice(['春季', '夏季', '秋季', '冬季'])
                
                recipe = {
                    'id': len(icook_recipes) + len(recipes) + 1,
                    'name': title,
                    'category': category,
                    'ingredients': ingredients if ingredients else ['各種食材'],
                    'method': steps,
                    'cuisine': cuisine,
                    'season': season
                }
                
                recipes.append(recipe)
                
                # 避免請求過於頻繁
                time.sleep(random.uniform(0.5, 1.5))
                
            except Exception as e:
                print(f"處理食譜項目時發生錯誤: {e}")
                continue
        
        return recipes
    
    except Exception as e:
        print(f"抓取過程中發生錯誤: {e}")
        # 返回一些示例數據作為備用
        return [
            {
                'id': len(icook_recipes) + 1,
                'name': '最新推薦食譜',
                'category': '主菜',
                'ingredients': ['當季食材'],
                'method': '1. 準備當季新鮮食材\n2. 按照喜好進行烹調\n3. 調味後完成',
                'cuisine': '中式',
                'season': '四季'
            }
        ]

def classify_cuisine(title):
    """
    根據食譜名稱分類菜系
    """
    title_lower = title.lower()
    
    if any(keyword in title_lower for keyword in ['中式', '中華', '家常', '川菜', '粵菜', '台灣', '台式']):
        return '中式'
    elif any(keyword in title_lower for keyword in ['義大利', '義式', '法式', '歐式', '披薩', '義麵', '奶油蘑菇']):
        return '西式'
    elif any(keyword in title_lower for keyword in ['日式', '壽司', '拉麵', '味噌', '照燒', '日式拉麵']):
        return '日式'
    elif any(keyword in title_lower for keyword in ['韓式', '泡菜', '拌飯', '燒烤', '韓國']):
        return '韓式'
    elif any(keyword in title_lower for keyword in ['泰式', '冬陰功', '綠咖哩', '泰國']):
        return '泰式'
    elif any(keyword in title_lower for keyword in ['台式', '小籠包', '割包', '滷肉']):
        return '台式'
    else:
        return '中式'

def classify_category(title):
    """
    根據食譜名稱分類菜式類別
    """
    title_lower = title.lower()
    
    if any(keyword in title_lower for keyword in ['湯', '羹', '粥']):
        return '湯水'
    elif any(keyword in title_lower for keyword in ['蛋糕', '布丁', '甜', '糖', '餅乾', '冰淇淋']):
        return '甜品'
    elif any(keyword in title_lower for keyword in ['沙拉', '輕食', '低卡', '減脂', '健康']):
        return '健康餐'
    elif any(keyword in title_lower for keyword in ['麻辣', '重口味', '辣', '香鍋']):
        return '重口味'
    else:
        return '主菜'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)