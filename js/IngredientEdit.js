const EditIngredients = ({ ingredients, recipes, cookingMethods, ingredientTypes, saveData }) => {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [season, setSeason] = React.useState('');
  const [selectedCookingMethods, setSelectedCookingMethods] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCookingMethods, setFilterCookingMethods] = React.useState([]);
  const [editIngredientId, setEditIngredientId] = React.useState(null);

  const seasonOptions = ['春', '夏', '秋', '冬', '四季'].map(s => ({ value: s, label: s }));
  const cookingMethodOptions = cookingMethods.map(m => ({ value: m, label: m }));
  const typeOptions = ingredientTypes.map(t => ({ value: t, label: t }));

  const handleSubmit = () => {
    if (name && type && season && selectedCookingMethods.length > 0) {
      const ingredientData = {
        name,
        type,
        season,
        cookingMethods: selectedCookingMethods.map(m => m.value)
      };
      let updatedIngredients = [...ingredients];
      if (editIngredientId) {
        updatedIngredients = ingredients.map(ing =>
          ing.id === editIngredientId ? { ...ing, ...ingredientData } : ing
        );
      } else {
        updatedIngredients.push({ id: Date.now(), ...ingredientData });
      }
      saveData({
        ingredients: updatedIngredients,
        recipes,
        cookingMethods,
        ingredientTypes
      });
      setEditIngredientId(null);
      setName('');
      setType('');
      setSeason('');
      setSelectedCookingMethods([]);
    }
  };

  const handleEdit = (ingredient) => {
    setEditIngredientId(ingredient.id);
    setName(ingredient.name);
    setType(ingredient.type);
    setSeason(ingredient.season);
    setSelectedCookingMethods(ingredient.cookingMethods.map(m => ({ value: m, label: m })));
  };

  const handleCancel = () => {
    setEditIngredientId(null);
    setName('');
    setType('');
    setSeason('');
    setSelectedCookingMethods([]);
  };

  const handleDelete = (id) => {
    const updatedIngredients = ingredients.filter(ing => ing.id !== id);
    saveData({
      ingredients: updatedIngredients,
      recipes,
      cookingMethods,
      ingredientTypes
    });
  };

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearchTerm =
      ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.cookingMethods.some(method => method.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCookingMethods =
      filterCookingMethods.length === 0 ||
      filterCookingMethods.some(method => ing.cookingMethods.includes(method.value));
    return matchesSearchTerm && matchesCookingMethods;
  });

  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className="select__option p-2 cursor-pointer hover:bg-gray-100">
      <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
      {label}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">編輯材料</h2>
      <div className="mb-4 sm:mb-6 bg-gray-50 p-4 rounded-md shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">{editIngredientId ? '更新材料' : '新增材料'}</h3>
        <input
          className="border p-2 rounded w-full mb-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="材料名稱"
        />
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">種類</label>
          <Select
            options={typeOptions}
            value={type ? { value: type, label: type } : null}
            onChange={(selected) => setType(selected ? selected.value : '')}
            className="basic-multi-select"
            placeholder="選擇種類..."
            isClearable
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">季節</label>
          <Select
            options={seasonOptions}
            value={season ? { value: season, label: season } : null}
            onChange={(selected) => setSeason(selected ? selected.value : '')}
            className="basic-multi-select"
            placeholder="選擇季節..."
            isClearable
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">烹調方式</label>
          <Select
            isMulti
            isSearchable
            options={cookingMethodOptions}
            value={selectedCookingMethods}
            onChange={setSelectedCookingMethods}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇烹調方式..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 text-base sm:text-lg"
            onClick={handleSubmit}
          >
            {editIngredientId ? '更新' : '保存'}
          </button>
          {editIngredientId && (
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
          className="border p-2 rounded w-full mb-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜尋材料..."
        />
        <div className="mb-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">烹調方式</label>
          <Select
            isMulti
            isSearchable
            options={cookingMethodOptions}
            value={filterCookingMethods}
            onChange={setFilterCookingMethods}
            components={{ Option: CustomOption }}
            className="basic-multi-select"
            placeholder="選擇搜尋的烹調方式..."
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">食材名稱</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">種類</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">季節</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">烹調方式</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredIngredients.map(ing => (
              <tr key={ing.id}>
                <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{ing.name}</td>
                <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{ing.type}</td>
                <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{ing.season}</td>
                <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{ing.cookingMethods.join(', ')}</td>
                <td className="border px-2 sm:px-4 py-2 flex gap-2">
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
                    onClick={() => handleEdit(ing)}
                  >
                    編輯
                  </button>
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                    onClick={() => handleDelete(ing.id)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.EditIngredients = EditIngredients;