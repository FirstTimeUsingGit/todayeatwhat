import requests
from bs4 import BeautifulSoup
import json
import time
import random

def scrape_latest_recipes():
    """
    從 icook.tw 抓取最新的食譜數據
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        # 訪問 icook 最新食譜頁面
        url = 'https://icook.tw/recipes/latest'
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 找到食譜項目
        recipe_items = soup.find_all('div', {'data-test-id': 'browse-recipe-item'})[:10]  # 只抓取前10個
        
        recipes = []
        for item in recipe_items:
            try:
                # 提取食譜標題
                title_element = item.find('h2')
                title = title_element.get_text(strip=True) if title_element else "未知食譜"
                
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
                    'id': len(recipes) + 1,
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
    
    except requests.RequestException as e:
        print(f"請求失敗: {e}")
        # 返回一些示例數據作為備用
        return [
            {
                'id': 1,
                'name': '今日推薦食譜',
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

def update_recipe_data():
    """
    更新食譜數據文件
    """
    print("開始抓取 icook.tw 最新食譜...")
    latest_recipes = scrape_latest_recipes()
    
    # 讀取現有的數據
    try:
        with open('/workspace/data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        # 如果文件不存在，創建基本結構
        data = {
            "cookingMethods": ["蒸", "炒","煮", "炸","湯", "麵"],
            "ingredientTypes": ["肉類", "蔬菜", "海鮮", "蛋", "豆類", "其他", "直接食用", "生食"],
            "ingredients": [],
            "recipes": []
        }
    
    # 更新食譜數據
    data['recipes'] = []
    for i, recipe in enumerate(latest_recipes):
        # 轉換食材名稱為ID（簡化處理）
        ingredient_ids = list(range(1, min(len(recipe['ingredients']) + 1, 6)))  # 最多5個
        
        recipe_entry = {
            "id": i + 1,
            "name": recipe['name'],
            "ingredients": ingredient_ids,
            "method": recipe['method'],
            "cookingMethods": ["煮"],  # 默認方法
            "seasons": [recipe['season']]
        }
        data['recipes'].append(recipe_entry)
    
    # 寫入更新後的數據
    with open('/workspace/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"成功更新 {len(latest_recipes)} 個最新食譜到數據庫")
    
    # 更新前端 JavaScript 中的食譜數據
    update_frontend_recipes(latest_recipes)

def update_frontend_recipes(recipes):
    """
    更新前端頁面中的食譜數據
    """
    # 將抓取的食譜數據轉換為前端可用的格式
    frontend_recipes = []
    for recipe in recipes:
        frontend_recipe = {
            'id': recipe['id'],
            'name': recipe['name'],
            'category': recipe['category'],
            'ingredients': recipe['ingredients'],
            'method': recipe['method'],
            'cuisine': recipe['cuisine'],
            'season': recipe['season']
        }
        frontend_recipes.append(frontend_recipe)
    
    # 讀取前端文件
    try:
        with open('/workspace/index_new.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("前端文件不存在，跳過更新")
        return
    
    # 替換食譜數據部分
    import re
    
    # 查找現有的 icookRecipes 數據部分
    pattern = r'const icookRecipes = \[(.*?)\];'
    replacement = f'''const icookRecipes = {json.dumps(frontend_recipes, ensure_ascii=False, indent=4)};
'''
    
    updated_content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)
    
    # 如果沒有找到匹配項，則插入到適當位置
    if updated_content == content:
        # 在適當的位置插入新的食譜數據
        insertion_point = 'const seasonalIngredients = {'
        parts = content.split(insertion_point)
        if len(parts) > 1:
            updated_content = parts[0] + f'''
// 模擬從icook抓取的食譜數據
const icookRecipes = {json.dumps(frontend_recipes, ensure_ascii=False, indent=4)};

''' + insertion_point + parts[1]
    
    # 寫入更新後的內容
    with open('/workspace/index_new.html', 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("前端食譜數據已更新")

if __name__ == "__main__":
    update_recipe_data()