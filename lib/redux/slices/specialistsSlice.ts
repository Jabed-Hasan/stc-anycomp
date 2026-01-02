import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface CompanyType {
  name: string;
  description: string;
}

interface Offering {
  name: string;
  description?: string;
}

interface ServiceOffering {
  name: string;
}

interface Media {
  id: string;
  uuid: string;
  specialist_id: string;
  file_name: string;
  file_url: string;
  cloudinary_public_id: string;
  file_size: number;
  display_order: number;
  mime_type: string;
  media_type: string;
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Specialist {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: string;
  platform_fee: string;
  final_price: string;
  duration_days: number;
  service_category: string;
  supported_company_types: CompanyType[];
  additional_offerings: Offering[];
  service_offerings_data: ServiceOffering[];
  is_draft: boolean;
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected';
  is_verified: boolean;
  provider_id: string;
  media: Media[];
  created_at: string;
  updated_at: string;
}

interface SpecialistsState {
  specialists: Specialist[];
  currentSpecialist: Specialist | null;
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

const initialState: SpecialistsState = {
  specialists: [],
  currentSpecialist: null,
  loading: false,
  error: null,
  meta: {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  },
};

// Create Specialist
export const createSpecialist = createAsyncThunk(
  'specialists/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/v1/specialists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get All Specialists
export const fetchSpecialists = createAsyncThunk(
  'specialists/fetchAll',
  async (params: { page?: number; limit?: number; searchTerm?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

      const response = await fetch(
        `http://localhost:5001/api/v1/specialists/live?${queryParams.toString()}`
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Single Specialist
export const fetchSpecialistById = createAsyncThunk(
  'specialists/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}`);
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Specialist
export const updateSpecialist = createAsyncThunk(
  'specialists/update',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Publish Specialist
export const publishSpecialist = createAsyncThunk(
  'specialists/publish',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_draft: false }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Specialist
export const deleteSpecialist = createAsyncThunk(
  'specialists/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: Get All Specialists
export const fetchAllSpecialistsAdmin = createAsyncThunk(
  'specialists/admin/fetchAll',
  async (params: { 
    page?: number; 
    limit?: number; 
    searchTerm?: string;
    is_draft?: boolean;
    verification_status?: string;
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      if (params.is_draft !== undefined) queryParams.append('is_draft', params.is_draft.toString());
      if (params.verification_status) queryParams.append('verification_status', params.verification_status);

      const response = await fetch(
        `http://localhost:5001/api/v1/specialists/admin/all?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: Get Drafts
export const fetchDraftsAdmin = createAsyncThunk(
  'specialists/admin/fetchDrafts',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(
        `http://localhost:5001/api/v1/specialists/admin/all?is_draft=true&${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Public: Fetch Published Specialists (no auth required)
export const fetchPublishedSpecialists = createAsyncThunk(
  'specialists/public/fetchPublished',
  async (params: { page?: number; limit?: number; search?: string; category?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);

      const response = await fetch(
        `http://localhost:5001/api/v1/specialists/live?${queryParams.toString()}`
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: Get Published
export const fetchPublishedAdmin = createAsyncThunk(
  'specialists/admin/fetchPublished',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(
        `http://localhost:5001/api/v1/specialists/admin/all?is_draft=false&${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: Approve Specialist
export const approveSpecialist = createAsyncThunk(
  'specialists/admin/approve',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: Reject Specialist
export const rejectSpecialist = createAsyncThunk(
  'specialists/admin/reject',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: Submit for Review
export const submitForReview = createAsyncThunk(
  'specialists/admin/submitReview',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/v1/specialists/${id}/submit-review`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const specialistsSlice = createSlice({
  name: 'specialists',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSpecialist: (state) => {
      state.currentSpecialist = null;
    },
  },
  extraReducers: (builder) => {
    // Create Specialist
    builder
      .addCase(createSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists.unshift(action.payload);
        state.currentSpecialist = action.payload;
      })
      .addCase(createSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Specialists
    builder
      .addCase(fetchSpecialists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialists.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Specialist by ID
    builder
      .addCase(fetchSpecialistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpecialist = action.payload;
      })
      .addCase(fetchSpecialistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Specialist
    builder
      .addCase(updateSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.specialists.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
        state.currentSpecialist = action.payload;
      })
      .addCase(updateSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Publish Specialist
    builder
      .addCase(publishSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.specialists.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
        state.currentSpecialist = action.payload;
      })
      .addCase(publishSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Specialist
    builder
      .addCase(deleteSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = state.specialists.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Public: Fetch Published Specialists
    builder
      .addCase(fetchPublishedSpecialists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedSpecialists.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPublishedSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Admin: Fetch All Specialists
    builder
      .addCase(fetchAllSpecialistsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSpecialistsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAllSpecialistsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Admin: Fetch Drafts
    builder
      .addCase(fetchDraftsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchDraftsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Admin: Fetch Published
    builder
      .addCase(fetchPublishedAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPublishedAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Admin: Approve Specialist
    builder
      .addCase(approveSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.specialists.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
      })
      .addCase(approveSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Admin: Reject Specialist
    builder
      .addCase(rejectSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.specialists.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
      })
      .addCase(rejectSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Admin: Submit for Review
    builder
      .addCase(submitForReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.specialists.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.specialists[index] = action.payload;
        }
      })
      .addCase(submitForReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentSpecialist } = specialistsSlice.actions;
export default specialistsSlice.reducer;
