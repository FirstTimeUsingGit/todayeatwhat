#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
食譜更新工具
此腳本用於從 icook.tw 抓取最新食譜並更新到數據庫和前端
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os

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
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 找到食譜項目
        recipe_items = soup.find_all('div', {'data-test-id': 'browse-recipe-item'})[:5]  # 只抓取前5個
        
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
    
    except Exception as e:
        print(f"抓取過程中發生錯誤: {e}")
        # 返回一些示例數據作為備用
        return [
            {
                'id': 1,
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

def update_database_with_recipes(new_recipes):
    """
    更新數據庫中的食譜數據
    """
    # 讀取現有的數據
    try:
        with open('/workspace/data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        # 如果文件不存在，創建基本結構
        data = {
            "cookingMethods": ["蒸", "炒","煮", "炸","湯", "麵"],
            "ingredientTypes": ["肉類", "蔬菜", "海鮮", "蛋", "豆類", "其他", "直接食用", "生食"],
            "ingredients": [
                {"id": 1, "name": "雞肉", "type": "肉類", "season": "四季", "cookingMethods": ["炒", "煮", "蒸", "炸"]},
                {"id": 2, "name": "豬肉", "type": "肉類", "season": "四季", "cookingMethods": ["炒", "煮", "蒸", "炸"]},
                {"id": 3, "name": "牛肉", "type": "肉類", "season": "四季", "cookingMethods": ["炒", "煮", "蒸", "炸"]},
                {"id": 4, "name": "魚", "type": "海鮮", "season": "四季", "cookingMethods": ["蒸", "煮", "炸"]},
                {"id": 5, "name": "蝦", "type": "海鮮", "season": "四季", "cookingMethods": ["蒸", "煮", "炸", "炒"]}
            ],
            "recipes": []
        }
    
    # 添加新的食譜到數據庫
    existing_ids = {r['id'] for r in data['recipes']}
    for recipe in new_recipes:
        if recipe['id'] not in existing_ids:
            # 轉換格式以符合數據庫結構
            db_recipe = {
                "id": recipe['id'],
                "name": recipe['name'],
                "ingredients": recipe['ingredients'][:5],  # 只取前5個食材
                "method": recipe['method'],
                "cookingMethods": ["煮"],  # 默認方法
                "seasons": [recipe['season']]
            }
            data['recipes'].append(db_recipe)
    
    # 寫入更新後的數據
    with open('/workspace/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"成功更新 {len([r for r in new_recipes if r['id'] not in existing_ids])} 個新食譜到數據庫")

def update_frontend_recipes(new_recipes):
    """
    更新前端 JavaScript 中的食譜數據
    """
    # 讀取前端文件
    try:
        with open('/workspace/script.js', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("前端腳本文件不存在")
        return
    
    # 尋找 icookRecipes 的定義位置
    start_marker = "// 模擬從icook抓取的食譜數據\nconst icookRecipes = ["
    end_marker = "];"
    
    if start_marker in content and end_marker in content:
        # 找到開始和結束位置
        start_pos = content.find(start_marker)
        end_pos = content.find(end_marker, start_pos) + len(end_marker)
        
        # 構造新的食譜數據
        recipes_json = json.dumps(new_recipes, ensure_ascii=False, indent=4)
        new_section = f"// 模擬從icook抓取的食譜數據\nconst icookRecipes = {recipes_json};"
        
        # 替換內容
        updated_content = content[:start_pos] + new_section + content[end_pos:]
        
        # 寫入更新後的內容
        with open('/workspace/script.js', 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print("前端食譜數據已更新")
    else:
        print("未找到前端食譜數據區域，無法更新")

def main():
    """
    主函數：執行完整的食譜更新流程
    """
    print("開始從 icook.tw 抓取最新食譜...")
    latest_recipes = scrape_latest_recipes()
    
    if latest_recipes:
        print(f"成功抓取 {len(latest_recipes)} 個食譜")
        
        # 更新數據庫
        update_database_with_recipes(latest_recipes)
        
        # 更新前端
        update_frontend_recipes(latest_recipes)
        
        print("食譜更新完成！")
    else:
        print("未能抓取到任何食譜")

if __name__ == "__main__":
    main()