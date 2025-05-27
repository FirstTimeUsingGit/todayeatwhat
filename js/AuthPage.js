const Auth = ({ onLogin }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = () => {
    if (typeof md5 !== 'function') {
      console.error('MD5 library not loaded');
      setError('系統錯誤：無法載入加密功能，請稍後重試。');
      return;
    }

    const input = password.trim();
    const hashedPassword = md5(input);
    const validHashes = [
      '1404834e52a4c6cac9444f1fb3c62d3c',
      'ba952731f97fb058035aa399b1cb3d5c'
    ];
    console.log('Input:', input, 'Hashed:', hashedPassword);

    if (validHashes.includes(hashedPassword)) {
      localStorage.setItem('isAuthenticated', 'true');
      onLogin();
    } else {
      setError('密碼錯誤，請輸入正確密碼。');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-md bg-white shadow-lg rounded-lg mt-4 sm:mt-6 text-center">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">請輸入密碼</h1>
      <input
        type="password"
        className="border p-2 rounded w-full mb-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="輸入密碼"
      />
      {error && <p className="text-red-600 mb-2 text-sm sm:text-base">{error}</p>}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 text-base sm:text-lg"
        onClick={handleSubmit}
      >
        提交
      </button>
    </div>
  );
};

window.Auth = Auth;