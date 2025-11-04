import { NavLink } from 'react-router-dom';
import { Home, Heart, MessageCircle, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/discovery', icon: Heart, label: 'Открытия' },
    { to: '/places', icon: MapPin, label: 'Места' },
    { to: '/matches', icon: MessageCircle, label: 'Чаты' },
    { to: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <nav className="safe-bottom bg-white border-t border-gray-200 px-2">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                isActive ? 'text-pink-500' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-xs mt-1 font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-t-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
