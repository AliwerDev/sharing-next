import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

// --- Types ---
export interface Category {
  id: string;
  name: string;
}

export interface ItemImage {
  id: string;
  image_url: string;
}

export interface User {
  id: string;
  full_name: string;
  phone_number?: string;
  location: string;
  karma_points: number;
  role: 'user' | 'admin';
  avatar_url?: string;
  latitude?: number;
  longitude?: number;
  badges?: string[];
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'RESERVED' | 'GIVEN' | 'DELETED';
  category_id: string;
  user_id: string;
  created_at: string;
  category?: Category;
  images?: ItemImage[];
  user?: User;
  distance?: string | null;
}

export interface Request {
  id: string;
  item_id: string;
  requester_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  created_at: string;
  item?: Item;
  requester?: User;
}

export interface Report {
  id: string;
  item_id: string;
  reporter_id: string;
  reason: string;
  created_at: string;
}

// --- Hooks ---

/**
 * Fetch all categories
 */
export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>('/categories');
      return data;
    },
  });
};

/**
 * Fetch all active items with optional filters
 */
export const useGetActiveItems = (filters?: { search?: string; category_id?: string; latitude?: string; longitude?: string }) => {
  return useQuery({
    queryKey: ['items', 'active', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category_id && filters.category_id !== 'all') {
        params.append('category_id', filters.category_id);
      }
      if (filters?.latitude) params.append('latitude', filters.latitude);
      if (filters?.longitude) params.append('longitude', filters.longitude);
      const { data } = await apiClient.get<{ data: Item[]; meta: any }>(`/items?${params.toString()}`);
      return data.data;
    },
  });
};

/**
 * Fetch my items (shares)
 */
export const useGetMyItems = () => {
  return useQuery({
    queryKey: ['items', 'my'],
    queryFn: async () => {
      const { data } = await apiClient.get<Item[]>('/items/my');
      return data;
    },
  });
};

/**
 * Fetch a single item by ID
 */
export const useGetItemById = (id: string) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Item>(`/items/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to register a new user
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: { 
      phone_number: string; 
      password: string; 
      full_name?: string; 
      location?: string;
      latitude?: number;
      longitude?: number;
    }) => {
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
    mutationFn: async (newItem: { title: string; description: string; category_id: string; images?: string[] }) => {
      const { data } = await apiClient.post<Item>('/items', newItem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

/**
 * Upload an image file
 */
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<{ url: string }>('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  });
};

/**
 * Fetch my sent requests
 */
export const useGetMyRequests = () => {
  return useQuery({
    queryKey: ['requests', 'my'],
    queryFn: async () => {
      const { data } = await apiClient.get<Request[]>('/requests/my');
      return data;
    },
  });
};

/**
 * Fetch incoming requests for my items
 */
export const useGetIncomingRequests = () => {
  return useQuery({
    queryKey: ['requests', 'incoming'],
    queryFn: async () => {
      const { data } = await apiClient.get<Request[]>('/requests/incoming');
      return data;
    },
  });
};

/**
 * Request an item
 */
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { item_id: string }) => {
      const { data } = await apiClient.post<Request>('/requests', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
};

/**
 * Update request status (approve/reject/complete)
 */
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Request['status'] }) => {
      const { data } = await apiClient.patch<Request>(`/requests/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * Fetch profile details of authenticated user
 */
export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/users/me');
      return data;
    },
  });
};

/**
 * Update user profile details
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData: { 
      full_name?: string; 
      phone_number?: string; 
      location?: string;
      avatar_url?: string;
      latitude?: number;
      longitude?: number;
      badges?: string[];
    }) => {
      const { data } = await apiClient.patch<User>('/users/me', updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * Create a report for an item
 */
export const useCreateReport = () => {
  return useMutation({
    mutationFn: async (body: { item_id: string; reason: string }) => {
      const { data } = await apiClient.post<Report>('/reports', body);
      return data;
    },
  });
};

/**
 * Fetch all reports (Admin only)
 */
export const useGetReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await apiClient.get<any[]>('/reports');
      return data;
    },
  });
};

/**
 * Delete/dismiss a report (Admin only)
 */
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

/**
 * Delete a listing (Owner or Admin)
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

/**
 * Create a category (Admin only)
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string }) => {
      const { data } = await apiClient.post<Category>('/categories', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

/**
 * Update a category (Admin only)
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await apiClient.patch<Category>(`/categories/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

/**
 * Delete a category (Admin only)
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
