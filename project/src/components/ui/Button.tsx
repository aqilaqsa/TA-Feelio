import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive' | 'nice' | 'outline2' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500',
    secondary: 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400',
    accent: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 focus:ring-yellow-300',
    outline: 'bg-sky-600 border-2 border-white text-white hover:bg-sky-700 focus:ring-sky-400',
    outline2: 'bg-pink-500 border-2 border-white text-white hover:bg-pink-700 focus:ring-pink-400',
    ghost: 'bg-gray-200 text-sky-900 hover:bg-gray-300 focus:ring-sky-300',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    nice: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-400 text-white focus:ring-yellow-500',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };
  
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={allClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;