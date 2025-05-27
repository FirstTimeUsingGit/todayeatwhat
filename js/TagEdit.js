const TagEdit = ({ cookingMethods, ingredientTypes, saveData, ingredients, recipes }) => {
  const [newCookingMethod, setNewCookingMethod] = React.useState('');
  const [editCookingMethod, setEditCookingMethod] = React.useState('');
  const [editCookingMethodIndex, setEditCookingMethodIndex] = React.useState(null);
  const [newIngredientType, setNewIngredientType] = React.useState('');
  const [editIngredientType, setEditIngredientType] = React.useState('');
  const [editIngredientTypeIndex, setEditIngredientTypeIndex] = React.useState(null);

  const handleAddCookingMethod = () => {
    if (newCookingMethod && !cookingMethods.includes(newCookingMethod)) {
      const updatedCookingMethods = [...cookingMethods, newCookingMethod];
      saveData({
        ingredients,
        recipes,
        cookingMethods: updatedCookingMethods,
        ingredientTypes
      });
      setNewCookingMethod('');
    }
  };

  const handleEditCookingMethod = (index) => {
    setEditCookingMethod(cookingMethods[index]);
    setEditCookingMethodIndex(index);
  };

  const handleUpdateCookingMethod = () => {
    if (editCookingMethod && editCookingMethodIndex !== null) {
      const updatedCookingMethods = [...cookingMethods];
      updatedCookingMethods[editCookingMethodIndex] = editCookingMethod;
      saveData({
        ingredients,
        recipes,
        cookingMethods: updatedCookingMethods,
        ingredientTypes
      });
      setEditCookingMethod('');
      setEditCookingMethodIndex(null);
    }
  };

  const handleDeleteCookingMethod = (index) => {
    const updatedCookingMethods = cookingMethods.filter((_, i) => i !== index);
    saveData({
      ingredients,
      recipes,
      cookingMethods: updatedCookingMethods,
      ingredientTypes
    });
  };

  const handleAddIngredientType = () => {
    if (newIngredientType && !ingredientTypes.includes(newIngredientType)) {
      const updatedIngredientTypes = [...ingredientTypes, newIngredientType];
      saveData({
        ingredients,
        recipes,
        cookingMethods,
        ingredientTypes: updatedIngredientTypes
      });
      setNewIngredientType('');
    }
  };

  const handleEditIngredientType = (index) => {
    setEditIngredientType(ingredientTypes[index]);
    setEditIngredientTypeIndex(index);
  };

  const handleUpdateIngredientType = () => {
    if (editIngredientType && editIngredientTypeIndex !== null) {
      const updatedIngredientTypes = [...ingredientTypes];
      updatedIngredientTypes[editIngredientTypeIndex] = editIngredientType;
      saveData({
        ingredients,
        recipes,
        cookingMethods,
        ingredientTypes: updatedIngredientTypes
      });
      setEditIngredientType('');
      setEditIngredientTypeIndex(null);
    }
  };

  const handleDeleteIngredientType = (index) => {
    const updatedIngredientTypes = ingredientTypes.filter((_, i) => i !== index);
    saveData({
      ingredients,
      recipes,
      cookingMethods,
      ingredientTypes: updatedIngredientTypes
    });
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">標籤管理</h2>

      <div className="mb-6 bg-gray-50 p-4 rounded-md shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">烹調方式管理</h3>
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded w-full text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editCookingMethodIndex !== null ? editCookingMethod : newCookingMethod}
            onChange={(e) => editCookingMethodIndex !== null ? setEditCookingMethod(e.target.value) : setNewCookingMethod(e.target.value)}
            placeholder="輸入烹調方式（如：烤）"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 text-base sm:text-lg"
            onClick={editCookingMethodIndex !== null ? handleUpdateCookingMethod : handleAddCookingMethod}
          >
            {editCookingMethodIndex !== null ? '更新' : '添加'}
          </button>
          {editCookingMethodIndex !== null && (
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-200 text-base sm:text-lg"
              onClick={() => {
                setEditCookingMethod('');
                setEditCookingMethodIndex(null);
              }}
            >
              取消
            </button>
          )}
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-sm sm:text-base">烹調方式</th>
              <th className="border px-4 py-2 text-sm sm:text-base">操作</th>
            </tr>
          </thead>
          <tbody>
            {cookingMethods.map((cm, index) => (
              <tr key={index}>
                <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{cm}</td>
                <td className="border px-2 sm:px-4 py-2 flex gap-2">
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
                    onClick={() => handleEditCookingMethod(index)}
                  >
                    編輯
                  </button>
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                    onClick={() => handleDeleteCookingMethod(index)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-md shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">種類管理</h3>
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded w-full text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editIngredientTypeIndex !== null ? editIngredientType : newIngredientType}
            onChange={(e) => editIngredientTypeIndex !== null ? setEditIngredientType(e.target.value) : setNewIngredientType(e.target.value)}
            placeholder="輸入種類（如：穀物）"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 text-base sm:text-lg"
            onClick={editIngredientTypeIndex !== null ? handleUpdateIngredientType : handleAddIngredientType}
          >
            {editIngredientTypeIndex !== null ? '更新' : '添加'}
          </button>
          {editIngredientTypeIndex !== null && (
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-200 text-base sm:text-lg"
              onClick={() => {
                setEditIngredientType('');
                setEditIngredientTypeIndex(null);
              }}
            >
              取消
            </button>
          )}
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-sm sm:text-base">種類</th>
              <th className="border px-4 py-2 text-sm sm:text-base">操作</th>
            </tr>
          </thead>
          <tbody>
            {ingredientTypes.map((type, index) => (
              <tr key={index}>
                <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">{type}</td>
                <td className="border px-2 sm:px-4 py-2 flex gap-2">
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
                    onClick={() => handleEditIngredientType(index)}
                  >
                    編輯
                  </button>
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                    onClick={() => handleDeleteIngredientType(index)}
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

window.TagEdit = TagEdit;