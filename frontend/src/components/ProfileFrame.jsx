const ProfileFrame = ({ type = 'none', children }) => {
  const frames = {
    none: '',
    gold: 'ring-4 ring-yellow-400 shadow-xl shadow-yellow-400/50 animate-pulse',
    diamond: 'ring-4 ring-cyan-400 shadow-xl shadow-cyan-400/50 animate-pulse',
    ruby: 'ring-4 ring-red-500 shadow-xl shadow-red-500/50 animate-pulse',
    rainbow: 'ring-4 ring-gradient-to-r from-red-500 via-yellow-500 to-blue-500 shadow-xl animate-spin-slow'
  };

  if (type === 'rainbow') {
    return (
      <div className="relative inline-block">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full opacity-75 blur-sm animate-spin-slow" />
        <div className="relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${frames[type]}`}>
      {children}
    </div>
  );
};

export default ProfileFrame;
