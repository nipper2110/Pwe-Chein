import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMe, loginUser, logoutUser, registerUser, type User } from '../api/auth'

const ME_KEY = ['me']

/** Who is logged in? `data` is the user, null (logged out), or undefined while we are still asking. */
export const useUser = () =>
  useQuery({
    queryKey: ME_KEY,
    queryFn: fetchMe,
    staleTime: Infinity, // only changes when the user logs in or out
    retry: false,
  })

// After login/register we put the user straight into the cache, so the whole app updates at once.
export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user: User) => queryClient.setQueryData(ME_KEY, user),
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (user: User) => queryClient.setQueryData(ME_KEY, user),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => queryClient.setQueryData(ME_KEY, null),
  })
}
