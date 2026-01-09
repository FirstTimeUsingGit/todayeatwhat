// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const ingredientsBtn = document.getElementById('ingredients-btn');
    const dishBtn = document.getElementById('dish-btn');
    const ingredientsInput = document.getElementById('ingredients-input');
    const dishInput = document.getElementById('dish-input');
    const generateBtn = document.getElementById('generate-btn');
    const recipeContent = document.getElementById('recipe-content');

    // 切換輸入方式
    ingredientsBtn.addEventListener('click', function() {
        ingredientsBtn.classList.add('active');
        dishBtn.classList.remove('active');
        ingredientsInput.classList.add('active');
        dishInput.classList.remove('active');
    });

    dishBtn.addEventListener('click', function() {
        dishBtn.classList.add('active');
        ingredientsBtn.classList.remove('active');
        dishInput.classList.add('active');
        ingredientsInput.classList.remove('active');
    });

    // 生成食譜按鈕事件
    generateBtn.addEventListener('click', generateRecipe);

    // 生成食譜函數
    function generateRecipe() {
        // 顯示加載狀態
        recipeContent.innerHTML = '<div class="loading">正在生成食譜...</div>';

        // 延遲一下模擬生成過程
        setTimeout(() => {
            let recipeHtml = '';

            // 檢查當前是哪種輸入方式
            if (ingredientsInput.classList.contains('active')) {
                // 從材料生成食譜
                recipeHtml = generateRecipeFromIngredients();
            } else {
                // 從菜式類型生成食譜
                recipeHtml = generateRecipeFromDishType();
            }

            // 更新食譜內容
            recipeContent.innerHTML = recipeHtml;
        }, 1500);
    }

    // 從材料生成食譜
    function generateRecipeFromIngredients() {
        // 獲取選中的材料
        const selectedIngredients = Array.from(document.querySelectorAll('#ingredients-input input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        // 獲取自定義材料
        const customIngredientsText = document.getElementById('custom-ingredients').value.trim();
        let customIngredients = [];
        if (customIngredientsText) {
            customIngredients = customIngredientsText.split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
        }

        // 合併所有選中的材料
        const allSelectedIngredients = [...selectedIngredients, ...customIngredients];

        // 如果沒有選擇任何材料，返回錯誤信息
        if (allSelectedIngredients.length === 0) {
            return `
                <div class="error">
                    <p>請至少選擇一種材料！</p>
                </div>
            `;
        }

        // 生成食譜
        const recipe = createRecipeFromIngredients(allSelectedIngredients);
        return renderRecipe(recipe);
    }

    // 從菜式類型生成食譜
    function generateRecipeFromDishType() {
        // 獲取選中的菜式類型
        const selectedDishType = document.querySelector('#dish-input input[name="dish-type"]:checked');
        const customDishValue = document.getElementById('custom-dish').value.trim();

        // 如果沒有選擇菜式類型且沒有自定義菜式，返回錯誤信息
        if (!selectedDishType && !customDishValue) {
            return `
                <div class="error">
                    <p>請選擇菜式類型或輸入自定義菜式！</p>
                </div>
            `;
        }

        // 生成食譜
        const recipe = createRecipeFromDishType(
            selectedDishType ? selectedDishType.value : null,
            customDishValue
        );
        return renderRecipe(recipe);
    }

    // 根據材料創建食譜
    function createRecipeFromIngredients(ingredients) {
        // 選擇第一個材料作為主要材料
        const mainIngredient = ingredients[0];
        const otherIngredients = ingredients.slice(1);

        // 根據主要材料類型生成不同食譜
        let recipe = {};

        if (containsAny(mainIngredient, ['雞', '雞胸', '雞腿', '雞翼'])) {
            recipe = {
                name: `${mainIngredient}炒時蔬`,
                description: '一道健康美味的家常菜，雞肉嫩滑，蔬菜爽脆。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['青菜', '薑', '蒜']],
                cookingTime: '20分鐘',
                difficulty: '簡單',
                instructions: [
                    '雞肉洗淨切塊，用鹽、生抽、生粉醃製10分鐘',
                    '其他食材洗淨，蔬菜切好備用',
                    '熱鍋下油，爆香薑蒜',
                    '加入雞肉炒至變色',
                    '加入蔬菜炒勻',
                    '調味後炒熟即可上碟'
                ]
            };
        } else if (containsAny(mainIngredient, ['豬', '豬肉', '豬脷', '豬肝'])) {
            recipe = {
                name: `${mainIngredient}炒通菜`,
                description: '經典的港式家常菜，豬肉香嫩，通菜爽脆。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['通菜', '蒜', '豆豉']],
                cookingTime: '15分鐘',
                difficulty: '簡單',
                instructions: [
                    '豬肉洗淨切片，用鹽、生抽、生粉醃製10分鐘',
                    '通菜洗淨切段，蒜頭拍扁',
                    '熱鍋下油，爆香蒜頭和豆豉',
                    '加入豬肉炒至變色',
                    '加入通菜大火炒至熟透',
                    '調味後即可上碟'
                ]
            };
        } else if (containsAny(mainIngredient, ['牛', '牛肉', '牛腩'])) {
            recipe = {
                name: `${mainIngredient}燴雜菜`,
                description: '營養豐富的燴菜，牛肉嫩滑，蔬菜多汁。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['馬鈴薯', '紅蘿蔔', '洋蔥']],
                cookingTime: '30分鐘',
                difficulty: '中等',
                instructions: [
                    '牛肉洗淨切塊，用鹽、生抽、生粉醃製10分鐘',
                    '蔬菜洗淨切好備用',
                    '熱鍋下油，爆香洋蔥',
                    '加入牛肉炒香',
                    '加入蔬菜炒勻',
                    '加水燴煮15-20分鐘至牛肉軟爛',
                    '調味後即可上碟'
                ]
            };
        } else if (containsAny(mainIngredient, ['魚', '石斑', '鯪魚'])) {
            recipe = {
                name: `清蒸${mainIngredient}`,
                description: '清淡健康的蒸魚，保持魚的原汁原味。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['薑絲', '蔥絲', '蒸魚豉油']],
                cookingTime: '15分鐘',
                difficulty: '簡單',
                instructions: [
                    `${mainIngredient}洗淨，抹乾水分，在魚身兩側劃幾刀`,
                    '在魚身上放薑片，放入蒸爐蒸8-10分鐘',
                    '取出後倒掉蒸出的水，移走薑片',
                    '在魚身上放薑絲和蔥絲',
                    '燒熱油，淋在薑絲和蔥絲上',
                    '最後淋上蒸魚豉油即可'
                ]
            };
        } else if (containsAny(mainIngredient, ['蝦', '大蝦', '基圍蝦'])) {
            recipe = {
                name: `白灼${mainIngredient}`,
                description: '簡單快捷的蝦料理，保持蝦的鮮甜。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['薑片', '蔥段', '醬油']],
                cookingTime: '10分鐘',
                difficulty: '簡單',
                instructions: [
                    '鍋中加水，放入薑片和蔥段煮沸',
                    `${mainIngredient}洗淨，去除腸泥`,
                    '將蝦放入沸水中煮3-5分鐘',
                    '撈起後立即放入冰水中保持爽脆',
                    '配上調好的醬油或其他蘸料即可'
                ]
            };
        } else if (containsAny(mainIngredient, ['蛋', '雞蛋', '鴨蛋'])) {
            recipe = {
                name: `${mainIngredient}煎餅`,
                description: '簡單營養的蛋餅，可加入各種蔬菜。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['麵粉', '水', '鹽', '蔥花']],
                cookingTime: '10分鐘',
                difficulty: '簡單',
                instructions: [
                    `${mainIngredient}打散，加入適量鹽調味`,
                    '加入麵粉、水調成蛋漿',
                    '加入其他材料（如蔥花、蔬菜粒）',
                    '熱鍋下油，倒入蛋漿',
                    '煎至兩面金黃',
                    '切件即可上碟'
                ]
            };
        } else if (containsAny(mainIngredient, ['米飯', '白飯'])) {
            recipe = {
                name: `${mainIngredient}炒蛋`,
                description: '經典的炒飯，簡單又美味。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['蛋', '蔥', '胡蘿蔔', '豌豆', '火腿']],
                cookingTime: '15分鐘',
                difficulty: '簡單',
                instructions: [
                    '蛋打散，加少許鹽調味',
                    '熱鍋下油，炒蛋後盛起',
                    '下油爆香蔥花',
                    '加入米飯炒散',
                    '加入蛋和其他材料炒勻',
                    '調味後炒香即可'
                ]
            };
        } else if (containsAny(mainIngredient, ['意大利麵', '意粉', '通心粉'])) {
            recipe = {
                name: `${mainIngredient}配醬`,
                description: '簡單美味的意粉，可配合不同醬料。',
                ingredients: [mainIngredient, ...otherIngredients.length > 0 ? otherIngredients : ['番茄醬', '洋蔥', '蘑菇', '芝士']],
                cookingTime: '20分鐘',
                difficulty: '簡單',
                instructions: [
                    '大鍋加水煮沸，加入少許鹽和油',
                    `放入${mainIngredient}煮8-10分鐘至軟硬適中`,
                    '同時熱鍋炒香洋蔥和其他材料',
                    '加入醬料煮成醬汁',
                    '將煮熟的意粉瀝乾，與醬汁拌勻',
                    '撒上芝士即可'
                ]
            };
        } else {
            // 默認食譜
            recipe = {
                name: `自選材料搭配 - ${mainIngredient}料理`,
                description: `利用您選擇的材料製作的創意料理，享受美食的樂趣！`,
                ingredients: allSelectedIngredients,
                cookingTime: '20-25分鐘',
                difficulty: '中等',
                instructions: [
                    '將所有食材洗淨，按需要切好備用',
                    '根據食材特性，先處理需要較長時間烹調的材料',
                    '按順序加入不同食材，確保熟度一致',
                    '適當調味，試味後調整',
                    '完成後即可上碟享用'
                ]
            };
        }

        return recipe;
    }

    // 根據菜式類型創建食譜
    function createRecipeFromDishType(dishType, customDish) {
        let recipe = {};

        if (customDish) {
            // 使用自定義菜式名稱
            recipe.name = customDish;
            
            if (containsAny(customDish, ['炒', '蛋', '煎', '炸'])) {
                recipe.description = `一道美味的${customDish}，做法簡單，味道豐富。`;
                recipe.ingredients = ['主要食材', '調料', '配菜'];
                recipe.cookingTime = '15-20分鐘';
                recipe.difficulty = '簡單';
                recipe.instructions = [
                    '準備所需食材，清洗並切好',
                    '將主要食材處理好（如醃製）',
                    '熱鍋下油，爆香調料',
                    '按熟成時間順序加入食材',
                    '調味後炒至熟透',
                    '裝盤即可享用'
                ];
            } else if (containsAny(customDish, ['湯', '燴', '煮'])) {
                recipe.description = `一道暖胃的${customDish}，適合全家人享用。`;
                recipe.ingredients = ['主料', '配料', '調料'];
                recipe.cookingTime = '25-30分鐘';
                recipe.difficulty = '中等';
                recipe.instructions = [
                    '準備所需食材，清洗並切好',
                    '先將難熟的食材預處理',
                    '加水或高湯煮沸',
                    '按順序加入不同食材',
                    '調味後慢火煮至食材軟熟',
                    '完成後即可享用'
                ];
            } else if (containsAny(customDish, ['蒸', '燜'])) {
                recipe.description = `一道清淡健康的${customDish}，保留食材原味。`;
                recipe.ingredients = ['主料', '調料', '配菜'];
                recipe.cookingTime = '20-25分鐘';
                recipe.difficulty = '簡單';
                recipe.instructions = [
                    '準備所需食材，清洗並切好',
                    '將食材處理好並調味',
                    '放入蒸爐或煲中',
                    '控制火候和時間',
                    '蒸至食材熟透',
                    '取出後即可享用'
                ];
            } else {
                recipe.description = `一道精心製作的${customDish}，色香味俱全。`;
                recipe.ingredients = ['主料', '配料', '調料'];
                recipe.cookingTime = '20-30分鐘';
                recipe.difficulty = '中等';
                recipe.instructions = [
                    '準備所需食材，清洗並切好',
                    '按食譜要求處理各樣食材',
                    '掌握好火候和時間',
                    '按步驟進行烹調',
                    '調味後完成',
                    '裝飾後即可上桌'
                ];
            }
        } else {
            // 根據選擇的菜式類型
            switch (dishType) {
                case '中式':
                    recipe = {
                        name: '中式小炒',
                        description: '一道快速美味的中式小炒，適合忙碌的晚上。',
                        ingredients: ['肉類', '時令蔬菜', '薑蒜', '調料'],
                        cookingTime: '15分鐘',
                        difficulty: '簡單',
                        instructions: [
                            '肉類洗淨切片，用鹽、生抽、生粉醃製',
                            '蔬菜洗淨切好，薑蒜爆香',
                            '熱鍋下油，先炒肉類至半熟',
                            '加入蔬菜炒勻',
                            '調味後炒熟即可上碟'
                        ]
                    };
                    break;
                case '西式':
                    recipe = {
                        name: '簡易意粉',
                        description: '一道簡單美味的西式意粉，製作快捷。',
                        ingredients: ['意粉', '醬料', '蔬菜', '調料'],
                        cookingTime: '20分鐘',
                        difficulty: '簡單',
                        instructions: [
                            '大鍋加水煮沸，加入意粉煮熟',
                            '同時熱鍋炒香蔬菜',
                            '加入醬料煮成醬汁',
                            '將煮熟的意粉與醬汁拌勻',
                            '撒上芝士或香草即可'
                        ]
                    };
                    break;
                case '日式':
                    recipe = {
                        name: '日式茶泡飯',
                        description: '一道簡單的日式料理，清淡舒適。',
                        ingredients: ['白飯', '海苔', '梅子', '綠茶', '配菜'],
                        cookingTime: '5分鐘',
                        difficulty: '簡單',
                        instructions: [
                            '準備好白飯在碗中',
                            '在飯上放海苔和梅子',
                            '加入熱綠茶至剛好覆蓋飯面',
                            '加入喜歡的配菜',
                            '即可享用'
                        ]
                    };
                    break;
                case '泰式':
                    recipe = {
                        name: '泰式炒河',
                        description: '酸甜開胃的泰式風味炒河粉。',
                        ingredients: ['河粉', '豆芽', '蝦米', '雞蛋', '調料'],
                        cookingTime: '15分鐘',
                        difficulty: '中等',
                        instructions: [
                            '河粉用溫水浸軟，瀝乾備用',
                            '熱鍋下油，炒香蝦米',
                            '加入蛋炒散',
                            '加入河粉炒勻',
                            '加入蔬菜炒熟',
                            '加入泰式調料炒勻',
                            '上碟後撒上花生碎'
                        ]
                    };
                    break;
                case '素食':
                    recipe = {
                        name: '時蔬炒雜',
                        description: '一道營養豐富的素食料理，色彩繽紛。',
                        ingredients: ['各種時令蔬菜', '豆腐', '調料'],
                        cookingTime: '15分鐘',
                        difficulty: '簡單',
                        instructions: [
                            '所有蔬菜洗淨切好',
                            '豆腐切塊，稍微煎香',
                            '熱鍋下油，先炒不易熟的蔬菜',
                            '加入易熟的蔬菜炒勻',
                            '加入豆腐炒勻',
                            '調味後炒熟即可'
                        ]
                    };
                    break;
                case '海鮮':
                    recipe = {
                        name: '清蒸海魚',
                        description: '清淡健康的海鮮料理，保持魚的原汁原味。',
                        ingredients: ['海魚', '薑絲', '蔥絲', '蒸魚豉油'],
                        cookingTime: '15分鐘',
                        difficulty: '簡單',
                        instructions: [
                            '海魚洗淨，抹乾水分',
                            '在魚身上放薑片，放入蒸爐蒸8-10分鐘',
                            '取出後倒掉蒸出的水，移走薑片',
                            '在魚身上放薑絲和蔥絲',
                            '燒熱油，淋在薑絲和蔥絲上',
                            '最後淋上蒸魚豉油即可'
                        ]
                    };
                    break;
                default:
                    recipe = {
                        name: '自選菜式',
                        description: '一道按照您喜好製作的美味料理。',
                        ingredients: ['主料', '配料', '調料'],
                        cookingTime: '20-25分鐘',
                        difficulty: '中等',
                        instructions: [
                            '準備所需食材，清洗並切好',
                            '按食譜要求處理各樣食材',
                            '掌握好火候和時間',
                            '按步驟進行烹調',
                            '調味後完成',
                            '裝飾後即可上桌'
                        ]
                    };
            }
        }

        return recipe;
    }

    // 渲染食譜HTML
    function renderRecipe(recipe) {
        return `
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            
            <div class="recipe-info">
                <div>
                    <strong>烹調時間:</strong> ${recipe.cookingTime}
                </div>
                <div>
                    <strong>難度:</strong> ${recipe.difficulty}
                </div>
            </div>
            
            <h4>所需材料:</h4>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            
            <h4>烹調步驟:</h4>
            <ol>
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
    }

    // 輔助函數：檢查字符串是否包含任何關鍵字
    function containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }
});

// 新增功能：編輯材料/食譜
let currentEditType = ''; // 'ingredients' 或 'recipes'
let currentSeason = '春季';

// 季節性材料推薦
const seasonalIngredients = {
    '春季': ['筍', '韭菜', '菠菜', '豌豆苗', '小蔥', '香椿', '蘆筍', '竹筍'],
    '夏季': ['冬瓜', '苦瓜', '絲瓜', '茄子', '空心菜', '豆角', '番茄', '黃瓜', '西瓜', '芒果'],
    '秋季': ['南瓜', '蓮藕', '栗子', '白蘿蔔', '白菜', '柿子', '梨', '葡萄', '芋頭', '山藥'],
    '冬季': ['白菜', '蘿蔔', '羊肉', '黑木耳', '銀耳', '桂圓', '紅棗', '薑']
};

// 更新材料選項根據季節
function updateIngredientsBySeason(season) {
    const ingredientSelect = document.getElementById('ingredient');
    const seasonalItems = seasonalIngredients[season] || [];
    
    // 清空現有選項（除了原有的）
    Array.from(ingredientSelect.options).forEach(option => {
        if (!['雞', '豬', '牛', '魚', '蝦', '蛋', '菜', '菇', '豆腐', '米', '麵', '粉絲'].includes(option.value)) {
            option.remove();
        }
    });
    
    // 添加季節性材料
    seasonalItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        ingredientSelect.appendChild(option);
    });
}

// 顯示編輯材料界面
function editIngredients() {
    currentEditType = 'ingredients';
    currentSeason = document.getElementById('season').value;
    
    // 獲取當前材料列表
    const ingredientSelect = document.getElementById('ingredient');
    const existingIngredients = Array.from(ingredientSelect.options).map(option => option.textContent);
    
    // 生成編輯表單
    let formHTML = `
        <div class="form-group">
            <label for="edit-season">選擇季節：</label>
            <select id="edit-season" onchange="updateEditSeason(this.value)">
                <option value="春季" ${currentSeason === '春季' ? 'selected' : ''}>春季</option>
                <option value="夏季" ${currentSeason === '夏季' ? 'selected' : ''}>夏季</option>
                <option value="秋季" ${currentSeason === '秋季' ? 'selected' : ''}>秋季</option>
                <option value="冬季" ${currentSeason === '冬季' ? 'selected' : ''}>冬季</option>
            </select>
        </div>
        <div class="form-group">
            <label for="new-ingredient">添加新材料：</label>
            <input type="text" id="new-ingredient" placeholder="輸入材料名稱">
        </div>
        <div class="form-group">
            <label>當前材料列表：</label>
            <div id="ingredients-list">
                ${existingIngredients.map((ingredient, index) => `
                    <div class="ingredient-item">
                        <span>${ingredient}</span>
                        <button type="button" onclick="removeIngredient(${index})" style="margin-left: 10px; background-color: #f44336; color: white; border: none; padding: 3px 8px; border-radius: 3px;">刪除</button>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="form-buttons">
            <button type="button" class="btn-save" onclick="saveIngredients()">保存</button>
            <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
        </div>
    `;
    
    document.getElementById('modalTitle').textContent = '編輯材料';
    document.getElementById('editForm').innerHTML = formHTML;
    document.getElementById('editModal').style.display = 'block';
}

// 更新編輯時的季節
function updateEditSeason(season) {
    currentSeason = season;
    // 重新加載材料列表以反映季節變化
    editIngredients();
}

// 刪除材料
function removeIngredient(index) {
    const ingredientSelect = document.getElementById('ingredient');
    const allOptions = Array.from(ingredientSelect.options);
    if (index >= 0 && index < allOptions.length) {
        allOptions[index].remove();
    }
    // 重新渲染編輯界面
    editIngredients();
}

// 保存材料
function saveIngredients() {
    const newIngredient = document.getElementById('new-ingredient').value.trim();
    if (newIngredient) {
        const ingredientSelect = document.getElementById('ingredient');
        
        // 檢查是否已存在相同的材料
        const existingOption = Array.from(ingredientSelect.options).find(opt => opt.value === newIngredient);
        if (!existingOption) {
            const option = document.createElement('option');
            option.value = newIngredient;
            option.textContent = newIngredient;
            ingredientSelect.appendChild(option);
            alert(`已添加材料：${newIngredient}`);
        } else {
            alert('該材料已存在！');
        }
    }
    
    closeModal();
}

// 顯示編輯食譜界面
function editRecipes() {
    currentEditType = 'recipes';
    
    // 生成編輯表單
    let formHTML = `
        <div class="form-group">
            <label for="recipe-name">食譜名稱：</label>
            <input type="text" id="recipe-name" placeholder="輸入食譜名稱">
        </div>
        <div class="form-group">
            <label for="recipe-category">菜式類別：</label>
            <select id="recipe-category">
                <option value="主菜">主菜</option>
                <option value="湯水">湯水</option>
                <option value="甜品">甜品</option>
                <option value="健康餐">健康餐</option>
                <option value="重口味">重口味</option>
            </select>
        </div>
        <div class="form-group">
            <label for="recipe-cuisine">菜系：</label>
            <select id="recipe-cuisine">
                <option value="中式">中式</option>
                <option value="西式">西式</option>
                <option value="日式">日式</option>
                <option value="韓式">韓式</option>
                <option value="泰式">泰式</option>
                <option value="台式">台式</option>
            </select>
        </div>
        <div class="form-group">
            <label for="recipe-ingredients">所需材料（逗號分隔）：</label>
            <textarea id="recipe-ingredients" placeholder="例如：雞肉, 蔬菜, 醬油, 薑"></textarea>
        </div>
        <div class="form-group">
            <label for="recipe-steps">烹調步驟（每行一步）：</label>
            <textarea id="recipe-steps" placeholder="1. 準備食材\\n2. 熱鍋下油\\n3. 加入食材炒制\\n4. 調味後完成"></textarea>
        </div>
        <div class="form-buttons">
            <button type="button" class="btn-save" onclick="saveRecipe()">保存</button>
            <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
        </div>
    `;
    
    document.getElementById('modalTitle').textContent = '編輯食譜';
    document.getElementById('editForm').innerHTML = formHTML;
    document.getElementById('editModal').style.display = 'block';
}

// 保存食譜
function saveRecipe() {
    const name = document.getElementById('recipe-name').value.trim();
    const category = document.getElementById('recipe-category').value;
    const cuisine = document.getElementById('recipe-cuisine').value;
    const ingredientsText = document.getElementById('recipe-ingredients').value.trim();
    const stepsText = document.getElementById('recipe-steps').value.trim();
    
    if (!name || !ingredientsText || !stepsText) {
        alert('請填寫所有必要字段！');
        return;
    }
    
    // 解析材料和步驟
    const ingredients = ingredientsText.split(',').map(i => i.trim()).filter(i => i);
    const steps = stepsText.split('\n').filter(s => s.trim());
    
    // 構造要發送到後端的數據
    const newRecipe = {
        name: name,
        category: category,
        ingredients: ingredients,
        method: steps.join('\n'),
        cuisine: cuisine,
        season: document.getElementById('season').value
    };
    
    // 發送請求到後端API
    fetch('/api/recipes_db', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecipe)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            icookRecipes.push(data.recipe); // 更新本地數據
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('保存食譜失敗！');
    });
    
    closeModal();
}

// 關閉彈窗
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// 載入最新食譜
function loadLatestRecipes() {
    fetch('/api/recipes/load_latest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(`已載入最新食譜數據！新增了 ${data.count} 個食譜。`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('載入最新食譜失敗！');
    });
}

// 保存數據
function saveData() {
    // 準備要發送到後端的數據
    const currentIngredients = Array.from(document.getElementById('ingredient').options).map(option => ({
        name: option.textContent,
        type: '其他',
        season: '四季',
        cookingMethods: ['炒', '煮']
    }));
    
    const payload = {
        ingredients: currentIngredients,
        recipes: icookRecipes
    };
    
    // 發送請求到後端API
    fetch('/api/save_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('保存數據失敗！');
    });
}

