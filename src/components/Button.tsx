import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

// Tudo que não for isOutlined vai para dentro de props.
export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button
      // Caso isOutlined exista, vai colocar a classe outlined.
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props}
    />
  );
}