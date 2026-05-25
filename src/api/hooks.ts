import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

// --- Types (Can be moved to a separate types file) ---
export interface Item {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'RESERVED' | 'GIVEN' | 'DELETED';
  // Add other fields based on your Prisma schema
}

// --- Hooks ---

/**
 * Hook to fetch all active items (for Discovery Feed)
 */
export const useGetActiveItems = () => {
  return useQuery({
    queryKey: ['items', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get<Item[]>('/items?status=ACTIVE');
      return data;
    },
  });
};

/**
 * Hook to fetch a single item by ID
 */
export const useGetItemById = (id: string) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Item>(`/items/${id}`);
      return data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};

/**
 * Hook to register a new user
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: { phone_number: string; password: string; full_name?: string; location?: string }) => {
      const { data } = await apiClient.post('/auth/register', userData);
      return data;
    },
  });
};

/**
 * Hook to create a new item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Omit<Item, 'id' | 'status'>) => {
      const { data } = await apiClient.post<Item>('/items', newItem);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch items list after a successful creation
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
