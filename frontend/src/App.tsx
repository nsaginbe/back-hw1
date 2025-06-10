import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Toaster, toast } from 'react-hot-toast'
import { UserForm } from './components/UserForm'
import { UserList } from './components/UserList'
import { userApi } from './services/api'
import type { User, CreateUserData, UpdateUserData } from './types/user'

function App() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const queryClient = useQueryClient()

  const { data: users = [], isLoading, error } = useQuery('users', userApi.getUsers, {
    retry: 1,
    onError: (error: any) => {
      console.error('Query error:', error)
      toast.error(error.response?.data?.detail || 'Failed to fetch users')
    }
  })

  const createUserMutation = useMutation(userApi.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      toast.success('User created successfully')
    },
    onError: (error: any) => {
      console.error('Create error:', error)
      toast.error(error.response?.data?.detail || 'Failed to create user')
    },
  })

  const updateUserMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateUserData }) => userApi.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setEditingUser(null)
        toast.success('User updated successfully')
      },
      onError: (error: any) => {
        console.error('Update error:', error)
        toast.error(error.response?.data?.detail || 'Failed to update user')
      },
    }
  )

  const deleteUserMutation = useMutation(userApi.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.detail || 'Failed to delete user')
    },
  })

  const handleSubmit = (data: CreateUserData | UpdateUserData) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data })
    } else {
      createUserMutation.mutate(data as CreateUserData)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h1>
          <UserForm
            onSubmit={handleSubmit}
            initialData={editingUser || undefined}
            isUpdate={!!editingUser}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Users List</h2>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-600">Error loading users. Please try again.</p>
              <button
                onClick={() => queryClient.invalidateQueries('users')}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App
