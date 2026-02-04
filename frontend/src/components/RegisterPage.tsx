import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (name: string) => void;
}

export function RegisterPage({ onRegister }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password === confirmPassword) {
      onRegister(name);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Регистрация</h2>
          <p className="text-gray-600">Создайте аккаунт для начала работы</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Имя *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Пароль *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Подтвердите пароль *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            {password !== confirmPassword && confirmPassword && (
              <p className="text-sm text-red-600 mt-1">Пароли не совпадают</p>
            )}
          </div>

          <button
            type="submit"
            disabled={password !== confirmPassword}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Зарегистрироваться
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Регистрируясь, вы соглашаетесь с{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700">
            условиями использования
          </a>
        </div>
      </div>
    </div>
  );
}
