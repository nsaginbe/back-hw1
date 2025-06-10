import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { CreateUserData, UpdateUserData } from '../types/user';

interface UserFormProps {
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  initialData?: Partial<CreateUserData>;
  isUpdate?: boolean;
}

export function UserForm({ onSubmit, initialData, isUpdate = false }: UserFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateUserData>({
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 bg-white"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password {!isUpdate && '(required)'}
        </label>
        <div className="mt-1">
          <input
            type="password"
            id="password"
            {...register('password', { required: !isUpdate ? 'Password is required' : false })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 bg-white"
            placeholder={isUpdate ? "Leave blank to keep current password" : "Enter your password"}
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          {isUpdate ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
} 