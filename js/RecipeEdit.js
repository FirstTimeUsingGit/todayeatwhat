const EditRecipes = ({ recipes, ingredients, cookingMethods, ingredientTypes, saveData }) => {
  const [name, setName] = React.useState('');
  const [selectedType, setSelectedType] = React.useState(null);
  const [selectedIngredients, setSelectedIngredients] = React.useState([]);
  const [method, setMethod] = React.useState('');
  const [selectedRecipesCookingMethods, setSelectedRecipesCookingMethods] = React.useState([]);
  const [seasons, setSeasons] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIngredientsFilter, setSelectedIngredientsFilter] = React.useState([]);
  const [editRecipeId, setEditRecipeId] = React.useState(null);

  const typeOptions = ingredientTypes.map(t => ({ value: t, label: t }));
  const ingredientOptions = selectedType
    ? ingredients
        .filter(ing => ing.type === selectedType.value)
        .map(ing => ({ value: ing.id, label: ing.name }))
    : [];
  const ingredientFilterOptions = ingredients.map(ing => ({ value: ing.id, label: ing.name }));
  const cookingMethodOptions = cookingMethods.map(m => ({ value: m, label: m }));
  const seasonOptions = ['春', '夏', '秋', '冬', '四季'].map(s => ({ value: s, label: s }));

  const handleSubmit = () => {
  if (name && selectedIngredients.length > 0 && method && selectedRecipesCookingMethods.length > 0 && seasons.length > 0) {
    const recipeData = {
      name,
      ingredients: selectedIngredients.map(ing => ing.value),
      method,
      cookingMethods: selectedRecipesCookingMethods.map(m => m.value),
      seasons: seasons.map(s => s.value)
    };
    let updatedRecipes = [...recipes];
    if (editRecipeId) {
      updatedRecipes = recipes.map(recipe =>
        recipe.id === editRecipeId ? { ...recipe, ...recipeData } : recipe
      );
    } else {
      updatedRecipes.push({ id: Date.now(), ...recipeData });
    }
    saveData({
      ingredients,
      recipes: updatedRecipes,
      cookingMethods,
      ingredientTypes
    });
    setEditRecipeId(null);
    setName('');
    setSelectedType(null);
    setSelectedIngredients([]);
    setMethod('');
    setSelectedRecipesCookingMethods([]);
    setSeasons([]);
  }
};

  const handleEdit = (recipe) => {
    setEditRecipeId(recipe.id);
    setName(recipe.name);
    setSelectedIngredients(
      ingredients
        .filter(ing => recipe.ingredients.includes(ing.id))
        .map(ing => ({ value: ing.id, label: ing.name }))
    );
    setMethod(recipe.method || '');
    setSelectedRecipesCookingMethods(recipe.cookingMethods.map(cm => ({ value: cm, label: cm })));
    setSeasons(recipe.seasons.map(s => ({ value: s, label: s })));
  };

  const handleCancel = () => {
    setEditRecipeId(null);
    setName('');
    setSelectedType(null);
    setSelectedIngredients([]);
    setMethod('');
    setSelectedRecipesCookingMethods([]);
    setSeasons([]);
  };

  const handleDelete = (id) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    saveData({
      ingredients,
      recipes: updatedRecipes,
      cookingMethods,
      ingredientTypes
    });
  };

  const removeIngredient = (id) => {
    setSelectedIngredients(prev => prev.filter(ing => ing.value !== id));
  };

  const filteredRecipes = recipes.filter(recipe => {
    const recipeIngredients = ingredients.filter(ing => recipe.ingredients.includes(ing.id));
    const matchesSearchTerm =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipeIngredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      recipe.seasons.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      recipe.cookingMethods.some(cm => cm.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (recipe.method && recipe.method.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIngredients =
      selectedIngredientsFilter.length === 0 ||
      selectedIngredientsFilter.some(ing => recipe.ingredients.includes(ing.value));
    return matchesSearchTerm && matchesIngredients;
  });

  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className="select__option p-2 cursor-pointer hover:bg-gray-100">
      <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
      {label}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">編輯菜單</h2>
      <div className="mb-4 sm:mb-6 bg-gray-50 p-4 rounded-md shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">{editRecipeId ? '更新菜單' : '新增菜單'}</h3>
        <input
          className="border p-2 rounded w-full mb-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="菜單名稱"
        />
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">材料類型</label>
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            className="basic-multi-select"
            placeholder="選擇材料類型..."
            isClearable
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">食材</label>
          <Select
            isMulti
            isSearchable
            options={ingredientOptions}
            value={selectedIngredients}
            onChange={setSelectedIngredients}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder={selectedType ? "選擇食材..." : "請先選擇材料類型"}
            isDisabled={!selectedType}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
          {selectedIngredients.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedIngredients.map(ing => (
                <span key={ing.value} className="custom-tag">
                  {ing.label}
                  <span
                    className="custom-tag-remove"
                    onClick={() => removeIngredient(ing.value)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">做法</label>
          <textarea
            className="border p-2 rounded w-full text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="輸入做法..."
            rows="4"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">烹調方式</label>
          <Select
            isMulti
            isSearchable
            options={cookingMethodOptions}
            value={selectedRecipesCookingMethods}
            onChange={setSelectedRecipesCookingMethods}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇烹調方式..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">季節</label>
          <Select
            isMulti
            isSearchable
            options={seasonOptions}
            value={seasons}
            onChange={setSeasons}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇季節..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 text-base sm:text-lg"
            onClick={handleSubmit}
          >
            {editRecipeId ? '更新' : '保存'}
          </button>
          {editRecipeId && (
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-200 text-base sm:text-lg"
              onClick={handleCancel}
            >
              取消
            </button>
          )}
        </div>
      </div>
      <div className="mb-4">
        <input
          className="border p-2 rounded w-full mb-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜尋菜單..."
        />
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">食材</label>
          <Select
            isMulti
            isSearchable
            options={ingredientFilterOptions}
            value={selectedIngredientsFilter}
            onChange={setSelectedIngredientsFilter}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇食材..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">菜單名稱</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">食材</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">做法</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">季節</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">烹調方法</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map(recipe => {
              const recipeIngredients = ingredients.filter(ing => recipe.ingredients.includes(ing.id));
              return (
                <tr key={recipe.id}>
                  <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{recipe.name}</td>
                  <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{recipeIngredients.map(ing => ing.name).join(', ')}</td>
                  <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base whitespace-pre-wrap">{recipe.method || '-'}</td>
                  <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{recipe.seasons.join(', ')}</td>
                  <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{recipe.cookingMethods.join(', ')}</td>
                  <td className="border px-2 sm:px-4 py-2 flex gap-2">
                    <button
                      className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
                      onClick={() => handleEdit(recipe)}
                    >
                      編輯
                    </button>
                    <button
                      className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-btn hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.EditRecipes = EditRecipes;