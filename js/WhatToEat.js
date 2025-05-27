const WhatToEat = ({ recipes, ingredients, cookingMethods, ingredientTypes }) => {
  const [filters, setFilters] = React.useState({});
  const [selectedType, setSelectedType] = React.useState(null);
  const [results, setResults] = React.useState([]);

  const typeOptions = ingredientTypes.map(t => ({ value: t, label: t }));
  const ingredientOptions = selectedType
    ? ingredients
        .filter(ing => ing.type === selectedType.value)
        .map(ing => ({ value: ing.id, label: ing.name }))
    : [];
  const seasonOptions = ['春', '夏', '秋', '冬', '四季'].map(s => ({ value: s, label: s }));
  const cookingMethodOptions = cookingMethods.map(m => ({ value: m, label: m }));
  const ingredientTypeOptions = ingredientTypes.map(t => ({ value: t, label: t }));

  const getFilteredRecipes = (filters) => {
    return recipes.filter(recipe => {
      const recipeIngredients = ingredients.filter(ing => recipe.ingredients.includes(ing.id));
      return (
        (!filters.ingredients || filters.ingredients.length === 0 || filters.ingredients.some(ingId => recipe.ingredients.includes(ingId))) &&
        (!filters.seasons || filters.seasons.length === 0 || recipe.seasons.some(s => filters.seasons.includes(s))) &&
        (!filters.cookingMethods || filters.cookingMethods.length === 0 || recipe.cookingMethods.some(cm => filters.cookingMethods.includes(cm))) &&
        (!filters.types || filters.types.length === 0 || recipeIngredients.some(ing => filters.types.includes(ing.type)))
      );
    });
  };

  const getRandomRecipe = () => {
    return recipes[Math.floor(Math.random() * recipes.length)];
  };

  const handleSearch = () => {
    setResults(getFilteredRecipes({
      ingredients: filters.ingredients?.map(opt => opt.value) || [],
      seasons: filters.seasons?.map(opt => opt.value) || [],
      cookingMethods: filters.cookingMethods?.map(opt => opt.value) || [],
      types: filters.types?.map(opt => opt.value) || []
    }));
  };

  const handleRandom = () => {
    const randomRecipe = getRandomRecipe();
    setResults(randomRecipe ? [randomRecipe] : []);
  };

  const removeIngredient = (id) => {
    setFilters(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ing => ing.value !== id) || []
    }));
  };

  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className="select__option p-2 cursor-pointer hover:bg-gray-100">
      <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
      {label}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">唔知食乜好</h2>
      <div className="mb-4 sm:mb-6 bg-gray-50 p-4 rounded-md shadow">
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">材料類型</label>
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            className="basic-multi-select"
            placeholder="選擇種類..."
            isClearable
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">食材</label>
          <Select
            isMulti
            isSearchable
            options={ingredientOptions}
            value={filters?.ingredients || []}
            onChange={(selected) => setFilters(prev => ({ ...prev, ingredients: selected }))}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder={selectedType ? "選擇食材..." : "請先選擇材料類型"}
            isDisabled={!selectedType}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
          {filters?.ingredients?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.ingredients.map(ing => (
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
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">季節</label>
          <Select
            isMulti
            isSearchable
            options={seasonOptions}
            value={filters?.seasons || []}
            onChange={(selected) => setFilters(prev => ({ ...prev, seasons: selected }))}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇季節..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">烹調方式</label>
          <Select
            isMulti
            isSearchable
            options={cookingMethodOptions}
            value={filters?.cookingMethods || []}
            onChange={(selected) => setFilters(prev => ({ ...prev, cookingMethods: selected }))}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇烹調方式..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">種類</label>
          <Select
            isMulti
            isSearchable
            options={ingredientTypeOptions}
            value={filters?.types || []}
            onChange={(selected) => setFilters(prev => ({ ...prev, types: selected }))}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇種類..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 text-base sm:text-lg"
            onClick={handleSearch}
          >
            搜尋
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition duration-200 text-base sm:text-lg"
            onClick={handleRandom}
          >
            隨機選取
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-sm sm:text-base">菜單名稱</th>
              <th className="border px-4 py-2 text-sm sm:text-base">食材</th>
              <th className="border px-4 py-2 text-sm sm:text-base">做法</th>
            </tr>
          </thead>
          <tbody>
            {results.map(recipe => {
              const recipeIngredients = ingredients.filter(ing => recipe.ingredients.includes(ing.id));
              return (
                <tr key={recipe.id}>
                  <td className="border px-2 sm:px-4 py-2 py-sm sm:text-base">{recipe.name}</td>
                  <td className="border px-2 sm:px-4 py-2 py-sm sm:text-base">{recipeIngredients.map(ing => ing.name).join(', ')}</td>
                  <td className="border px-2 sm:px-4 py-2 py-sm sm:text-base whitespace-pre-wrap">{recipe.method || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.WhatToEat = WhatToEat;