// 模擬從icook抓取的食譜數據
const icookRecipes = [
    {
        id: 1,
        name: "清爽夏日涼拌絲瓜",
        category: "主菜",
        ingredients: ["絲瓜", "蒜", "醬油", "醋"],
        method: "1. 絲瓜去皮切片，焯水後過冷水備用\n2. 蒜切末，加入醬油、醋調成醬汁\n3. 將絲瓜與醬汁拌勻即可",
        cuisine: "中式",
        season: "夏季"
    },
    {
        id: 2,
        name: "滋補冬日羊肉爐",
        category: "主菜",
        ingredients: ["羊肉", "白蘿蔔", "薑", "枸杞"],
        method: "1. 羊肉切塊焯水去腥\n2. 白蘿蔔去皮切塊\n3. 將所有材料放入鍋中燉煮\n4. 燉至羊肉軟爛即可",
        cuisine: "中式",
        season: "冬季"
    },
    {
        id: 3,
        name: "秋季養生蓮藕排骨湯",
        category: "湯水",
        ingredients: ["排骨", "蓮藕", "薑", "鹽"],
        method: "1. 排骨焯水去血沫\n2. 蓮藕去皮切塊\n3. 所有材料放入鍋中，加水煮沸\n4. 轉小火慢燉2小時",
        cuisine: "中式",
        season: "秋季"
    },
    {
        id: 4,
        name: "甜蜜桂花糯米丸子",
        category: "甜品",
        ingredients: ["糯米粉", "桂花", "糖", "水"],
        method: "1. 糯米粉加水揉成光滑面團\n2. 分成小份搓成圓球\n3. 水開後放入糯米球煮熟\n4. 撒上桂花和糖即可",
        cuisine: "中式",
        season: "四季"
    },
    {
        id: 5,
        name: "清爽青木瓜沙拉",
        category: "健康餐",
        ingredients: ["青木瓜", "番茄", "花生", "魚露"],
        method: "1. 青木瓜刨絲，番茄切片\n2. 花生烘烤碾碎\n3. 所有材料混合，加入調料拌勻\n4. 裝盤即可",
        cuisine: "泰式",
        season: "四季"
    },
    {
        id: 6,
        name: "麻辣香鍋",
        category: "重口味",
        ingredients: ["各種蔬菜", "肉類", "火鍋料", "花椒"],
        method: "1. 各種食材處理好備用\n2. 熱油爆香花椒、辣椒\n3. 加入各種食材翻炒\n4. 加入調料炒熟即可",
        cuisine: "中式",
        season: "四季"
    }
];